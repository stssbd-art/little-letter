import type { Metadata } from "next";
import Link from "next/link";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { OCCASION_SEO_LIST } from "@/lib/occasion-seo";
import { SITE_URL } from "@/lib/constants";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Send a Digital Card Online",
  description:
    "Send a digital greeting card by email — birthday, thank you, love, wedding, and more. Cute, personal, and paperless. First two free, then £0.99.",
  keywords: [
    "send a card online",
    "digital greeting card",
    "birthday card by email",
    "e-card",
    "online greeting card",
  ],
  alternates: { canonical: "/cards" },
  openGraph: {
    title: "Send a Digital Card — Little Letter",
    description:
      "Pick an occasion and email a warm digital card — no paper, still personal.",
    url: "/cards",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Send a digital card",
  description:
    "Create and email digital greeting cards for birthdays, love, thank you, and more.",
  url: `${SITE_URL}/cards`,
};

export default function CardsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader title="Send a digital card">
        Birthday, thank you, love, and more — emailed with a cute envelope
        preview. First two free · then £0.99.
      </PageHeader>

      <PixelWindow title="send_a_card.exe" icon="🎴">
        <p className="ll-copy font-display text-base leading-relaxed text-[var(--ll-ink)]">
          Same cosy Little Letter magic, framed as a card for the moment.
          Choose an occasion, write (or get help writing) a short wish, add an
          optional voice note, and send it by email — paperless, personal, and
          ready in minutes.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/create">
            <PixelButton size="lg">🎴 Create a card</PixelButton>
          </Link>
          <Link href="/occasions">
            <PixelButton variant="ghost">Browse all occasions</PixelButton>
          </Link>
        </div>
      </PixelWindow>

      <PixelWindow title="pick_an_occasion.ini" icon="✨">
        <p className="mb-4 text-sm text-[var(--ll-muted)]">
          Tap an occasion to start with that vibe already picked.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {OCCASION_SEO_LIST.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/${o.slug}`}
                className="flex items-start gap-3 rounded-xl border-2 border-[var(--ll-lavender)] bg-white/60 px-4 py-3 transition hover:border-[var(--ll-pink-deep)] dark:bg-white/5"
              >
                <span className="text-2xl" aria-hidden>
                  {o.emoji}
                </span>
                <span>
                  <span className="block font-display text-sm text-[var(--ll-ink)]">
                    {o.label} card
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[var(--ll-muted)]">
                    {o.tagline}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PixelWindow>
    </div>
  );
}
