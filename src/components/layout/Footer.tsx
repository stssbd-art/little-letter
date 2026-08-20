import Link from "next/link";
import { ShareBar } from "@/components/features/ShareBar";
import { CookieSettingsButton } from "@/components/features/CookieSettingsButton";
import { SITE_NAME, SITE_TAGLINE, SITE_URL, CONTACT_EMAIL } from "@/lib/constants";

const YEAR = new Date().getFullYear();

const EXPLORE = [
  { href: "/about", label: "About" },
  { href: "/cards", label: "Send a card" },
  { href: "/occasions", label: "Browse occasions" },
  { href: "/create", label: "Create a letter" },
  { href: "/mixtape", label: "Send a mixtape" },
  { href: "/paperless", label: "Paperless wishes" },
  { href: "/faq", label: "FAQ" },
  { href: "/terms", label: "Terms & Copyright" },
  { href: "/terms#refunds", label: "Refunds" },
  { href: "/privacy", label: "Privacy" },
] as const;

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t-2 border-[var(--ll-window-border)] bg-[var(--ll-window-bg)]/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:grid-cols-3 sm:items-start sm:gap-8">
        <div className="space-y-2.5">
          <p className="font-pixel text-[11px] leading-relaxed text-[var(--ll-pink-deep)]">
            {SITE_NAME}
          </p>
          <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
            {SITE_TAGLINE}
          </p>
          <p className="text-xs leading-relaxed text-[var(--ll-muted)]">
            © {YEAR} {SITE_NAME}. All rights reserved. Design, code, and
            branding may not be copied without permission.
          </p>
          <p className="text-sm leading-relaxed text-[var(--ll-ink)]">
            Contact:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="break-all text-[var(--ll-pink-deep)] underline underline-offset-2 hover:opacity-90"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <div className="space-y-2.5">
          <p className="font-display text-sm leading-snug text-[var(--ll-ink)]">
            Explore
          </p>
          <ul className="space-y-1.5 text-sm leading-relaxed text-[var(--ll-muted)]">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link
                  className="hover:text-[var(--ll-pink-deep)]"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2.5 sm:justify-self-start">
          <ShareBar
            compact
            url={SITE_URL}
            title={SITE_NAME}
            text={SITE_TAGLINE}
          />
        </div>
      </div>

      <div className="border-t border-[var(--ll-lavender)]/50 px-4 py-4">
        <p className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-left text-xs leading-relaxed text-[var(--ll-muted)]">
          <span>
            © {YEAR} {SITE_NAME}
          </span>
          <span aria-hidden>·</span>
          <span>All rights reserved</span>
          <span aria-hidden>·</span>
          <Link
            href="/terms"
            className="underline decoration-dotted underline-offset-2 hover:text-[var(--ll-pink-deep)]"
          >
            Terms
          </Link>
          <span aria-hidden>·</span>
          <Link
            href="/terms#refunds"
            className="underline decoration-dotted underline-offset-2 hover:text-[var(--ll-pink-deep)]"
          >
            Refunds
          </Link>
          <span aria-hidden>·</span>
          <Link
            href="/privacy"
            className="underline decoration-dotted underline-offset-2 hover:text-[var(--ll-pink-deep)]"
          >
            Privacy
          </Link>
          <span aria-hidden>·</span>
          <CookieSettingsButton />
        </p>
      </div>
    </footer>
  );
}
