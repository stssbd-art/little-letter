import type { Metadata } from "next";
import Link from "next/link";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles information you share when sending letters and mixtapes.`,
  alternates: { canonical: "/privacy" },
};

const UPDATED = "3 September 2026";

const SECTIONS = [
  {
    title: "Information you provide",
    body: `When you send a letter or mixtape, you may enter names, email addresses (including your own sender email), message text, dedications, song choices, and an optional voice recording. We use recipient details to deliver that message, and we keep a limited send record (see below) for safety.`,
  },
  {
    title: "We do not hold your message data",
    body: `${SITE_NAME} is a delivery tool. We do not store, archive, or keep copies of your letter text, dedications, voice recordings, or mixtape contents after the email is sent. Drafts may live briefly in your own browser; voice notes are attached to the email and are not kept on our servers. We may keep only minimal technical records needed to run the service (for example free-send / paid-credit counts tied to your sender email, a safety send log of who emailed whom, and optional guestbook or shared-example posts you choose to publish). We do not keep a library of private message bodies.`,
  },
  {
    title: "Safety send log",
    body: `For safety and to help investigate illegal, threatening, or abusive use, we keep a private record of each successful send: sender email and name, recipient email and name, message type (letter, card, or mixtape), subject or mixtape title, and the time it was sent. We do not store the full letter or voice recording in that log. This record is not public.`,
  },
  {
    title: "No liability for illegal use",
    body: `You are solely responsible for what you write, record, and send. Do not use ${SITE_NAME} for anything illegal, harmful, harassing, fraudulent, or without the right to contact the recipient. ${SITE_NAME} and its creator are not liable for any illegal, abusive, or unauthorised activity carried out by users of the site, or for the content of messages users choose to send.`,
  },
  {
    title: "Technical & payment data",
    body: `We may use necessary cookies or similar storage for free-send limits, paid credits, and site preferences (such as sound or theme). Sender-email usage counts may be stored so free allowances cannot be reset by clearing cookies alone. Optional cookies for Google Analytics, AdSense, and Awin affiliate tracking only load after you choose “Accept all” on the cookie banner (or you can pick “Necessary only”). Payments are processed by Stripe; we do not store your full card details.`,
  },
  {
    title: "Third-party services",
    body: `Email may be sent through Gmail or another configured provider. Music previews may load through YouTube. Ads may be shown by Google AdSense. Visit counts may be measured with Google Analytics. Affiliate tracking may use Awin (publisher ID 3048693). We may show sponsored affiliate links to brands such as Cadbury Gifts Direct, Social Stories Club, Dean Morris Cards, and Happy Days Factory; those partners and Awin have their own privacy policies.`,
  },
  {
    title: "Guestbook",
    body: `If you post in the guestbook, your display name and message may be shown publicly on the site. Do not post private or sensitive information there.`,
  },
  {
    title: "Contact",
    body: `For privacy questions about ${SITE_NAME}, email ${CONTACT_EMAIL}. Last updated: ${UPDATED}.`,
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title="Privacy Policy">
        A short note on what we collect and why.
      </PageHeader>

      <PixelWindow title="privacy_policy.txt" icon="🔒">
        <div className="space-y-5">
          <p className="ll-copy font-display text-base leading-relaxed text-[var(--ll-ink)]">
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
                {section.title === "Contact" ? (
                  <p className="ll-copy text-sm leading-relaxed text-[var(--ll-muted)]">
                    For privacy questions about {SITE_NAME}, email{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="break-all text-[var(--ll-pink-deep)] underline underline-offset-2"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    . Last updated: {UPDATED}.
                  </p>
                ) : (
                  <p className="ll-copy text-sm leading-relaxed text-[var(--ll-muted)]">
                    {section.body}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </PixelWindow>

      <div className="flex flex-wrap items-center justify-start gap-3 pt-1">
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
