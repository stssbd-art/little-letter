import type { Metadata } from "next";
import Link from "next/link";
import { SharedExamples } from "@/components/features/SharedExamples";
import { PageHeader } from "@/components/layout/PageHeader";
import { PixelButton } from "@/components/ui/PixelButton";
import { SITE_URL } from "@/lib/constants";
import { listSharedExamples } from "@/lib/shared-examples";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Wall — Shared Letter & Mixtape Peeks",
  description:
    "Short opt-in peeks from letters and mixtapes people chose to share — names and a snippet only, never emails or full private messages.",
  alternates: { canonical: "/wall" },
  openGraph: {
    title: "The Wall — Little Letter",
    description:
      "Browse short shared peeks from letters and mixtapes people opted to show.",
    url: "/wall",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "The Wall",
  description:
    "Shared short peeks from Little Letter notes and mixtapes.",
  url: `${SITE_URL}/wall`,
};

export default async function WallPage() {
  const entries = await listSharedExamples();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader title="The Wall">
        Short peeks people chose to share — never emails or the full private
        message.
      </PageHeader>

      <SharedExamples initialEntries={entries} />

      <div className="flex flex-wrap gap-3">
        <Link href="/create">
          <PixelButton>✉️ Send a letter</PixelButton>
        </Link>
        <Link href="/mixtape">
          <PixelButton variant="secondary">📼 Send a mixtape</PixelButton>
        </Link>
      </div>
    </div>
  );
}
