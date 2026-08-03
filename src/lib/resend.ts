import { Resend } from "resend";
import type { GeneratedLetter } from "@/types";
import { buildLetterEmailHtml } from "@/lib/email-template";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendLetterEmail(letter: GeneratedLetter) {
  const resend = getResend();
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Little Letter <onboarding@resend.dev>";

  const html = buildLetterEmailHtml(letter);

  if (!resend) {
    // Dev / demo mode: treat as success so the UX flow stays intact
    console.info("[Little Letter] RESEND_API_KEY missing — simulating send", {
      to: letter.form.recipientEmail,
      subject: letter.subject,
    });
    return { id: `demo-${Date.now()}`, simulated: true as const };
  }

  const { data, error } = await resend.emails.send({
    from,
    to: letter.form.recipientEmail,
    subject: letter.subject,
    html,
    replyTo: undefined,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { id: data?.id ?? `sent-${Date.now()}`, simulated: false as const };
}
