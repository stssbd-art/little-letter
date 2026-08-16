import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import {
  addPaidCreditForEmail,
  consumeLetterForEmail,
  consumeMixtapeForEmail,
  hasUsageDatabase,
  isValidSenderEmail,
  mergeSenderIntoCookieUsage,
  normalizeSenderEmail,
  readSenderUsage,
  writeSenderUsage,
} from "@/lib/sender-usage";

/** Letters: first 2 free, then £0.99 each */
export const FREE_LETTERS = 2;
export const LETTER_PRICE_PENCE = 99;
export const LETTER_PRICE_LABEL = "£0.99";

/** Mixtapes: first one free, then £1.25 for 1 song, £1.55 for 2+ songs */
export const FREE_MIXTAPES = 1;
export const MIX_ONE_SONG_PENCE = 125;
export const MIX_ONE_SONG_LABEL = "£1.25";
export const MIX_MULTI_SONG_PENCE = 155;
export const MIX_MULTI_SONG_LABEL = "£1.55";

/** @deprecated use LETTER_PRICE_* — kept for older imports during transition */
export const SEND_PRICE_LABEL = LETTER_PRICE_LABEL;
export const SEND_PRICE_PENCE = LETTER_PRICE_PENCE;

export type CheckoutKind = "letter" | "mixtape";

export function mixtapePrice(trackCount: number) {
  const count = Math.max(0, Math.floor(trackCount));
  if (count <= 1) {
    return {
      pence: MIX_ONE_SONG_PENCE,
      label: MIX_ONE_SONG_LABEL,
      name: "Little Letter mixtape (1 song)",
      description: "Send a one-song mixtape by email",
    };
  }
  return {
    pence: MIX_MULTI_SONG_PENCE,
    label: MIX_MULTI_SONG_LABEL,
    name: "Little Letter mixtape (multi-song)",
    description: "Send a multi-song mixtape by email",
  };
}

/**
 * Public launch: payments ON by default.
 * Set DEMO_MODE=true on Vercel only for temporary free testing.
 */
export function isDemoMode() {
  return process.env.DEMO_MODE === "true";
}

export function paymentsEnabled() {
  return !isDemoMode();
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
  } catch {
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
      await writeSenderUsage(senderEmail, {
        letterFreeUsed: next.letterFreeUsed,
        letterCredits: next.letterCredits,
        mixFreeUsed: next.mixFreeUsed,
        mixCredits: next.mixCredits,
        usedSessionIds: next.usedSessionIds,
      });
    } catch {
      /* cookie write still succeeded */
    }
  }
}

export async function getSendAccess(senderEmail?: string) {
  const usage = await readUsage(senderEmail);
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

export async function consumeSendAccess(senderEmail?: string) {
  const usage = await readUsage(senderEmail);
  if (isDemoMode()) {
    return usage;
  }

  if (senderEmail && isValidSenderEmail(senderEmail) && hasUsageDatabase()) {
    try {
      const emailUsage = await consumeLetterForEmail(senderEmail);
      const next = finalize({
        letterFreeUsed: emailUsage.letterFreeUsed,
        letterCredits: emailUsage.letterCredits,
        mixFreeUsed: Math.max(usage.mixFreeUsed, emailUsage.mixFreeUsed),
        mixCredits: Math.max(usage.mixCredits, emailUsage.mixCredits),
        usedSessionIds: Array.from(
          new Set([...usage.usedSessionIds, ...emailUsage.usedSessionIds])
        ).slice(-30),
      });
      await writeUsage(next, senderEmail);
      return next;
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("No send credit available")
      ) {
        throw err;
      }
    }
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

  if (senderEmail && isValidSenderEmail(senderEmail) && hasUsageDatabase()) {
    try {
      const emailUsage = await consumeMixtapeForEmail(senderEmail);
      const next = finalize({
        letterFreeUsed: Math.max(
          usage.letterFreeUsed,
          emailUsage.letterFreeUsed
        ),
        letterCredits: Math.max(usage.letterCredits, emailUsage.letterCredits),
        mixFreeUsed: emailUsage.mixFreeUsed,
        mixCredits: emailUsage.mixCredits,
        usedSessionIds: Array.from(
          new Set([...usage.usedSessionIds, ...emailUsage.usedSessionIds])
        ).slice(-30),
      });
      await writeUsage(next, senderEmail);
      return next;
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("No mixtape send credit available")
      ) {
        throw err;
      }
    }
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
      await writeUsage(next, senderEmail);
      return {
        usage: next,
        alreadyApplied: emailResult.alreadyApplied,
      };
    } catch {
      /* fall through */
    }
  }

  if (kind === "mixtape") {
    usage.mixCredits += 1;
  } else {
    usage.letterCredits += 1;
  }
  usage.usedSessionIds = [...usage.usedSessionIds, sessionId].slice(-30);
  const next = finalize(usage);
  await writeUsage(next, senderEmail);
  return { usage: next, alreadyApplied: false as const };
}

export { normalizeSenderEmail, isValidSenderEmail, hasUsageDatabase };
