import type { Metadata } from "next";
import Link from "next/link";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  CONTENT_UPDATED,
  formatContentDate,
} from "@/lib/content-updated";

export const metadata: Metadata = {
  title: "Guides — How to Send Letters, Cards & Mixtapes",
  description:
    "Practical guides for sending a warm email letter, digital greeting card, or romantic mixtape with Little Letter.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Guides — Little Letter",
    description:
      "How to send letters, digital cards, and mixtapes that feel handmade.",
    url: "/guides",
    type: "website",
  },
};

const GUIDES = [
  {
    href: "/guides/how-to-send-a-little-letter",
    title: "How to send a Little Letter",
    blurb:
      "From picking an occasion to hitting send — a clear walkthrough of letters, cards, and mixtapes.",
  },
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Guides">
        Plain-English help for sending something kind. Last updated{" "}
        {formatContentDate(CONTENT_UPDATED.guides)}.
      </PageHeader>

      <div className="space-y-4">
        {GUIDES.map((guide) => (
          <PixelWindow key={guide.href} title="guide.index" icon="📚">
            <h2 className="font-display text-base text-[var(--ll-ink)]">
              <Link
                href={guide.href}
                className="text-[var(--ll-pink-deep)] underline underline-offset-2"
              >
                {guide.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ll-muted)]">
              {guide.blurb}
            </p>
            <div className="mt-4">
              <Link href={guide.href}>
                <PixelButton>Read guide</PixelButton>
              </Link>
            </div>
          </PixelWindow>
        ))}
      </div>
    </div>
  );
}
