import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const SEND_PRICE_LABEL = "£0.50";
export const SEND_PRICE_PENCE = 50;

const FREE_COOKIE = "ll_free_used";
const CREDITS_COOKIE = "ll_credits";
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

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

export type UsageSnapshot = {
  freeUsed: boolean;
  credits: number;
  usedSessionIds: string[];
};

export async function readUsage(): Promise<UsageSnapshot> {
  const jar = await cookies();
  const freeUsed = unpack(jar.get(FREE_COOKIE)?.value) === "1";
  const credits = Number(unpack(jar.get(CREDITS_COOKIE)?.value) || "0");
  const sessionsRaw = unpack(jar.get(SESSIONS_COOKIE)?.value) || "";
  const usedSessionIds = sessionsRaw ? sessionsRaw.split(",").filter(Boolean) : [];

  return {
    freeUsed,
    credits: Number.isFinite(credits) && credits > 0 ? credits : 0,
    usedSessionIds,
  };
}

export async function writeUsage(usage: UsageSnapshot) {
  const jar = await cookies();
  jar.set(FREE_COOKIE, pack(usage.freeUsed ? "1" : "0"), cookieOpts);
  jar.set(CREDITS_COOKIE, pack(String(usage.credits)), cookieOpts);
  jar.set(
    SESSIONS_COOKIE,
    pack(usage.usedSessionIds.slice(-30).join(",")),
    cookieOpts
  );
}

export async function getSendAccess() {
  const usage = await readUsage();
  if (!usage.freeUsed) {
    return { allowed: true as const, reason: "free" as const, usage };
  }
  if (usage.credits > 0) {
    return { allowed: true as const, reason: "credit" as const, usage };
  }
  return { allowed: false as const, reason: "payment_required" as const, usage };
}

export async function consumeSendAccess() {
  const usage = await readUsage();
  if (!usage.freeUsed) {
    usage.freeUsed = true;
  } else if (usage.credits > 0) {
    usage.credits -= 1;
  } else {
    throw new Error("No send credit available.");
  }
  await writeUsage(usage);
  return usage;
}

export async function addPaidCredit(sessionId: string) {
  const usage = await readUsage();
  if (usage.usedSessionIds.includes(sessionId)) {
    return { usage, alreadyApplied: true as const };
  }
  usage.credits += 1;
  usage.usedSessionIds = [...usage.usedSessionIds, sessionId].slice(-30);
  await writeUsage(usage);
  return { usage, alreadyApplied: false as const };
}
