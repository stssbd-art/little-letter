import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { GeneratedLetter, MixtapePayload } from "@/types";
import {
  EMAIL_LOGO_CID,
  buildLetterEmailHtml,
  buildLetterEmailText,
  buildMixtapeEmailHtml,
  buildMixtapeEmailText,
  getEmailLogoBuffer,
} from "@/lib/email-template";
import { buildMixPlayUrl } from "@/lib/mixtape-link";
import { isGmailApiConfigured, sendViaGmailApi } from "@/lib/gmail-api";
import { SITE_NAME } from "@/lib/constants";

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

/** From line shown in the inbox — Little Letter branding. */
function brandedFrom(accountEmail: string, senderName?: string) {
  const brand = process.env.GMAIL_FROM_NAME?.trim() || SITE_NAME;
  const who = senderName?.trim().replace(/"/g, "");
  const display = who ? `${who} via ${brand}` : brand;
  return `"${display.replace(/"/g, "")}" <${accountEmail}>`;
}

function letterSubject(letter: GeneratedLetter) {
  const custom = letter.subject?.trim();
  if (custom) return custom.slice(0, 120);
  return `A little letter for ${letter.form.recipientName}`.slice(0, 120);
}

function mixtapeSubject(mix: MixtapePayload) {
  return `Mixtape for you: ${mix.title}`.slice(0, 120);
}

function hasGmailConfigured() {
  return isGmailApiConfigured() || Boolean(getGmailTransport());
}

function logoAttachment() {
  return {
    filename: "email-logo.jpg",
    content: getEmailLogoBuffer(),
    cid: EMAIL_LOGO_CID,
    contentType: "image/jpeg",
  };
}

async function deliverEmail(opts: {
  to: string;
  subject: string;
  text: string;
  htmlCid: string;
  htmlRemote: string;
  senderName?: string;
  logLabel: string;
}): Promise<SendResult> {
  if (isGmailApiConfigured()) {
    const from = brandedFrom(process.env.GMAIL_USER!.trim(), opts.senderName);
    const id = await sendViaGmailApi({
      to: opts.to,
      from,
      subject: opts.subject,
      text: opts.text,
      html: opts.htmlCid,
    });
    return { id, simulated: false, provider: "gmail-api" };
  }

  const gmail = getGmailTransport();
  if (gmail) {
    const info = await gmail.transporter.sendMail({
      from: brandedFrom(gmail.user, opts.senderName),
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.htmlCid,
      replyTo: gmail.user,
      attachments: [logoAttachment()],
    });
    return {
      id: info.messageId || `gmail-${Date.now()}`,
      simulated: false,
      provider: "gmail",
    };
  }

  const verified = getVerifiedResendFrom();
  const resend = verified ? getResend() : null;
  if (resend && verified) {
    const { data, error } = await resend.emails.send({
      from: verified.from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.htmlRemote,
      replyTo: verified.replyTo,
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
    subject: opts.subject,
  });
  return { id: `demo-${Date.now()}`, simulated: true, provider: "demo" };
}

export async function sendLetterEmail(letter: GeneratedLetter): Promise<SendResult> {
  return deliverEmail({
    to: letter.form.recipientEmail,
    subject: letterSubject(letter),
    text: buildLetterEmailText(letter),
    htmlCid: buildLetterEmailHtml(letter, { useCid: true }),
    htmlRemote: buildLetterEmailHtml(letter, { useCid: false }),
    senderName: letter.form.senderName,
    logLabel: "send",
  });
}

export async function sendMixtapeEmail(mix: MixtapePayload): Promise<SendResult> {
  const playUrl = buildMixPlayUrl({
    title: mix.title,
    from: mix.senderName,
    to: mix.recipientName,
    note: mix.dedication,
    tracks: mix.trackIds,
    extras: mix.customTracks,
  });

  return deliverEmail({
    to: mix.recipientEmail,
    subject: mixtapeSubject(mix),
    text: buildMixtapeEmailText(mix, playUrl),
    htmlCid: buildMixtapeEmailHtml(mix, playUrl, { useCid: true }),
    htmlRemote: buildMixtapeEmailHtml(mix, playUrl, { useCid: false }),
    senderName: mix.senderName,
    logLabel: "mixtape",
  });
}
