import { NextResponse } from "next/server";
import {
  getGmailSetupAuthUrl,
  isGmailSetupConfigured,
  verifyGmailSetupSecret,
} from "@/lib/gmail-oauth";
import { isGmailApiConfigured } from "@/lib/gmail-api";

export const dynamic = "force-dynamic";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "";
  const shown = name.slice(0, 2);
  return `${shown}***@${domain}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!verifyGmailSetupSecret(key)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (url.searchParams.get("check") === "1") {
    const from = process.env.GMAIL_USER?.trim() || "";
    const gmailApi = isGmailApiConfigured();
    const smtp = Boolean(
      process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "")
    );
    return NextResponse.json({
      gmailApi,
      smtpFallback: smtp && !gmailApi,
      from: from ? maskEmail(from) : "(not set)",
      ready: gmailApi,
    });
  }

  if (!isGmailSetupConfigured()) {
    return NextResponse.json(
      {
        error:
          "Add GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET on Vercel first, then redeploy.",
      },
      { status: 400 }
    );
  }

  const authUrl = getGmailSetupAuthUrl();
  if (!authUrl) {
    return NextResponse.json({ error: "Could not start Gmail setup." }, { status: 500 });
  }

  return NextResponse.redirect(authUrl);
}
