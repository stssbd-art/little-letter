import { NextResponse } from "next/server";
import { exchangeGmailSetupCode } from "@/lib/gmail-oauth";

export const dynamic = "force-dynamic";

function setupPage(opts: { ok: boolean; title: string; body: string }) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${opts.title}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 640px; margin: 40px auto; padding: 0 16px; line-height: 1.6; color: #222; }
    code, pre { background: #f5f5f5; padding: 12px; display: block; overflow-x: auto; border-radius: 8px; }
    h1 { font-size: 1.4rem; }
  </style>
</head>
<body>
  <h1>${opts.title}</h1>
  ${opts.body}
</body>
</html>`;
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  const error = new URL(request.url).searchParams.get("error");

  if (error) {
    return setupPage({
      ok: false,
      title: "Gmail setup cancelled",
      body: `<p>Google returned: <strong>${error}</strong></p><p>Try again from your setup link.</p>`,
    });
  }

  if (!code) {
    return setupPage({
      ok: false,
      title: "Missing authorization code",
      body: "<p>Start again from your Gmail setup link.</p>",
    });
  }

  try {
    const tokens = await exchangeGmailSetupCode(code);
    return setupPage({
      ok: true,
      title: "Gmail connected — copy this to Vercel",
      body: `
        <p>Add these on Vercel, then redeploy. <strong>GMAIL_USER must be the Gmail you just signed in with</strong> (your Little Letter sending account).</p>
        <pre>GMAIL_USER=${tokens.email || "your@gmail.com"}
GMAIL_REFRESH_TOKEN=${tokens.refreshToken}</pre>
        <p>After redeploy, send a test letter. It should appear in that Gmail’s <strong>Sent</strong> folder.</p>
      `,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Setup failed.";
    return setupPage({
      ok: false,
      title: "Gmail setup failed",
      body: `<p>${message}</p>`,
    });
  }
}
