import type { Metadata } from "next";
import Link from "next/link";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { OCCASION_SEO_LIST } from "@/lib/occasion-seo";
import { SITE_URL } from "@/lib/constants";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Occasion Cards & Wishes — Birthday, Valentine’s & More",
  description:
    "Send digital cards and personal wishes by email for birthdays, Valentine’s Day, weddings, Mother’s Day, thank you notes, and every occasion in between.",
  keywords: [
    "occasion card",
    "birthday card online",
    "digital greeting card",
    "send wish by email",
    "e-card occasions",
    "online card for every occasion",
  ],
  alternates: { canonical: "/occasions" },
  openGraph: {
    title: "Occasion Cards & Wishes — Little Letter",
    description:
      "Digital birthday cards, love notes, thank you messages, and more — sent by email.",
    url: "/occasions",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Occasion cards and wishes",
  description:
    "Browse Little Letter occasion pages for birthday, wedding, Valentine’s, and more digital email cards.",
  url: `${SITE_URL}/occasions`,
};

export default function OccasionsHubPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader title="Cards & wishes for every occasion">
        Digital email letters — not printed cards, but just as personal.
      </PageHeader>

      <PixelWindow title="occasions_index.txt" icon="💌">
        <p className="font-display text-base leading-relaxed text-[var(--ll-ink)]">
          Pick an occasion below to see example wishes and start a letter. When
          someone searches for a birthday card, wedding wish, or Valentine
          message, this is what Little Letter is for: warm notes delivered by
          email, with a cute retro envelope preview before you send.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
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
                    {o.label} card & wish
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

      <div className="flex justify-start">
        <Link href="/create">
          <PixelButton size="lg">💌 Create any letter</PixelButton>
        </Link>
      </div>
    </div>
  );
}
