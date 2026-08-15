import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

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

export async function readUsage(): Promise<UsageSnapshot> {
  const jar = await cookies();

  let letterFreeUsed = parseCount(
    unpack(jar.get(LETTER_FREE_COOKIE)?.value),
    FREE_LETTERS
  );
  // migrate old single free-letter flag
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

  return {
    letterFreeUsed,
    letterCredits,
    mixCredits,
    usedSessionIds,
    freeUsed: letterFreeUsed >= FREE_LETTERS,
    mixFreeUsed,
    credits: letterCredits + mixCredits,
  };
}

export async function writeUsage(usage: UsageSnapshot) {
  const jar = await cookies();
  jar.set(
    LETTER_FREE_COOKIE,
    pack(String(Math.max(0, Math.min(usage.letterFreeUsed, FREE_LETTERS)))),
    cookieOpts
  );
  jar.set(
    LETTER_CREDITS_COOKIE,
    pack(String(Math.max(0, usage.letterCredits))),
    cookieOpts
  );
  jar.set(
    MIX_FREE_COOKIE,
    pack(String(Math.max(0, Math.min(usage.mixFreeUsed, FREE_MIXTAPES)))),
    cookieOpts
  );
  jar.set(
    MIX_CREDITS_COOKIE,
    pack(String(Math.max(0, usage.mixCredits))),
    cookieOpts
  );
  jar.set(
    SESSIONS_COOKIE,
    pack(usage.usedSessionIds.slice(-30).join(",")),
    cookieOpts
  );
}

export async function getSendAccess() {
  const usage = await readUsage();
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

export async function consumeSendAccess() {
  const usage = await readUsage();
  if (isDemoMode()) {
    return usage;
  }
  if (usage.letterFreeUsed < FREE_LETTERS) {
    usage.letterFreeUsed += 1;
  } else if (usage.letterCredits > 0) {
    usage.letterCredits -= 1;
  } else {
    throw new Error("No send credit available.");
  }
  usage.freeUsed = usage.letterFreeUsed >= FREE_LETTERS;
  usage.credits = usage.letterCredits + usage.mixCredits;
  await writeUsage(usage);
  return usage;
}

export async function getMixtapeSendAccess() {
  const usage = await readUsage();
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

export async function consumeMixtapeSendAccess() {
  const usage = await readUsage();
  if (isDemoMode()) {
    return usage;
  }
  if (usage.mixFreeUsed < FREE_MIXTAPES) {
    usage.mixFreeUsed += 1;
  } else if (usage.mixCredits > 0) {
    usage.mixCredits -= 1;
  } else {
    throw new Error("No mixtape send credit available.");
  }
  usage.credits = usage.letterCredits + usage.mixCredits;
  await writeUsage(usage);
  return usage;
}

export async function addPaidCredit(
  sessionId: string,
  kind: CheckoutKind = "letter"
) {
  const usage = await readUsage();
  if (usage.usedSessionIds.includes(sessionId)) {
    return { usage, alreadyApplied: true as const };
  }
  if (kind === "mixtape") {
    usage.mixCredits += 1;
  } else {
    usage.letterCredits += 1;
  }
  usage.usedSessionIds = [...usage.usedSessionIds, sessionId].slice(-30);
  usage.credits = usage.letterCredits + usage.mixCredits;
  await writeUsage(usage);
  return { usage, alreadyApplied: false as const };
}
