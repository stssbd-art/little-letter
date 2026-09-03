import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import {
  addPaidCreditForEmail,
  consumeLetterForEmail,
  consumeLetterCreditForEmail,
  consumeMixtapeForEmail,
  consumeMixtapeCreditForEmail,
  hasUsageDatabase,
  isValidSenderEmail,
  mergeSenderIntoCookieUsage,
  normalizeSenderEmail,
  readSenderUsage,
  writeSenderUsage,
} from "@/lib/sender-usage";
import {
  FREE_LETTERS,
  FREE_MIXTAPES,
  LETTER_PRICE_LABEL,
  LETTER_PRICE_PENCE,
  isDemoMode,
  type CheckoutKind,
} from "@/lib/usage-labels";

export {
  FREE_LETTERS,
  FREE_MIXTAPES,
  FREE_CARDS,
  LETTER_PRICE_LABEL,
  CARD_PRICE_LABEL,
  MIX_MULTI_SONG_LABEL,
  MIX_ONE_SONG_LABEL,
  LETTER_PRICE_PENCE,
  CARD_PRICE_PENCE,
  MIX_ONE_SONG_PENCE,
  MIX_MULTI_SONG_PENCE,
  mixtapePrice,
  isDemoMode,
  type CheckoutKind,
} from "@/lib/usage-labels";

/** @deprecated use LETTER_PRICE_* — kept for older imports during transition */
export const SEND_PRICE_LABEL = LETTER_PRICE_LABEL;
export const SEND_PRICE_PENCE = LETTER_PRICE_PENCE;

export function paymentsEnabled() {
  return !isDemoMode();
}

/** Production paid site must persist free/paid usage by email in Postgres. */
export function requiresEmailUsageDb() {
  return process.env.NODE_ENV === "production" && !isDemoMode();
}

const LETTER_FREE_COOKIE = "ll_letter_free_count";
const LEGACY_FREE_COOKIE = "ll_free_used";
const LETTER_CREDITS_COOKIE = "ll_letter_credits";
const MIX_FREE_COOKIE = "ll_mix_free_count";
const MIX_CREDITS_COOKIE = "ll_mix_credits";
const LEGACY_CREDITS_COOKIE = "ll_credits";
const SESSIONS_COOKIE = "ll_paid_sessions";

function secret() {
  return (
    process.env.USAGE_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    "little-letter-dev-secret"
  );
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex").slice(0, 24);
}

function pack(value: string) {
  return `${value}.${sign(value)}`;
}

function unpack(raw: string | undefined) {
  if (!raw) return null;
  const idx = raw.lastIndexOf(".");
  if (idx <= 0) return null;
  const value = raw.slice(0, idx);
  const sig = raw.slice(idx + 1);
  const expected = sign(value);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return value;
}

function parseCount(raw: string | null, max?: number) {
  const n = Number(raw || "0");
  if (!Number.isFinite(n) || n <= 0) return 0;
  const v = Math.floor(n);
  return typeof max === "number" ? Math.min(v, max) : v;
}

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

export type UsageSnapshot = {
  letterFreeUsed: number;
  letterCredits: number;
  mixCredits: number;
  usedSessionIds: string[];
  /** legacy mirrors for older callers */
  freeUsed: boolean;
  mixFreeUsed: number;
  credits: number;
};

function finalize(
  usage: Omit<UsageSnapshot, "freeUsed" | "credits">
): UsageSnapshot {
  return {
    ...usage,
    freeUsed: usage.letterFreeUsed >= FREE_LETTERS,
    credits: usage.letterCredits + usage.mixCredits,
  };
}

async function readCookieUsage(): Promise<UsageSnapshot> {
  const jar = await cookies();

  let letterFreeUsed = parseCount(
    unpack(jar.get(LETTER_FREE_COOKIE)?.value),
    FREE_LETTERS
  );
  if (
    letterFreeUsed === 0 &&
    unpack(jar.get(LEGACY_FREE_COOKIE)?.value) === "1"
  ) {
    letterFreeUsed = 1;
  }

  let letterCredits = parseCount(unpack(jar.get(LETTER_CREDITS_COOKIE)?.value));
  const legacyCredits = parseCount(
    unpack(jar.get(LEGACY_CREDITS_COOKIE)?.value)
  );
  if (letterCredits === 0 && legacyCredits > 0) {
    letterCredits = legacyCredits;
  }

  const mixFreeUsed = parseCount(
    unpack(jar.get(MIX_FREE_COOKIE)?.value),
    FREE_MIXTAPES
  );
  const mixCredits = parseCount(unpack(jar.get(MIX_CREDITS_COOKIE)?.value));
  const sessionsRaw = unpack(jar.get(SESSIONS_COOKIE)?.value) || "";
  const usedSessionIds = sessionsRaw
    ? sessionsRaw.split(",").filter(Boolean)
    : [];

  return finalize({
    letterFreeUsed,
    letterCredits,
    mixCredits,
    usedSessionIds,
    mixFreeUsed,
  });
}

export async function readUsage(senderEmail?: string): Promise<UsageSnapshot> {
  const cookie = await readCookieUsage();
  if (!senderEmail || !isValidSenderEmail(senderEmail)) {
    return cookie;
  }
  try {
    const emailUsage = await readSenderUsage(senderEmail);
    return finalize(mergeSenderIntoCookieUsage(cookie, emailUsage));
  } catch (err) {
    /*
     * Production must not fall open to empty cookies — that lets people keep
     * sending free letters after their email pool is used (or when DB is down).
     */
    if (requiresEmailUsageDb()) {
      throw err instanceof Error
        ? err
        : new Error("Send tracking is temporarily unavailable.");
    }
    return cookie;
  }
}

export async function writeUsage(usage: UsageSnapshot, senderEmail?: string) {
  const jar = await cookies();
  const next = finalize(usage);
  jar.set(
    LETTER_FREE_COOKIE,
    pack(String(Math.max(0, Math.min(next.letterFreeUsed, FREE_LETTERS)))),
    cookieOpts
  );
  jar.set(
    LETTER_CREDITS_COOKIE,
    pack(String(Math.max(0, next.letterCredits))),
    cookieOpts
  );
  jar.set(
    MIX_FREE_COOKIE,
    pack(String(Math.max(0, Math.min(next.mixFreeUsed, FREE_MIXTAPES)))),
    cookieOpts
  );
  jar.set(
    MIX_CREDITS_COOKIE,
    pack(String(Math.max(0, next.mixCredits))),
    cookieOpts
  );
  jar.set(
    SESSIONS_COOKIE,
    pack(next.usedSessionIds.slice(-30).join(",")),
    cookieOpts
  );

  if (senderEmail && isValidSenderEmail(senderEmail) && hasUsageDatabase()) {
    try {
      /* Credits + payment sessions only — free pools stay untouched here. */
      await writeSenderUsage(senderEmail, {
        letterFreeUsed: 0,
        mixFreeUsed: 0,
        letterCredits: next.letterCredits,
        mixCredits: next.mixCredits,
        usedSessionIds: next.usedSessionIds,
      });
    } catch {
      /* cookie write still succeeded */
    }
  }
}

export async function getSendAccess(senderEmail?: string) {
  let usage: UsageSnapshot;
  try {
    usage = await readUsage(senderEmail);
  } catch {
    if (requiresEmailUsageDb()) {
      return {
        allowed: false as const,
        reason: "tracking_unavailable" as const,
        usage: await readCookieUsage(),
      };
    }
    usage = await readCookieUsage();
  }
  if (isDemoMode()) {
    return { allowed: true as const, reason: "demo" as const, usage };
  }
  if (usage.letterFreeUsed < FREE_LETTERS) {
    return { allowed: true as const, reason: "free" as const, usage };
  }
  if (usage.letterCredits > 0) {
    return { allowed: true as const, reason: "credit" as const, usage };
  }
  return { allowed: false as const, reason: "payment_required" as const, usage };
}

/** E-cards are free — no payment or credit required. */
export async function getCardSendAccess(senderEmail?: string) {
  const usage = await readUsage(senderEmail);
  return { allowed: true as const, reason: "free" as const, usage };
}

/** No-op for free e-cards — nothing to consume. */
export async function consumeCardSendAccess(senderEmail?: string) {
  return readUsage(senderEmail);
}

export async function consumeSendAccess(senderEmail?: string) {
  const usage = await readUsage(senderEmail);
  if (isDemoMode()) {
    return usage;
  }

  if (requiresEmailUsageDb() && !hasUsageDatabase()) {
    throw new Error("Send tracking is temporarily unavailable. Please try again shortly.");
  }

  /* Email + DB is the source of truth — never fall back to cookies (bypass). */
  if (senderEmail && isValidSenderEmail(senderEmail) && hasUsageDatabase()) {
    const cookie = await readCookieUsage();
    /*
     * Same-device rule: if this browser already used its free letters, do not
     * burn free allowance on a different email — paid credit only.
     */
    const emailUsage =
      cookie.letterFreeUsed >= FREE_LETTERS
        ? await consumeLetterCreditForEmail(senderEmail)
        : await consumeLetterForEmail(senderEmail);
    const next = finalize({
      letterFreeUsed: Math.max(
        cookie.letterFreeUsed,
        emailUsage.letterFreeUsed
      ),
      letterCredits: emailUsage.letterCredits,
      mixFreeUsed: Math.max(usage.mixFreeUsed, emailUsage.mixFreeUsed),
      mixCredits: Math.max(usage.mixCredits, emailUsage.mixCredits),
      usedSessionIds: Array.from(
        new Set([...usage.usedSessionIds, ...emailUsage.usedSessionIds])
      ).slice(-30),
    });
    /* Cookies only — DB already updated atomically. */
    await writeUsage(next);
    return next;
  }

  if (requiresEmailUsageDb()) {
    throw new Error("Your email is required to track free sends.");
  }

  if (usage.letterFreeUsed < FREE_LETTERS) {
    usage.letterFreeUsed += 1;
  } else if (usage.letterCredits > 0) {
    usage.letterCredits -= 1;
  } else {
    throw new Error("No send credit available.");
  }
  const next = finalize(usage);
  await writeUsage(next, senderEmail);
  return next;
}

export async function getMixtapeSendAccess(senderEmail?: string) {
  const usage = await readUsage(senderEmail);
  if (isDemoMode()) {
    return { allowed: true as const, reason: "demo" as const, usage };
  }
  if (usage.mixFreeUsed < FREE_MIXTAPES) {
    return { allowed: true as const, reason: "free" as const, usage };
  }
  if (usage.mixCredits > 0) {
    return { allowed: true as const, reason: "credit" as const, usage };
  }
  return { allowed: false as const, reason: "payment_required" as const, usage };
}

export async function consumeMixtapeSendAccess(senderEmail?: string) {
  const usage = await readUsage(senderEmail);
  if (isDemoMode()) {
    return usage;
  }

  if (requiresEmailUsageDb() && !hasUsageDatabase()) {
    throw new Error("Send tracking is temporarily unavailable. Please try again shortly.");
  }

  if (senderEmail && isValidSenderEmail(senderEmail) && hasUsageDatabase()) {
    const cookie = await readCookieUsage();
    const emailUsage =
      cookie.mixFreeUsed >= FREE_MIXTAPES
        ? await consumeMixtapeCreditForEmail(senderEmail)
        : await consumeMixtapeForEmail(senderEmail);
    const next = finalize({
      letterFreeUsed: Math.max(
        usage.letterFreeUsed,
        emailUsage.letterFreeUsed
      ),
      letterCredits: Math.max(usage.letterCredits, emailUsage.letterCredits),
      mixFreeUsed: Math.max(cookie.mixFreeUsed, emailUsage.mixFreeUsed),
      mixCredits: emailUsage.mixCredits,
      usedSessionIds: Array.from(
        new Set([...usage.usedSessionIds, ...emailUsage.usedSessionIds])
      ).slice(-30),
    });
    await writeUsage(next);
    return next;
  }

  if (requiresEmailUsageDb()) {
    throw new Error("Your email is required to track free mixtape sends.");
  }

  if (usage.mixFreeUsed < FREE_MIXTAPES) {
    usage.mixFreeUsed += 1;
  } else if (usage.mixCredits > 0) {
    usage.mixCredits -= 1;
  } else {
    throw new Error("No mixtape send credit available.");
  }
  const next = finalize(usage);
  await writeUsage(next, senderEmail);
  return next;
}

export async function addPaidCredit(
  sessionId: string,
  kind: CheckoutKind = "letter",
  senderEmail?: string
) {
  const usage = await readUsage(senderEmail);
  if (usage.usedSessionIds.includes(sessionId)) {
    return { usage, alreadyApplied: true as const };
  }

  if (senderEmail && isValidSenderEmail(senderEmail) && hasUsageDatabase()) {
    try {
      const emailResult = await addPaidCreditForEmail(
        senderEmail,
        sessionId,
        kind
      );
      const next = finalize(
        mergeSenderIntoCookieUsage(usage, emailResult.usage)
      );
      if (!next.usedSessionIds.includes(sessionId)) {
        next.usedSessionIds = [...next.usedSessionIds, sessionId].slice(-30);
      }
      await writeUsage(next);
      return {
        usage: next,
        alreadyApplied: emailResult.alreadyApplied,
      };
    } catch (err) {
      if (requiresEmailUsageDb()) throw err;
      /* fall through to cookie credits in local/dev without DB */
    }
  }

  if (requiresEmailUsageDb()) {
    throw new Error("Could not apply payment credit for this email.");
  }

  if (kind === "mixtape") {
    usage.mixCredits += 1;
  } else {
    /* letter + card payments both grant a send credit */
    usage.letterCredits += 1;
  }
  usage.usedSessionIds = [...usage.usedSessionIds, sessionId].slice(-30);
  const next = finalize(usage);
  await writeUsage(next, senderEmail);
  return { usage: next, alreadyApplied: false as const };
}

export { normalizeSenderEmail, isValidSenderEmail, hasUsageDatabase };
