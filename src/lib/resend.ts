import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { GeneratedLetter } from "@/types";
import { buildLetterEmailHtml } from "@/lib/email-template";

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

/** Free path: Gmail SMTP can send to any address. Prefer this when configured. */
async function sendViaGmail(letter: GeneratedLetter): Promise<SendResult | null> {
  const gmail = getGmailTransport();
  if (!gmail) return null;

  const html = buildLetterEmailHtml(letter);
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || "Little Letter";
  const info = await gmail.transporter.sendMail({
    from: `"${fromName}" <${gmail.user}>`,
    to: letter.form.recipientEmail,
    subject: letter.subject,
    html,
    replyTo: gmail.user,
  });

  return {
    id: info.messageId || `gmail-${Date.now()}`,
    simulated: false,
    provider: "gmail",
  };
}

async function sendViaResend(letter: GeneratedLetter): Promise<SendResult | null> {
  const resend = getResend();
  if (!resend) return null;

  const from =
    process.env.RESEND_FROM_EMAIL ?? "Little Letter <onboarding@resend.dev>";
  const html = buildLetterEmailHtml(letter);

  const { data, error } = await resend.emails.send({
    from,
    to: letter.form.recipientEmail,
    subject: letter.subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data?.id ?? `sent-${Date.now()}`,
    simulated: false,
    provider: "resend",
  };
}

export async function sendLetterEmail(letter: GeneratedLetter): Promise<SendResult> {
  // 1) Free Gmail SMTP — works for any recipient
  const gmailResult = await sendViaGmail(letter);
  if (gmailResult) return gmailResult;

  // 2) Resend — needs verified domain to email anyone
  try {
    const resendResult = await sendViaResend(letter);
    if (resendResult) return resendResult;
  } catch (err) {
    // If Resend fails (e.g. test-domain recipient limit) and Gmail isn't set, surface the error
    throw err;
  }

  // 3) Demo mode
  console.info("[Little Letter] No email provider configured — simulating send", {
    to: letter.form.recipientEmail,
    subject: letter.subject,
  });
  return { id: `demo-${Date.now()}`, simulated: true, provider: "demo" };
}
