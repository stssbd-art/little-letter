import type { Metadata } from "next";
import Link from "next/link";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles information you share when sending letters and mixtapes.`,
  alternates: { canonical: "/privacy" },
};

const UPDATED = "16 August 2026";

const SECTIONS = [
  {
    title: "Information you provide",
    body: `When you send a letter or mixtape, you may enter names, email addresses (including your own sender email), message text, dedications, and song choices. We use recipient details to deliver your message. We use your sender email to track free-send limits and paid credits so clearing browser cookies cannot reset those limits.`,
  },
  {
    title: "Technical & payment data",
    body: `We may use cookies or similar storage for free-send limits, paid credits, and site preferences (such as sound or theme). Sender-email usage counts are also stored on our database. Payments are processed by Stripe; we do not store your full card details.`,
  },
  {
    title: "Third-party services",
    body: `Email may be sent through Gmail or another configured provider. Music previews may load through YouTube. Those services have their own privacy policies.`,
  },
  {
    title: "Guestbook",
    body: `If you post in the guestbook, your display name and message may be shown publicly on the site. Do not post private or sensitive information there.`,
  },
  {
    title: "Contact",
    body: `For privacy questions about ${SITE_NAME}, reach out through the contact details you publish for the project. Last updated: ${UPDATED}.`,
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="space-y-2 text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          Privacy Policy
        </h1>
        <p className="font-display text-sm leading-relaxed text-[var(--ll-muted)] sm:text-base">
          A short note on what we collect and why.
        </p>
      </header>

      <PixelWindow title="privacy_policy.txt" icon="🔒">
        <div className="mx-auto max-w-2xl space-y-5">
          <p className="font-display text-base leading-relaxed text-[var(--ll-ink)]">
            {SITE_NAME} (
            <a
              href={SITE_URL}
              className="break-all text-[var(--ll-pink-deep)] underline underline-offset-2"
            >
              {SITE_URL.replace(/^https?:\/\//, "")}
            </a>
            ) respects your privacy. This policy explains what information we
            handle when you use the site.
          </p>

          <div className="space-y-5">
            {SECTIONS.map((section) => (
              <section key={section.title} className="space-y-1.5">
                <h2 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </PixelWindow>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <Link href="/terms">
          <PixelButton variant="secondary">Terms &amp; Copyright</PixelButton>
        </Link>
        <Link href="/">
          <PixelButton variant="ghost">Home</PixelButton>
        </Link>
      </div>
    </div>
  );
}
