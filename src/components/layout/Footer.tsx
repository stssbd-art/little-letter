import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

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
              <Link className="hover:text-[var(--ll-pink-deep)]" href="/faq">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display text-sm text-[var(--ll-ink)]">Easter eggs</p>
          <p className="mt-2 text-sm text-[var(--ll-muted)]">
            Click the moon 🌙 for stars, a butterfly 🦋 to follow you, a flower 🌷
            for petals, or the rainbow for emoji rain.
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--ll-lavender)]/50 px-4 py-4 text-center text-xs text-[var(--ll-muted)]">
        Made with pixel hearts · {new Date().getFullYear()} {SITE_NAME}
      </div>
    </footer>
  );
}
