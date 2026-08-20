import { google } from "googleapis";

export type GmailAttachment = {
  filename: string;
  contentType: string;
  content: Buffer;
};

export type GmailInlineImage = GmailAttachment & {
  /** Content-ID without angle brackets, e.g. `ll-card-cover` */
  cid: string;
};

type GmailApiSendOpts = {
  to: string;
  /** Blind copy — e.g. sender keeps a copy without the recipient seeing it. */
  bcc?: string;
  /** Display From, e.g. `"Ada via Little Letter" <you@gmail.com>` */
  from: string;
  subject: string;
  text: string;
  html: string;
  /** Regular downloadable attachment (e.g. voice note). */
  attachment?: GmailAttachment;
  /** Inline images referenced as cid:… in HTML. */
  inlineImages?: GmailInlineImage[];
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

function wrapBase64(value: string) {
  return value.match(/.{1,76}/g)?.join("\r\n") ?? value;
}

function alternativeParts(boundary: string, text: string, html: string) {
  return [
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    `--${boundary}--`,
  ];
}

function inlineImageParts(images: GmailInlineImage[]) {
  return images.flatMap((img) => {
    const safeName = img.filename.replace(/["\r\n]/g, "");
    const cid = img.cid.replace(/[<>\r\n]/g, "");
    return [
      `Content-Type: ${img.contentType}; name="${safeName}"`,
      `Content-Transfer-Encoding: base64`,
      `Content-ID: <${cid}>`,
      `Content-Disposition: inline; filename="${safeName}"`,
      "",
      wrapBase64(img.content.toString("base64")),
      "",
    ];
  });
}

function buildRawMessage(opts: {
  to: string;
  bcc?: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  attachment?: GmailAttachment;
  inlineImages?: GmailInlineImage[];
}) {
  const text = opts.text.replace(/\r?\n/g, "\r\n");
  const html = opts.html.replace(/\r?\n/g, "\r\n");
  const headers = [
    `From: ${encodeFrom(opts.from)}`,
    `To: ${opts.to}`,
    ...(opts.bcc ? [`Bcc: ${opts.bcc}`] : []),
    `Subject: ${encodeSubject(opts.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
  ];

  const inlines = opts.inlineImages ?? [];
  const stamp = Date.now();

  // HTML + inline images live in multipart/related
  const buildRelated = () => {
    if (inlines.length === 0) {
      const alt = `ll_alt_${stamp}`;
      return {
        headers: [`Content-Type: multipart/alternative; boundary="${alt}"`],
        body: alternativeParts(alt, text, html),
      };
    }
    const related = `ll_rel_${stamp}`;
    const alt = `ll_alt_${stamp}`;
    return {
      headers: [`Content-Type: multipart/related; type="multipart/alternative"; boundary="${related}"`],
      body: [
        `--${related}`,
        `Content-Type: multipart/alternative; boundary="${alt}"`,
        "",
        ...alternativeParts(alt, text, html),
        ...inlines.flatMap((img) => [
          `--${related}`,
          ...inlineImageParts([img]),
        ]),
        `--${related}--`,
      ],
    };
  };

  const related = buildRelated();

  if (!opts.attachment) {
    const lines = [...headers, ...related.headers, "", ...related.body];
    return Buffer.from(lines.join("\r\n"), "utf8").toString("base64url");
  }

  const mixed = `ll_mixed_${stamp}`;
  const safeName = opts.attachment.filename.replace(/["\r\n]/g, "");
  const lines = [
    ...headers,
    `Content-Type: multipart/mixed; boundary="${mixed}"`,
    "",
    `--${mixed}`,
    ...related.headers,
    "",
    ...related.body,
    `--${mixed}`,
    `Content-Type: ${opts.attachment.contentType}; name="${safeName}"`,
    `Content-Disposition: attachment; filename="${safeName}"`,
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(opts.attachment.content.toString("base64")),
    `--${mixed}--`,
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

/** Send through Gmail API — styled HTML + plain text fallback. */
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
  const raw = buildRawMessage(opts);

  const { data } = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return data.id ?? `gmail-api-${Date.now()}`;
}
