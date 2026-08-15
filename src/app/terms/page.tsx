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

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          Terms &amp; Copyright
        </h1>
        <p className="mt-2 font-display text-[var(--ll-muted)]">
          Please read before using {SITE_NAME}.
        </p>
      </div>

      <PixelWindow title="copyright_notice.txt" icon="©">
        <div className="space-y-3 text-sm leading-relaxed text-[var(--ll-ink)]">
          <h2 className="font-pixel text-sm text-[var(--ll-pink-deep)]">
            Copyright notice
          </h2>
          <p className="font-display text-base">
            © {YEAR} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-[var(--ll-muted)]">
            The {SITE_NAME} website — including its design, layout, text,
            graphics, logos, mascot, code, branding, and overall look and feel —
            is protected by copyright and other intellectual property laws.
          </p>
          <p className="text-[var(--ll-muted)]">
            You may <strong className="text-[var(--ll-ink)]">not</strong> copy,
            reproduce, republish, scrape, reverse-engineer, redistribute, sell,
            or create a derivative website or service based on {SITE_NAME}
            without prior written permission from the owner.
          </p>
          <p className="text-[var(--ll-muted)]">
            Personal, non-commercial viewing of the site in a normal browser is
            allowed. Sharing a letter or mixtape you create through{" "}
            {SITE_NAME} with the intended recipient is allowed.
          </p>
        </div>
      </PixelWindow>

      <PixelWindow title="terms_of_use.ini" icon="📜">
        <div className="space-y-4 text-sm leading-relaxed text-[var(--ll-muted)]">
          <h2 className="font-pixel text-sm text-[var(--ll-pink-deep)]">
            Terms of use
          </h2>
          <div className="space-y-2">
            <h3 className="font-display text-[var(--ll-ink)]">1. Acceptance</h3>
            <p>
              By using {SITE_NAME} ({SITE_URL}), you agree to these Terms and
              our{" "}
              <Link
                href="/privacy"
                className="text-[var(--ll-pink-deep)] underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              . If you do not agree, please do not use the site.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-[var(--ll-ink)]">2. The service</h3>
            <p>
              {SITE_NAME} lets you create and email personal letters and
              mixtapes. Features, pricing, and availability may change. Demo or
              free allowances may be limited.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-[var(--ll-ink)]">
              3. Your content
            </h3>
            <p>
              You are responsible for the messages, dedications, names, and
              emails you submit. Do not send spam, harassment, illegal content,
              or messages you do not have the right to send. You keep ownership
              of your personal message text; you grant {SITE_NAME} permission to
              process and deliver it so the service can work.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-[var(--ll-ink)]">
              4. Intellectual property
            </h3>
            <p>
              All {SITE_NAME} branding, UI, code, and creative assets remain the
              property of {SITE_NAME} and its creator. Unauthorized copying of
              the website or its design is prohibited and may lead to legal
              action.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-[var(--ll-ink)]">
              5. Third-party content
            </h3>
            <p>
              Music playback may use YouTube or other third-party services.
              Those songs and videos remain the property of their respective
              owners. {SITE_NAME} does not claim ownership of third-party media.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-[var(--ll-ink)]">
              6. No warranties
            </h3>
            <p>
              The site is provided “as is.” Delivery of email depends on email
              providers and filters. We do not guarantee inbox placement,
              uptime, or unbroken third-party embeds.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-[var(--ll-ink)]">
              7. Limitation of liability
            </h3>
            <p>
              To the fullest extent allowed by law, {SITE_NAME} and its creator
              are not liable for indirect, incidental, or consequential damages
              arising from your use of the site.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-[var(--ll-ink)]">8. Changes</h3>
            <p>
              These Terms may be updated from time to time. Continued use after
              changes means you accept the updated Terms. Last updated:{" "}
              {YEAR}-08-15.
            </p>
          </div>
        </div>
      </PixelWindow>

      <div className="flex justify-center gap-3">
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
