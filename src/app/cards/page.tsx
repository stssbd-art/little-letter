import type { Metadata } from "next";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { CardsGallery } from "@/components/features/CardsGallery";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE_URL } from "@/lib/constants";
import { CARD_DESIGNS } from "@/lib/card-designs";

export const metadata: Metadata = {
  title: "Send a Digital Greeting Card Online",
  description:
    "Browse animated digital greeting cards for birthdays, love, thank you, weddings, and more — pick a design, personalise, and email it free.",
  keywords: [
    "send a card online",
    "digital greeting card",
    "e-card",
    "birthday e-card",
    "online greeting card",
    "free digital card",
  ],
  alternates: { canonical: "/cards" },
  openGraph: {
    title: "Digital Greeting Cards — Little Letter",
    description:
      "Pick from animated card designs and email a personal wish — like a cosy e-card site.",
    url: "/cards",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Browse digital greeting cards on Little Letter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Greeting Cards — Little Letter",
    description:
      "Pick from animated card designs and email a personal wish — free to send.",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Digital greeting cards",
  description:
    "Browse and send animated digital greeting cards by email for every occasion.",
  url: `${SITE_URL}/cards`,
  numberOfItems: CARD_DESIGNS.length,
};

export default function CardsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader title="Send an e-card">
        Illustrated digital greeting cards — pick a design, write a wish, email
        it. Flip-open covers · free to send.
      </PageHeader>

      <PixelWindow title="card_gallery.exe" icon="🎴">
        <p className="mb-5 font-display text-base leading-relaxed text-[var(--ll-ink)]">
          Each card has its own illustrated cover — balloons, rose gardens,
          starlit nights, and more. Tap one to open it, personalise the inside,
          and send by email.
        </p>
        <CardsGallery />
      </PixelWindow>
    </div>
  );
}
