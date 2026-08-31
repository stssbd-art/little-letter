import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { GeneratedLetter, MixtapePayload } from "@/types";
import {
  buildLetterEmailHtml,
  buildLetterEmailText,
  buildMixtapeEmailHtml,
  buildMixtapeEmailText,
} from "@/lib/email-template";
import { buildMixPlayUrl } from "@/lib/mixtape-link";
import { isGmailApiConfigured, sendViaGmailApi } from "@/lib/gmail-api";
import { SITE_NAME } from "@/lib/constants";
import type { VoiceNotePayload } from "@/lib/voice-note";
import { voiceNoteToAttachment } from "@/lib/voice-note";
import type { InlineImageAttachment } from "@/lib/card-cover";
import { buildCardOpenUrl, cardShareFromLetter } from "@/lib/card-link";

type SendResult = {
  id: string;
  simulated: boolean;
  provider: "gmail-api" | "gmail" | "resend" | "demo";
};

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/** Keep serverless sends from hanging until the platform 504s (and eating credits). */
const MAIL_TIMEOUT_MS = 20_000;

function getGmailTransport() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;

  return {
    user,
    transporter: nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user, pass },
      connectionTimeout: MAIL_TIMEOUT_MS,
      greetingTimeout: MAIL_TIMEOUT_MS,
      socketTimeout: MAIL_TIMEOUT_MS,
      // Prefer IPv4 — IPv6 from some serverless regions hangs on smtp.gmail.com.
      family: 4,
    } as nodemailer.TransportOptions),
  };
}

async function sendViaGmailSmtp(opts: {
  to: string;
  bcc?: string;
  subject: string;
  text: string;
  html: string;
  senderName?: string;
  attachment?: ReturnType<typeof voiceNoteToAttachment>;
  inlineImages: InlineImageAttachment[];
}): Promise<SendResult> {
  const gmail = getGmailTransport();
  if (!gmail) {
    throw new Error("Gmail SMTP is not configured.");
  }
  const mailAttachments = [
    ...opts.inlineImages.map((img) => ({
      filename: img.filename,
      content: img.content,
      contentType: img.contentType,
      cid: img.cid,
      contentDisposition: "inline" as const,
    })),
    ...(opts.attachment
      ? [
          {
            filename: opts.attachment.filename,
            content: opts.attachment.content,
            contentType: opts.attachment.contentType,
          },
        ]
      : []),
  ];
  const info = await withMailTimeout(
    gmail.transporter.sendMail({
      from: brandedFrom(gmail.user, opts.senderName),
      to: opts.to,
      bcc: opts.bcc,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      replyTo: gmail.user,
      attachments: mailAttachments.length ? mailAttachments : undefined,
    }),
    "Gmail"
  );
  return {
    id: info.messageId || `gmail-${Date.now()}`,
    simulated: false,
    provider: "gmail",
  };
}

function withMailTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          `Email send timed out while talking to ${label}. Please try Send again in a moment.`
        )
      );
    }, MAIL_TIMEOUT_MS);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function extractEmail(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return (match?.[1] ?? from).trim().toLowerCase();
}

function isSandboxSender(from: string): boolean {
  return extractEmail(from).endsWith("@resend.dev");
}

function getVerifiedResendFrom(): { from: string; replyTo: string } | null {
  const raw = process.env.RESEND_FROM_EMAIL?.trim();
  if (!raw || isSandboxSender(raw)) return null;
  const email = extractEmail(raw);
  if (!email.includes("@")) return null;
  const from = raw.includes("<") ? raw : `"${SITE_NAME}" <${email}>`;
  return { from, replyTo: email };
}

/**
 * Inbox From — “Ada via Little Letter”, never a bare address.
 */
function brandedFrom(accountEmail: string, senderName?: string) {
  const name = senderName
    ?.trim()
    .replace(/["<>\r\n]/g, "")
    .slice(0, 40);
  const display = name ? `${name} via ${SITE_NAME}` : SITE_NAME;
  return `"${display}" <${accountEmail}>`;
}

/** Prefix inbox subject with a type emoji (card / letter / mixtape). */
function withLeadingEmoji(emoji: string, subject: string) {
  const trimmed = subject.trim();
  if (trimmed.startsWith(emoji)) return trimmed.slice(0, 120);
  // Avoid stacking if the subject already starts with one of our type emojis
  const stripped = trimmed.replace(/^[💌✉️💝📼🎴]\s*/u, "");
  return `${emoji} ${stripped || trimmed}`.slice(0, 120);
}

function letterSubject(letter: GeneratedLetter) {
  const custom = letter.subject?.trim();
  if (letter.form.cardDesign) {
    const base = custom || `${letter.form.senderName} sent you a card`;
    return withLeadingEmoji("🎴", base);
  }
  const base = custom || `A little letter for ${letter.form.recipientName}`;
  return withLeadingEmoji("✉️", base);
}

function mixtapeSubject(mix: MixtapePayload) {
  return withLeadingEmoji("📼", `Mixtape for you: ${mix.title}`);
}

function hasGmailConfigured() {
  return isGmailApiConfigured() || Boolean(getGmailTransport());
}

function friendlyMailError(err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  if (/535|BadCredentials|Username and Password not accepted/i.test(msg)) {
    return new Error(
      "Gmail rejected the login. On Vercel, update GMAIL_APP_PASSWORD with a new Google App Password (Google Account → Security → 2-Step Verification → App passwords) for the same GMAIL_USER, then redeploy. Or finish Gmail API setup at /api/gmail-setup."
    );
  }
  return err instanceof Error ? err : new Error(msg);
}

/** Verify SMTP credentials (used by /api/gmail-setup?check=1). */
export async function verifyGmailSmtp(): Promise<{ ok: boolean; error?: string }> {
  const gmail = getGmailTransport();
  if (!gmail) return { ok: false, error: "GMAIL_USER or GMAIL_APP_PASSWORD not set." };
  try {
    await gmail.transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: friendlyMailError(err).message };
  }
}

/** Sender gets a blind copy when their address differs from the recipient. */
function senderCopyBcc(to: string, senderEmail?: string) {
  const bcc = senderEmail?.trim().toLowerCase();
  if (!bcc || !bcc.includes("@")) return undefined;
  if (bcc === to.trim().toLowerCase()) return undefined;
  return bcc;
}

async function deliverEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
  logLabel: string;
  senderName?: string;
  senderEmail?: string;
  voiceNote?: VoiceNotePayload | null;
  inlineImages?: InlineImageAttachment[];
}): Promise<SendResult> {
  const attachment = opts.voiceNote ? voiceNoteToAttachment(opts.voiceNote) : undefined;
  const bcc = senderCopyBcc(opts.to, opts.senderEmail);
  const inlineImages = opts.inlineImages ?? [];

  if (isGmailApiConfigured()) {
    try {
      const id = await withMailTimeout(
        sendViaGmailApi({
          to: opts.to,
          bcc,
          from: brandedFrom(process.env.GMAIL_USER!.trim(), opts.senderName),
          subject: opts.subject,
          text: opts.text,
          html: opts.html,
          attachment,
          inlineImages,
        }),
        "Gmail"
      );
      return { id, simulated: false, provider: "gmail-api" };
    } catch (apiErr) {
      /* Fall through to SMTP when API token is expired / hanging. */
      if (!getGmailTransport()) {
        throw friendlyMailError(apiErr);
      }
      console.warn(
        "[Little Letter] Gmail API send failed; trying SMTP fallback:",
        apiErr instanceof Error ? apiErr.message : apiErr
      );
    }
  }

  if (getGmailTransport()) {
    try {
      return await sendViaGmailSmtp({
        to: opts.to,
        bcc,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
        senderName: opts.senderName,
        attachment,
        inlineImages,
      });
    } catch (err) {
      throw friendlyMailError(err);
    }
  }

  const verified = getVerifiedResendFrom();
  const resend = verified ? getResend() : null;
  if (resend && verified) {
    const mailAttachments = [
      ...inlineImages.map((img) => ({
        filename: img.filename,
        content: img.content,
        contentType: img.contentType,
        contentId: img.cid,
      })),
      ...(attachment
        ? [
            {
              filename: attachment.filename,
              content: attachment.content,
              contentType: attachment.contentType,
            },
          ]
        : []),
    ];
    const { data, error } = await withMailTimeout(
      resend.emails.send({
        from: verified.from,
        to: opts.to,
        bcc: bcc ? [bcc] : undefined,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
        replyTo: verified.replyTo,
        attachments: mailAttachments.length ? mailAttachments : undefined,
      }),
      "Resend"
    );
    if (error) throw new Error(error.message);
    return {
      id: data?.id ?? `sent-${Date.now()}`,
      simulated: false,
      provider: "resend",
    };
  }

  if (process.env.RESEND_FROM_EMAIL && isSandboxSender(process.env.RESEND_FROM_EMAIL)) {
    throw new Error(
      "Email blocked: onboarding@resend.dev lands in spam. Finish Gmail setup or use a verified domain."
    );
  }

  if (process.env.NODE_ENV === "production" && !hasGmailConfigured()) {
    throw new Error(
      "Email is not configured. Finish Gmail setup at /api/gmail-setup or add GMAIL_APP_PASSWORD."
    );
  }

  console.info(`[Little Letter] No email provider — simulating ${opts.logLabel}`, {
    to: opts.to,
    bcc,
    subject: opts.subject,
  });
  return { id: `demo-${Date.now()}`, simulated: true, provider: "demo" };
}

export async function sendLetterEmail(
  letter: GeneratedLetter,
  voiceNote?: VoiceNotePayload | null
): Promise<SendResult> {
  const hasVoice = Boolean(voiceNote);
  const share = cardShareFromLetter(letter);
  const openUrl = share ? buildCardOpenUrl(share) : undefined;

  return deliverEmail({
    to: letter.form.recipientEmail,
    subject: letterSubject(letter),
    text: buildLetterEmailText(letter, hasVoice, { openUrl }),
    html: buildLetterEmailHtml(letter, hasVoice, { openUrl }),
    logLabel: "send",
    senderName: letter.form.senderName,
    senderEmail: letter.form.senderEmail,
    voiceNote,
  });
}

export async function sendMixtapeEmail(
  mix: MixtapePayload,
  voiceNote?: VoiceNotePayload | null
): Promise<SendResult> {
  const playUrl = buildMixPlayUrl({
    title: mix.title,
    from: mix.senderName,
    to: mix.recipientName,
    note: mix.dedication,
    tracks: mix.trackIds,
    extras: mix.customTracks,
  });

  const hasVoice = Boolean(voiceNote);
  return deliverEmail({
    to: mix.recipientEmail,
    subject: mixtapeSubject(mix),
    text: buildMixtapeEmailText(mix, playUrl, hasVoice),
    html: buildMixtapeEmailHtml(mix, playUrl, hasVoice),
    logLabel: "mixtape",
    senderName: mix.senderName,
    senderEmail: mix.senderEmail,
    voiceNote,
  });
}
