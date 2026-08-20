import type { Metadata } from "next";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { CardsGallery } from "@/components/features/CardsGallery";
import { PageHeader } from "@/components/layout/PageHeader";
import { SITE_URL } from "@/lib/constants";
import { CARD_DESIGNS } from "@/lib/card-designs";

export const metadata: Metadata = {
  title: "Send a Digital Greeting Card Online",
  description:
    "Browse animated digital greeting cards for birthdays, love, thank you, weddings, and more — pick a design, personalise, and email it. First two free · then £0.99.",
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

      <PageHeader title="Send a digital card">
        Browse designs by occasion — pick one, write a wish, email it. Animated
        e-cards · first two free · then £0.99.
      </PageHeader>

      <PixelWindow title="card_gallery.exe" icon="🎴">
        <p className="mb-5 font-display text-base leading-relaxed text-[var(--ll-ink)]">
          Choose a look that fits the moment — birthday balloons, blush hearts,
          wedding champagne, and more. Tap a card to personalise it live, then
          send it by email.
        </p>
        <CardsGallery />
      </PixelWindow>
    </div>
  );
}
