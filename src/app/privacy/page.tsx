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

const YEAR = new Date().getFullYear();

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          Privacy Policy
        </h1>
        <p className="mt-2 font-display text-[var(--ll-muted)]">
          A short note on what we collect and why.
        </p>
      </div>

      <PixelWindow title="privacy_policy.txt" icon="🔒">
        <div className="space-y-4 text-sm leading-relaxed text-[var(--ll-muted)]">
          <p className="font-display text-base text-[var(--ll-ink)]">
            {SITE_NAME} ({SITE_URL}) respects your privacy. This policy explains
            what information we handle when you use the site.
          </p>

          <div className="space-y-2">
            <h2 className="font-pixel text-sm text-[var(--ll-pink-deep)]">
              Information you provide
            </h2>
            <p>
              When you send a letter or mixtape, you may enter names, email
              addresses, message text, dedications, and song choices. We use
              that information to generate and deliver your message to the
              recipient you choose.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-pixel text-sm text-[var(--ll-pink-deep)]">
              Technical &amp; payment data
            </h2>
            <p>
              We may use cookies or similar storage for free-send limits, paid
              credits, and site preferences (such as sound or theme). Payments
              are processed by Stripe; we do not store your full card details.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-pixel text-sm text-[var(--ll-pink-deep)]">
              Third-party services
            </h2>
            <p>
              Email may be sent through Gmail or another configured provider.
              Music previews may load through YouTube. Those services have their
              own privacy policies.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-pixel text-sm text-[var(--ll-pink-deep)]">
              Guestbook
            </h2>
            <p>
              If you post in the guestbook, your display name and message may be
              shown publicly on the site. Do not post private or sensitive
              information there.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-pixel text-sm text-[var(--ll-pink-deep)]">
              Contact
            </h2>
            <p>
              For privacy questions about {SITE_NAME}, reach out through the
              contact details you publish for the project. Last updated:{" "}
              {YEAR}-08-15.
            </p>
          </div>
        </div>
      </PixelWindow>

      <div className="flex justify-center gap-3">
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
