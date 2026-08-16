import type { Metadata } from "next";
import Link from "next/link";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Copyright",
  description: `Terms of use and copyright notice for ${SITE_NAME}.`,
  alternates: { canonical: "/terms" },
};

const YEAR = new Date().getFullYear();
const UPDATED = "15 August 2026";

const SECTIONS = [
  {
    title: "1. Acceptance",
    body: (
      <>
        By using {SITE_NAME} (
        <a
          href={SITE_URL}
          className="break-all text-[var(--ll-pink-deep)] underline underline-offset-2"
        >
          {SITE_URL.replace(/^https?:\/\//, "")}
        </a>
        ), you agree to these Terms and our{" "}
        <Link
          href="/privacy"
          className="text-[var(--ll-pink-deep)] underline underline-offset-2"
        >
          Privacy Policy
        </Link>
        . If you do not agree, please do not use the site.
      </>
    ),
  },
  {
    title: "2. The service",
    body: (
      <>
        {SITE_NAME} lets you create and email personal letters and mixtapes.
        Features, pricing, and availability may change. Demo or free allowances
        may be limited.
      </>
    ),
  },
  {
    title: "3. Your content",
    body: (
      <>
        You are responsible for the messages, dedications, names, and emails you
        submit. Do not send spam, harassment, illegal content, or messages you
        do not have the right to send. You keep ownership of your personal
        message text; you grant {SITE_NAME} permission to process and deliver it
        so the service can work.
      </>
    ),
  },
  {
    title: "4. Intellectual property",
    body: (
      <>
        All {SITE_NAME} branding, UI, code, and creative assets remain the
        property of {SITE_NAME} and its creator. Unauthorized copying of the
        website or its design is prohibited and may lead to legal action.
      </>
    ),
  },
  {
    title: "5. Third-party content",
    body: (
      <>
        Music playback may use YouTube or other third-party services. Those songs
        and videos remain the property of their respective owners. {SITE_NAME}{" "}
        does not claim ownership of third-party media.
      </>
    ),
  },
  {
    title: "6. Payments & refunds",
    body: (
      <>
        Free allowances may apply. Paid letters and mixtapes are charged through
        Stripe.{" "}
        <strong className="font-semibold text-[var(--ll-ink)]">
          Once an email has been sent to your chosen recipient, the payment is
          non-refundable
        </strong>
        . Digital delivery begins when we attempt to send the message, so we
        cannot reverse or refund a completed send. If a payment is taken but the
        email clearly failed to send because of our systems, contact us and we
        will help (credit or resend where reasonable). Inbox placement (including
        spam folders) is outside our control and is not grounds for a refund
        after a successful send.
      </>
    ),
  },
  {
    title: "7. No warranties",
    body: (
      <>
        The site is provided “as is.” Delivery of email depends on email
        providers and filters. We do not guarantee inbox placement, uptime, or
        unbroken third-party embeds.
      </>
    ),
  },
  {
    title: "8. Limitation of liability",
    body: (
      <>
        To the fullest extent allowed by law, {SITE_NAME} and its creator are
        not liable for indirect, incidental, or consequential damages arising
        from your use of the site.
      </>
    ),
  },
  {
    title: "9. Changes",
    body: (
      <>
        These Terms may be updated from time to time. Continued use after
        changes means you accept the updated Terms. Last updated: {UPDATED}.
      </>
    ),
  },
] as const;

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="space-y-2 text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          Terms &amp; Copyright
        </h1>
        <p className="font-display text-sm leading-relaxed text-[var(--ll-muted)] sm:text-base">
          Please read before using {SITE_NAME}.
        </p>
      </header>

      <PixelWindow title="copyright_notice.txt" icon="©">
        <div className="mx-auto max-w-2xl space-y-3 text-[var(--ll-ink)]">
          <h2 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
            Copyright notice
          </h2>
          <p className="font-display text-base leading-relaxed">
            © {YEAR} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
            The {SITE_NAME} website — including its design, layout, text,
            graphics, logos, mascot, code, branding, and overall look and feel —
            is protected by copyright and other intellectual property laws.
          </p>
          <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
            You may <strong className="font-semibold text-[var(--ll-ink)]">not</strong>{" "}
            copy, reproduce, republish, scrape, reverse-engineer, redistribute,
            sell, or create a derivative website or service based on {SITE_NAME}{" "}
            without prior written permission from the owner.
          </p>
          <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
            Personal, non-commercial viewing of the site in a normal browser is
            allowed. Sharing a letter or mixtape you create through {SITE_NAME}{" "}
            with the intended recipient is allowed.
          </p>
        </div>
      </PixelWindow>

      <PixelWindow title="terms_of_use.ini" icon="📜">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
            Terms of use
          </h2>
          <div className="space-y-5">
            {SECTIONS.map((section) => {
              const isRefund = section.title.startsWith("6.");
              return (
                <section
                  key={section.title}
                  id={isRefund ? "refunds" : undefined}
                  className="scroll-mt-24 space-y-1.5"
                >
                  <h3 className="font-display text-base leading-snug text-[var(--ll-ink)]">
                    {section.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
                    {section.body}
                  </p>
                </section>
              );
            })}
          </div>
        </div>
      </PixelWindow>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <Link href="/privacy">
          <PixelButton variant="secondary">Privacy Policy</PixelButton>
        </Link>
        <Link href="/">
          <PixelButton variant="ghost">Home</PixelButton>
        </Link>
      </div>
    </div>
  );
}
