import { sql } from "@vercel/postgres";

const FREE_LETTERS = 2;
const FREE_MIXTAPES = 1;

export type SenderUsageRecord = {
  letterFreeUsed: number;
  letterCredits: number;
  mixFreeUsed: number;
  mixCredits: number;
  usedSessionIds: string[];
};

export function normalizeSenderEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidSenderEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeSenderEmail(email));
}

export function hasUsageDatabase() {
  return Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.DATABASE_URL
  );
}

let ensured = false;

async function ensureTable() {
  if (ensured) return;
  if (!hasUsageDatabase()) return;
  await sql`
    CREATE TABLE IF NOT EXISTS sender_usage (
      email TEXT PRIMARY KEY,
      letter_free_used INT NOT NULL DEFAULT 0,
      letter_credits INT NOT NULL DEFAULT 0,
      mix_free_used INT NOT NULL DEFAULT 0,
      mix_credits INT NOT NULL DEFAULT 0,
      used_session_ids TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  ensured = true;
}

function emptyRecord(): SenderUsageRecord {
  return {
    letterFreeUsed: 0,
    letterCredits: 0,
    mixFreeUsed: 0,
    mixCredits: 0,
    usedSessionIds: [],
  };
}

function rowToRecord(row: {
  letter_free_used: number;
  letter_credits: number;
  mix_free_used: number;
  mix_credits: number;
  used_session_ids: string;
}): SenderUsageRecord {
  return {
    letterFreeUsed: Math.max(
      0,
      Math.min(FREE_LETTERS, Math.floor(Number(row.letter_free_used) || 0))
    ),
    letterCredits: Math.max(0, Math.floor(Number(row.letter_credits) || 0)),
    mixFreeUsed: Math.max(
      0,
      Math.min(FREE_MIXTAPES, Math.floor(Number(row.mix_free_used) || 0))
    ),
    mixCredits: Math.max(0, Math.floor(Number(row.mix_credits) || 0)),
    usedSessionIds: (row.used_session_ids || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export async function readSenderUsage(
  emailRaw: string
): Promise<SenderUsageRecord | null> {
  if (!hasUsageDatabase()) return null;
  const email = normalizeSenderEmail(emailRaw);
  if (!isValidSenderEmail(email)) return null;

  await ensureTable();
  const { rows } = await sql`
    SELECT letter_free_used, letter_credits, mix_free_used, mix_credits, used_session_ids
    FROM sender_usage
    WHERE email = ${email}
    LIMIT 1
  `;
  if (!rows[0]) return emptyRecord();
  return rowToRecord(
    rows[0] as {
      letter_free_used: number;
      letter_credits: number;
      mix_free_used: number;
      mix_credits: number;
      used_session_ids: string;
    }
  );
}

export async function writeSenderUsage(
  emailRaw: string,
  usage: SenderUsageRecord
) {
  if (!hasUsageDatabase()) return;
  const email = normalizeSenderEmail(emailRaw);
  if (!isValidSenderEmail(email)) return;

  await ensureTable();
  const sessions = usage.usedSessionIds.slice(-30).join(",");
  await sql`
    INSERT INTO sender_usage (
      email,
      letter_free_used,
      letter_credits,
      mix_free_used,
      mix_credits,
      used_session_ids,
      updated_at
    ) VALUES (
      ${email},
      ${Math.max(0, Math.min(FREE_LETTERS, usage.letterFreeUsed))},
      ${Math.max(0, usage.letterCredits)},
      ${Math.max(0, Math.min(FREE_MIXTAPES, usage.mixFreeUsed))},
      ${Math.max(0, usage.mixCredits)},
      ${sessions},
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      letter_free_used = EXCLUDED.letter_free_used,
      letter_credits = EXCLUDED.letter_credits,
      mix_free_used = EXCLUDED.mix_free_used,
      mix_credits = EXCLUDED.mix_credits,
      used_session_ids = EXCLUDED.used_session_ids,
      updated_at = NOW()
  `;
}

export function mergeSenderIntoCookieUsage<T extends SenderUsageRecord>(
  cookie: T,
  email: SenderUsageRecord | null
): T {
  if (!email) return cookie;
  const letterFreeUsed = Math.min(
    FREE_LETTERS,
    Math.max(cookie.letterFreeUsed, email.letterFreeUsed)
  );
  const mixFreeUsed = Math.min(
    FREE_MIXTAPES,
    Math.max(cookie.mixFreeUsed, email.mixFreeUsed)
  );
  const letterCredits = Math.max(cookie.letterCredits, email.letterCredits);
  const mixCredits = Math.max(cookie.mixCredits, email.mixCredits);
  const usedSessionIds = Array.from(
    new Set([...cookie.usedSessionIds, ...email.usedSessionIds])
  ).slice(-30);

  return {
    ...cookie,
    letterFreeUsed,
    letterCredits,
    mixFreeUsed,
    mixCredits,
    usedSessionIds,
  };
}

export async function consumeLetterForEmail(emailRaw: string) {
  const current = (await readSenderUsage(emailRaw)) ?? emptyRecord();
  if (current.letterFreeUsed < FREE_LETTERS) {
    current.letterFreeUsed += 1;
  } else if (current.letterCredits > 0) {
    current.letterCredits -= 1;
  } else {
    throw new Error("No send credit available for this email.");
  }
  await writeSenderUsage(emailRaw, current);
  return current;
}

export async function consumeMixtapeForEmail(emailRaw: string) {
  const current = (await readSenderUsage(emailRaw)) ?? emptyRecord();
  if (current.mixFreeUsed < FREE_MIXTAPES) {
    current.mixFreeUsed += 1;
  } else if (current.mixCredits > 0) {
    current.mixCredits -= 1;
  } else {
    throw new Error("No mixtape send credit available for this email.");
  }
  await writeSenderUsage(emailRaw, current);
  return current;
}

export async function addPaidCreditForEmail(
  emailRaw: string,
  sessionId: string,
  kind: "letter" | "mixtape"
) {
  const current = (await readSenderUsage(emailRaw)) ?? emptyRecord();
  if (current.usedSessionIds.includes(sessionId)) {
    return { usage: current, alreadyApplied: true as const };
  }
  if (kind === "mixtape") current.mixCredits += 1;
  else current.letterCredits += 1;
  current.usedSessionIds = [...current.usedSessionIds, sessionId].slice(-30);
  await writeSenderUsage(emailRaw, current);
  return { usage: current, alreadyApplied: false as const };
}
