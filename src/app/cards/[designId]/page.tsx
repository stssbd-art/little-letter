import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { CardComposeForm } from "@/components/features/CardComposeForm";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  CARD_DESIGNS,
  getCardDesign,
  isCardDesignId,
} from "@/lib/card-designs";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ designId: string }>;
};

export function generateStaticParams() {
  return CARD_DESIGNS.map((d) => ({ designId: d.id }));
}

async function cardCoverImageUrl(designId: string): Promise<string> {
  const file = path.join(process.cwd(), "public", "ecards", `${designId}.png`);
  try {
    await fs.access(file);
    return `${SITE_URL}/ecards/${designId}.png`;
  } catch {
    return `${SITE_URL}/opengraph-image`;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { designId } = await params;
  if (!isCardDesignId(designId)) {
    return { title: "Card not found" };
  }
  const design = getCardDesign(designId);
  const imageUrl = await cardCoverImageUrl(design.id);
  const title = `${design.title} — Digital Greeting Card`;
  const description = `${design.blurb}. Personalise and email this digital greeting card with ${SITE_NAME} — free to send.`;
  return {
    title,
    description,
    keywords: [
      design.title,
      "digital greeting card",
      "e-card",
      "send card online",
      design.occasion,
    ],
    alternates: { canonical: `/cards/${design.id}` },
    openGraph: {
      title: `${design.title} — ${SITE_NAME}`,
      description: design.blurb,
      url: `/cards/${design.id}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${design.title} digital greeting card cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${design.title} — ${SITE_NAME}`,
      description: design.blurb,
      images: [imageUrl],
    },
  };
}

export default async function CardDesignPage({ params }: Props) {
  const { designId } = await params;
  if (!isCardDesignId(designId)) notFound();
  const design = getCardDesign(designId);
  const imageUrl = await cardCoverImageUrl(design.id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: design.title,
            description: design.blurb,
            url: `${SITE_URL}/cards/${design.id}`,
            image: imageUrl,
            brand: {
              "@type": "Brand",
              name: SITE_NAME,
            },
            category: "Digital greeting card",
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/cards/${design.id}`,
              price: "0.00",
              priceCurrency: "GBP",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader title={`${design.emoji} ${design.title}`}>
          {design.blurb} Personalise this digital card and send it by email — free.
        </PageHeader>
        <CardComposeForm designId={design.id} />
      </div>
    </>
  );
}
