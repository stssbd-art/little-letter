import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import {
  hasUsageDatabase,
  isValidSenderEmail,
  normalizeSenderEmail,
} from "@/lib/usage";

export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const secret =
    process.env.USAGE_SECRET?.trim() ||
    process.env.GMAIL_SETUP_SECRET?.trim() ||
    "";
  if (!secret) return false;
  const header = request.headers.get("x-usage-reset-key")?.trim() || "";
  const url = new URL(request.url);
  const query = url.searchParams.get("key")?.trim() || "";
  return header === secret || query === secret;
}

/**
 * Support-only: clear free-send counters for one email after a false lockout.
 * POST { "email": "user@example.com" } with ?key=USAGE_SECRET
 */
export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasUsageDatabase()) {
    return NextResponse.json(
      { error: "Usage database is not configured." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;
  const email = normalizeSenderEmail(body?.email || "");
  if (!isValidSenderEmail(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  await sql`
    INSERT INTO sender_usage (email, letter_free_used, mix_free_used, updated_at)
    VALUES (${email}, 0, 0, NOW())
    ON CONFLICT (email) DO UPDATE SET
      letter_free_used = 0,
      mix_free_used = 0,
      updated_at = NOW()
  `;

  return NextResponse.json({
    ok: true,
    email,
    letterFreeUsed: 0,
    mixFreeUsed: 0,
  });
}
