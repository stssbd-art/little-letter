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
import {
  getCardCoverPng,
  type InlineImageAttachment,
} from "@/lib/card-cover";
import { isCardDesignId } from "@/lib/card-designs";

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
    }),
  };
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

function withEnvelope(subject: string) {
  const trimmed = subject.trim();
  if (trimmed.startsWith("💌")) return trimmed.slice(0, 120);
  return `💌 ${trimmed}`.slice(0, 120);
}

function letterSubject(letter: GeneratedLetter) {
  const custom = letter.subject?.trim();
  const base = custom || `A little letter for ${letter.form.recipientName}`;
  return withEnvelope(base);
}

function mixtapeSubject(mix: MixtapePayload) {
  return withEnvelope(`Mixtape for you: ${mix.title}`);
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
      const id = await sendViaGmailApi({
        to: opts.to,
        bcc,
        from: brandedFrom(process.env.GMAIL_USER!.trim(), opts.senderName),
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
        attachment,
        inlineImages,
      });
      return { id, simulated: false, provider: "gmail-api" };
    } catch (err) {
      throw friendlyMailError(err);
    }
  }

  const gmail = getGmailTransport();
  if (gmail) {
    try {
      const mailAttachments = [
        ...inlineImages.map((img) => ({
          filename: img.filename,
          content: img.content,
          contentType: img.contentType,
          cid: img.cid,
          contentDisposition: "inline" as const,
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
      const info = await gmail.transporter.sendMail({
        from: brandedFrom(gmail.user, opts.senderName),
        to: opts.to,
        bcc,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
        replyTo: gmail.user,
        attachments: mailAttachments.length ? mailAttachments : undefined,
      });
      return {
        id: info.messageId || `gmail-${Date.now()}`,
        simulated: false,
        provider: "gmail",
      };
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
    const { data, error } = await resend.emails.send({
      from: verified.from,
      to: opts.to,
      bcc: bcc ? [bcc] : undefined,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      replyTo: verified.replyTo,
      attachments: mailAttachments.length ? mailAttachments : undefined,
    });
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
  let cover: InlineImageAttachment | null = null;
  try {
    if (letter.form.cardDesign && isCardDesignId(letter.form.cardDesign)) {
      cover = await getCardCoverPng(letter.form.cardDesign);
    }
  } catch (err) {
    console.warn("[Little Letter] Card cover embed failed — sending without CID", err);
  }

  return deliverEmail({
    to: letter.form.recipientEmail,
    subject: letterSubject(letter),
    text: buildLetterEmailText(letter, hasVoice),
    html: buildLetterEmailHtml(letter, hasVoice, {
      embedCover: Boolean(cover),
    }),
    logLabel: "send",
    senderName: letter.form.senderName,
    senderEmail: letter.form.senderEmail,
    voiceNote,
    inlineImages: cover ? [cover] : undefined,
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
