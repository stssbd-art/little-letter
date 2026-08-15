import Link from "next/link";
import { ShareBar } from "@/components/features/ShareBar";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t-2 border-[var(--ll-window-border)] bg-[var(--ll-window-bg)]/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-pixel text-[11px] text-[var(--ll-pink-deep)]">
            {SITE_NAME}
          </p>
          <p className="mt-2 text-sm text-[var(--ll-muted)]">{SITE_TAGLINE}</p>
        </div>
        <div>
          <p className="font-display text-sm text-[var(--ll-ink)]">Explore</p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--ll-muted)]">
            <li>
              <Link className="hover:text-[var(--ll-pink-deep)]" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-[var(--ll-pink-deep)]" href="/create">
                Create a letter
              </Link>
            </li>
            <li>
              <Link className="hover:text-[var(--ll-pink-deep)]" href="/mixtape">
                Send a mixtape
              </Link>
            </li>
            <li>
              <Link className="hover:text-[var(--ll-pink-deep)]" href="/faq">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <ShareBar
            compact
            url={SITE_URL}
            title={SITE_NAME}
            text={SITE_TAGLINE}
          />
        </div>
      </div>
      <div className="border-t border-[var(--ll-lavender)]/50 px-4 py-4 text-center text-xs text-[var(--ll-muted)]">
        Made with pixel care · {new Date().getFullYear()} {SITE_NAME}
      </div>
    </footer>
  );
}
