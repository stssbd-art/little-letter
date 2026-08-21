import { sql } from "@vercel/postgres";
import { FREE_LETTERS, FREE_MIXTAPES } from "@/lib/usage-labels";

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

async function ensureSenderRow(email: string) {
  await sql`
    INSERT INTO sender_usage (email)
    VALUES (${email})
    ON CONFLICT (email) DO NOTHING
  `;
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
  const letterCredits = Math.max(0, usage.letterCredits);
  const mixCredits = Math.max(0, usage.mixCredits);

  /* Free-used is only raised by consume*ForEmail — never from cookie sync. */
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
      0,
      ${letterCredits},
      0,
      ${mixCredits},
      ${sessions},
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      letter_credits = EXCLUDED.letter_credits,
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
  /*
   * Free allowances are per email in Postgres — never take the browser cookie’s
   * free-used count (that would burn a new address after testing with another).
   * Paid credits can still come from either side.
   */
  const letterCredits = Math.max(cookie.letterCredits, email.letterCredits);
  const mixCredits = Math.max(cookie.mixCredits, email.mixCredits);
  const usedSessionIds = Array.from(
    new Set([...cookie.usedSessionIds, ...email.usedSessionIds])
  ).slice(-30);

  return {
    ...cookie,
    letterFreeUsed: email.letterFreeUsed,
    mixFreeUsed: email.mixFreeUsed,
    letterCredits,
    mixCredits,
    usedSessionIds,
  };
}

/**
 * Atomically consume one letter send for this email (free pool first, then paid credit).
 * Safe against parallel requests — uses SQL WHERE guards.
 */
export async function consumeLetterForEmail(emailRaw: string) {
  if (!hasUsageDatabase()) {
    throw new Error("Usage database is not configured.");
  }
  const email = normalizeSenderEmail(emailRaw);
  if (!isValidSenderEmail(email)) {
    throw new Error("No send credit available for this email.");
  }

  await ensureTable();
  await ensureSenderRow(email);

  const free = await sql`
    UPDATE sender_usage
    SET
      letter_free_used = letter_free_used + 1,
      updated_at = NOW()
    WHERE email = ${email}
      AND letter_free_used < ${FREE_LETTERS}
    RETURNING letter_free_used, letter_credits, mix_free_used, mix_credits, used_session_ids
  `;
  if (free.rows[0]) {
    return rowToRecord(
      free.rows[0] as {
        letter_free_used: number;
        letter_credits: number;
        mix_free_used: number;
        mix_credits: number;
        used_session_ids: string;
      }
    );
  }

  const credit = await sql`
    UPDATE sender_usage
    SET
      letter_credits = letter_credits - 1,
      updated_at = NOW()
    WHERE email = ${email}
      AND letter_credits > 0
    RETURNING letter_free_used, letter_credits, mix_free_used, mix_credits, used_session_ids
  `;
  if (credit.rows[0]) {
    return rowToRecord(
      credit.rows[0] as {
        letter_free_used: number;
        letter_credits: number;
        mix_free_used: number;
        mix_credits: number;
        used_session_ids: string;
      }
    );
  }

  throw new Error("No send credit available for this email.");
}

/** E-cards: paid credit only — never the letter free allowance. Atomic. */
export async function consumeCardForEmail(emailRaw: string) {
  if (!hasUsageDatabase()) {
    throw new Error("Usage database is not configured.");
  }
  const email = normalizeSenderEmail(emailRaw);
  if (!isValidSenderEmail(email)) {
    throw new Error("No card send credit available for this email.");
  }

  await ensureTable();
  await ensureSenderRow(email);

  const credit = await sql`
    UPDATE sender_usage
    SET
      letter_credits = letter_credits - 1,
      updated_at = NOW()
    WHERE email = ${email}
      AND letter_credits > 0
    RETURNING letter_free_used, letter_credits, mix_free_used, mix_credits, used_session_ids
  `;
  if (credit.rows[0]) {
    return rowToRecord(
      credit.rows[0] as {
        letter_free_used: number;
        letter_credits: number;
        mix_free_used: number;
        mix_credits: number;
        used_session_ids: string;
      }
    );
  }

  throw new Error("No card send credit available for this email.");
}

/** Atomically consume one mixtape send (free first, then paid credit). */
export async function consumeMixtapeForEmail(emailRaw: string) {
  if (!hasUsageDatabase()) {
    throw new Error("Usage database is not configured.");
  }
  const email = normalizeSenderEmail(emailRaw);
  if (!isValidSenderEmail(email)) {
    throw new Error("No mixtape send credit available for this email.");
  }

  await ensureTable();
  await ensureSenderRow(email);

  const free = await sql`
    UPDATE sender_usage
    SET
      mix_free_used = mix_free_used + 1,
      updated_at = NOW()
    WHERE email = ${email}
      AND mix_free_used < ${FREE_MIXTAPES}
    RETURNING letter_free_used, letter_credits, mix_free_used, mix_credits, used_session_ids
  `;
  if (free.rows[0]) {
    return rowToRecord(
      free.rows[0] as {
        letter_free_used: number;
        letter_credits: number;
        mix_free_used: number;
        mix_credits: number;
        used_session_ids: string;
      }
    );
  }

  const credit = await sql`
    UPDATE sender_usage
    SET
      mix_credits = mix_credits - 1,
      updated_at = NOW()
    WHERE email = ${email}
      AND mix_credits > 0
    RETURNING letter_free_used, letter_credits, mix_free_used, mix_credits, used_session_ids
  `;
  if (credit.rows[0]) {
    return rowToRecord(
      credit.rows[0] as {
        letter_free_used: number;
        letter_credits: number;
        mix_free_used: number;
        mix_credits: number;
        used_session_ids: string;
      }
    );
  }

  throw new Error("No mixtape send credit available for this email.");
}

export async function addPaidCreditForEmail(
  emailRaw: string,
  sessionId: string,
  kind: "letter" | "mixtape" | "card"
) {
  if (!hasUsageDatabase()) {
    throw new Error("Usage database is not configured.");
  }
  const email = normalizeSenderEmail(emailRaw);
  if (!isValidSenderEmail(email)) {
    throw new Error("Invalid sender email.");
  }

  await ensureTable();
  await ensureSenderRow(email);

  const current = (await readSenderUsage(email)) ?? emptyRecord();
  if (current.usedSessionIds.includes(sessionId)) {
    return { usage: current, alreadyApplied: true as const };
  }

  if (kind === "mixtape") {
    const updated = await sql`
      UPDATE sender_usage
      SET
        mix_credits = mix_credits + 1,
        used_session_ids = CASE
          WHEN used_session_ids = '' OR used_session_ids IS NULL THEN ${sessionId}
          WHEN position(${sessionId} in used_session_ids) > 0 THEN used_session_ids
          ELSE used_session_ids || ',' || ${sessionId}
        END,
        updated_at = NOW()
      WHERE email = ${email}
        AND position(${sessionId} in COALESCE(used_session_ids, '')) = 0
      RETURNING letter_free_used, letter_credits, mix_free_used, mix_credits, used_session_ids
    `;
    if (updated.rows[0]) {
      return {
        usage: rowToRecord(
          updated.rows[0] as {
            letter_free_used: number;
            letter_credits: number;
            mix_free_used: number;
            mix_credits: number;
            used_session_ids: string;
          }
        ),
        alreadyApplied: false as const,
      };
    }
    return {
      usage: (await readSenderUsage(email)) ?? current,
      alreadyApplied: true as const,
    };
  }

  const updated = await sql`
    UPDATE sender_usage
    SET
      letter_credits = letter_credits + 1,
      used_session_ids = CASE
        WHEN used_session_ids = '' OR used_session_ids IS NULL THEN ${sessionId}
        WHEN position(${sessionId} in used_session_ids) > 0 THEN used_session_ids
        ELSE used_session_ids || ',' || ${sessionId}
      END,
      updated_at = NOW()
    WHERE email = ${email}
      AND position(${sessionId} in COALESCE(used_session_ids, '')) = 0
    RETURNING letter_free_used, letter_credits, mix_free_used, mix_credits, used_session_ids
  `;
  if (updated.rows[0]) {
    return {
      usage: rowToRecord(
        updated.rows[0] as {
          letter_free_used: number;
          letter_credits: number;
          mix_free_used: number;
          mix_credits: number;
          used_session_ids: string;
        }
      ),
      alreadyApplied: false as const,
    };
  }
  return {
    usage: (await readSenderUsage(email)) ?? current,
    alreadyApplied: true as const,
  };
}
