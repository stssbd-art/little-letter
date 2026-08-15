import { google } from "googleapis";
import {
  EMAIL_LOGO_CID,
  getEmailLogoBuffer,
} from "@/lib/email-template";

type GmailApiSendOpts = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function getGmailUser() {
  return process.env.GMAIL_USER?.trim() || "";
}

function encodeSubject(subject: string) {
  if (/^[\x20-\x7E]*$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function buildRawMessage(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const boundaryAlt = `ll_alt_${Date.now()}`;
  const boundaryRel = `ll_rel_${Date.now()}`;
  const text = opts.text.replace(/\r?\n/g, "\r\n");
  const html = opts.html.replace(/\r?\n/g, "\r\n");
  const logoB64 = getEmailLogoBuffer().toString("base64");
  // Fold base64 to 76-char lines for SMTP-ish compatibility
  const logoFolded = logoB64.replace(/.{1,76}/g, "$&\r\n").trimEnd();

  const lines = [
    `To: ${opts.to}`,
    `Subject: ${encodeSubject(opts.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/related; boundary="${boundaryRel}"`,
    "",
    `--${boundaryRel}`,
    `Content-Type: multipart/alternative; boundary="${boundaryAlt}"`,
    "",
    `--${boundaryAlt}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    `--${boundaryAlt}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    `--${boundaryAlt}--`,
    "",
    `--${boundaryRel}`,
    "Content-Type: image/jpeg; name=\"email-logo.jpg\"",
    "Content-Transfer-Encoding: base64",
    `Content-ID: <${EMAIL_LOGO_CID}>`,
    'Content-Disposition: inline; filename="email-logo.jpg"',
    "",
    logoFolded,
    "",
    `--${boundaryRel}--`,
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

/** Send through Gmail API — HTML + embedded logo (CID). */
export async function sendViaGmailApi(opts: GmailApiSendOpts): Promise<string> {
  const user = getGmailUser();
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
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });

  const { data } = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return data.id ?? `gmail-api-${Date.now()}`;
}
