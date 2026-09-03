import { hasDatabase, sql } from "@/lib/db";
import { isCardDesignId } from "@/lib/card-designs";
import { resolveLetterStationeryId } from "@/lib/letter-stationery";
import { addLetterExample } from "@/lib/shared-examples";
import { sendLetterEmail } from "@/lib/resend";
import type { VoiceNotePayload } from "@/lib/voice-note";
import { addPaidCredit } from "@/lib/usage";
import { logSend } from "@/lib/send-log";
import type { GeneratedLetter } from "@/types";

export type ScheduledSendStatus = "pending" | "processing" | "sent" | "failed";

export const MIN_SCHEDULE_MINUTES = 5;
export const MAX_SCHEDULE_DAYS = 30;

let ensured = false;

export function hasScheduledSendsDatabase() {
  return hasDatabase();
}

export function parseScheduledAt(raw: string): Date {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Pick a valid date and time.");
  }

  const min = Date.now() + MIN_SCHEDULE_MINUTES * 60_000;
  const max = Date.now() + MAX_SCHEDULE_DAYS * 24 * 60 * 60_000;
  const when = date.getTime();

  if (when < min) {
    throw new Error(`Schedule at least ${MIN_SCHEDULE_MINUTES} minutes from now.`);
  }
  if (when > max) {
    throw new Error(`You can schedule up to ${MAX_SCHEDULE_DAYS} days ahead.`);
  }

  return date;
}

async function ensureTable() {
  if (ensured) return;
  if (!hasDatabase()) return;
  await sql`
    CREATE TABLE IF NOT EXISTS scheduled_sends (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sender_email TEXT NOT NULL,
      scheduled_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payload JSONB NOT NULL,
      voice_note JSONB,
      share_example BOOLEAN NOT NULL DEFAULT false,
      kind TEXT NOT NULL DEFAULT 'letter',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      sent_at TIMESTAMPTZ,
      error TEXT
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_scheduled_sends_due
    ON scheduled_sends (scheduled_at)
    WHERE status = 'pending'
  `;
  ensured = true;
}

function normalizeLetter(letter: GeneratedLetter): GeneratedLetter {
  const isCard = Boolean(
    letter.form.cardDesign && isCardDesignId(letter.form.cardDesign)
  );
  return {
    ...letter,
    form: {
      ...letter.form,
      stationery: isCard
        ? undefined
        : resolveLetterStationeryId(letter.form.stationery),
    },
  };
}

export async function insertScheduledSend(opts: {
  senderEmail: string;
  scheduledAt: Date;
  letter: GeneratedLetter;
  voiceNote: VoiceNotePayload | null;
  shareExample: boolean;
  kind: "letter" | "card";
}): Promise<{ id: string; scheduledAt: string }> {
  await ensureTable();
  if (!hasDatabase()) {
    throw new Error(
      "Scheduled sends are not available right now. Please send now instead."
    );
  }

  const payload = normalizeLetter(opts.letter);
  const result = await sql<{ id: string; scheduled_at: string }>`
    INSERT INTO scheduled_sends (
      sender_email,
      scheduled_at,
      payload,
      voice_note,
      share_example,
      kind
    ) VALUES (
      ${opts.senderEmail},
      ${opts.scheduledAt.toISOString()},
      ${JSON.stringify(payload)}::jsonb,
      ${opts.voiceNote ? JSON.stringify(opts.voiceNote) : null}::jsonb,
      ${opts.shareExample},
      ${opts.kind}
    )
    RETURNING id, scheduled_at
  `;

  const row = result.rows[0];
  if (!row) throw new Error("Could not schedule your letter.");
  return { id: row.id, scheduledAt: row.scheduled_at };
}

type DueRow = {
  id: string;
  sender_email: string;
  payload: GeneratedLetter;
  voice_note: VoiceNotePayload | null;
  share_example: boolean;
  kind: string;
};

export async function processDueScheduledSends(limit = 10) {
  await ensureTable();
  if (!hasDatabase()) {
    return { processed: 0, sent: 0, failed: 0 };
  }

  const due = await sql<DueRow>`
    SELECT id, sender_email, payload, voice_note, share_example, kind
    FROM scheduled_sends
    WHERE status = 'pending' AND scheduled_at <= NOW()
    ORDER BY scheduled_at ASC
    LIMIT ${limit}
  `;

  let sent = 0;
  let failed = 0;

  for (const row of due.rows) {
    const claimed = await sql<{ id: string }>`
      UPDATE scheduled_sends
      SET status = 'processing'
      WHERE id = ${row.id} AND status = 'pending'
      RETURNING id
    `;
    if (!claimed.rows[0]) continue;

    const kind = row.kind === "card" ? "card" : "letter";
    const letter = normalizeLetter(row.payload);

    try {
      const result = await sendLetterEmail(letter, row.voice_note);

      await logSend({
        kind,
        senderEmail: row.sender_email,
        senderName: letter.form.senderName,
        recipientEmail: letter.form.recipientEmail,
        recipientName: letter.form.recipientName,
        subject: letter.subject,
      });

      if (row.share_example) {
        try {
          await addLetterExample(letter);
        } catch {
          /* optional */
        }
      }

      await sql`
        UPDATE scheduled_sends
        SET status = 'sent', sent_at = NOW(), error = NULL
        WHERE id = ${row.id}
      `;
      sent += 1;
      void result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not send scheduled letter.";
      await sql`
        UPDATE scheduled_sends
        SET status = 'failed', error = ${message.slice(0, 500)}
        WHERE id = ${row.id}
      `;
      try {
        await addPaidCredit(
          `refund-scheduled-${row.id}`,
          kind,
          row.sender_email
        );
      } catch {
        /* best-effort refund */
      }
      failed += 1;
    }
  }

  return { processed: due.rows.length, sent, failed };
}
