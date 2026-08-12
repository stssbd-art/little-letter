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
import { SITE_URL } from "@/lib/constants";

type SendResult = {
  id: string;
  simulated: boolean;
  provider: "gmail" | "resend" | "demo";
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
      service: "gmail",
      auth: { user, pass },
    }),
  };
}

/** Personal From line helps inboxes treat the mail as a one-to-one note. */
function fromHeader(accountEmail: string, senderName?: string) {
  const brand = process.env.GMAIL_FROM_NAME?.trim() || "Little Letter";
  const who = senderName?.trim();
  const display = who ? `${who} via ${brand}` : brand;
  // Escape quotes in display names
  const safe = display.replace(/"/g, "");
  return `"${safe}" <${accountEmail}>`;
}

function deliverabilityHeaders(fromEmail: string) {
  return {
    "X-Mailer": "Little Letter",
    "X-Entity-Ref-ID": `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    "List-Unsubscribe": `<mailto:${fromEmail}?subject=unsubscribe>, <${SITE_URL}>`,
    "List-Id": `<little-letter.${fromEmail.split("@")[1] ?? "mail"}>`,
  };
}

async function deliverEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  senderName?: string;
  logLabel: string;
}): Promise<SendResult> {
  const gmail = getGmailTransport();
  if (gmail) {
    const info = await gmail.transporter.sendMail({
      from: fromHeader(gmail.user, opts.senderName),
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      replyTo: gmail.user,
      headers: deliverabilityHeaders(gmail.user),
    });
    return {
      id: info.messageId || `gmail-${Date.now()}`,
      simulated: false,
      provider: "gmail",
    };
  }

  const resend = getResend();
  if (resend) {
    const from =
      process.env.RESEND_FROM_EMAIL ?? "Little Letter <onboarding@resend.dev>";
    const { data, error } = await resend.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      headers: {
        "X-Entity-Ref-ID": `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      },
    });
    if (error) throw new Error(error.message);
    return {
      id: data?.id ?? `sent-${Date.now()}`,
      simulated: false,
      provider: "resend",
    };
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
    subject: letter.subject.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim() || "A letter for you",
    html: buildLetterEmailHtml(letter),
    text: buildLetterEmailText(letter),
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
  });

  return deliverEmail({
    to: mix.recipientEmail,
    subject: `Mixtape for you: ${mix.title}`.slice(0, 120),
    html: buildMixtapeEmailHtml(mix, playUrl),
    text: buildMixtapeEmailText(mix, playUrl),
    senderName: mix.senderName,
    logLabel: "mixtape",
  });
}
