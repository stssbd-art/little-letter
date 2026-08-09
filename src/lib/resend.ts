import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { GeneratedLetter, MixtapePayload } from "@/types";
import {
  buildLetterEmailHtml,
  buildMixtapeEmailHtml,
} from "@/lib/email-template";

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

async function deliverEmail(opts: {
  to: string;
  subject: string;
  html: string;
  logLabel: string;
}): Promise<SendResult> {
  const gmail = getGmailTransport();
  if (gmail) {
    const fromName = process.env.GMAIL_FROM_NAME?.trim() || "Little Letter";
    const info = await gmail.transporter.sendMail({
      from: `"${fromName}" <${gmail.user}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: gmail.user,
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
      html: opts.html,
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
    subject: letter.subject,
    html: buildLetterEmailHtml(letter),
    logLabel: "send",
  });
}

export async function sendMixtapeEmail(mix: MixtapePayload): Promise<SendResult> {
  return deliverEmail({
    to: mix.recipientEmail,
    subject: `📼 Mixtape for you: ${mix.title}`,
    html: buildMixtapeEmailHtml(mix),
    logLabel: "mixtape",
  });
}
