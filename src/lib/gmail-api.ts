import { google } from "googleapis";

type GmailApiSendOpts = {
  to: string;
  from: string;
  subject: string;
  text: string;
};

function getGmailUser() {
  return process.env.GMAIL_USER?.trim() || "";
}

function encodeSubject(subject: string) {
  if (/^[\x20-\x7E]*$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function encodeFrom(from: string) {
  const match = from.match(/^"([^"]*)"\s*<([^>]+)>$/);
  if (!match) return from;
  const [, name, email] = match;
  if (/^[\x20-\x7E]*$/.test(name!)) {
    return `"${name}" <${email}>`;
  }
  return `=?UTF-8?B?${Buffer.from(name!, "utf8").toString("base64")}?= <${email}>`;
}

function buildRawMessage(opts: {
  to: string;
  from: string;
  subject: string;
  text: string;
}) {
  const body = opts.text.replace(/\r?\n/g, "\r\n");
  const lines = [
    `From: ${encodeFrom(opts.from)}`,
    `To: ${opts.to}`,
    `Subject: ${encodeSubject(opts.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ];
  return Buffer.from(lines.join("\r\n"), "utf8").toString("base64url");
}

export function isGmailApiConfigured() {
  const user = getGmailUser();
  return Boolean(
    user &&
      process.env.GMAIL_CLIENT_ID?.trim() &&
      process.env.GMAIL_CLIENT_SECRET?.trim() &&
      process.env.GMAIL_REFRESH_TOKEN?.trim()
  );
}

/** Send through Gmail API — plain text, branded From. */
export async function sendViaGmailApi(opts: GmailApiSendOpts): Promise<string> {
  if (!isGmailApiConfigured()) {
    throw new Error("Gmail API is not configured.");
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID!.trim(),
    process.env.GMAIL_CLIENT_SECRET!.trim()
  );
  oauth2.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN!.trim(),
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2 });
  const raw = buildRawMessage({
    to: opts.to,
    from: opts.from,
    subject: opts.subject,
    text: opts.text,
  });

  const { data } = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return data.id ?? `gmail-api-${Date.now()}`;
}
