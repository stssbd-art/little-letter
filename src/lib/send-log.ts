import { hasDatabase, sql } from "@/lib/db";
import { normalizeSenderEmail } from "@/lib/sender-usage";

export type SendLogKind = "letter" | "card" | "mixtape";

let ensured = false;

async function ensureTable() {
  if (ensured || !hasDatabase()) return;
  await sql`
    CREATE TABLE IF NOT EXISTS send_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      kind TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      sender_name TEXT NOT NULL DEFAULT '',
      recipient_email TEXT NOT NULL,
      recipient_name TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_send_log_created
    ON send_log (created_at DESC)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_send_log_sender
    ON send_log (sender_email)
  `;
  ensured = true;
}

/**
 * Safety / abuse record: who sent what kind of message to whom.
 * Does not store letter body, dedications, or voice notes.
 * Never throws — a logging failure must not break delivery.
 */
export async function logSend(opts: {
  kind: SendLogKind;
  senderEmail: string;
  senderName?: string;
  recipientEmail: string;
  recipientName?: string;
  subject?: string;
}): Promise<void> {
  if (!hasDatabase()) return;
  try {
    await ensureTable();
    const senderEmail = normalizeSenderEmail(opts.senderEmail);
    const recipientEmail = opts.recipientEmail.trim().toLowerCase();
    if (!senderEmail.includes("@") || !recipientEmail.includes("@")) return;

    await sql`
      INSERT INTO send_log (
        kind,
        sender_email,
        sender_name,
        recipient_email,
        recipient_name,
        subject
      ) VALUES (
        ${opts.kind},
        ${senderEmail},
        ${(opts.senderName ?? "").trim().slice(0, 80)},
        ${recipientEmail},
        ${(opts.recipientName ?? "").trim().slice(0, 80)},
        ${(opts.subject ?? "").trim().slice(0, 160)}
      )
    `;
  } catch (err) {
    console.error("send_log write failed", err);
  }
}
