import Link from "next/link";
import { ShareBar } from "@/components/features/ShareBar";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

const YEAR = new Date().getFullYear();

const EXPLORE = [
  { href: "/about", label: "About" },
  { href: "/occasions", label: "Occasion cards & wishes" },
  { href: "/create", label: "Create a letter" },
  { href: "/mixtape", label: "Send a mixtape" },
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
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs leading-relaxed text-[var(--ll-muted)]">
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
        </p>
      </div>
    </footer>
  );
}
