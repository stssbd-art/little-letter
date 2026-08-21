import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardComposeForm } from "@/components/features/CardComposeForm";
import {
  CARD_DESIGNS,
  getCardDesign,
  isCardDesignId,
} from "@/lib/card-designs";
import { SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ designId: string }>;
};

export function generateStaticParams() {
  return CARD_DESIGNS.map((d) => ({ designId: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { designId } = await params;
  if (!isCardDesignId(designId)) {
    return { title: "Card not found" };
  }
  const design = getCardDesign(designId);
  return {
    title: `${design.title} — Digital Card`,
    description: `${design.blurb}. Personalise and email this digital greeting card with Little Letter.`,
    alternates: { canonical: `/cards/${design.id}` },
    openGraph: {
      title: `${design.title} — Little Letter`,
      description: design.blurb,
      url: `/cards/${design.id}`,
      type: "website",
    },
  };
}

export default async function CardDesignPage({ params }: Props) {
  const { designId } = await params;
  if (!isCardDesignId(designId)) notFound();
  const design = getCardDesign(designId);

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
          }),
        }}
      />
      <CardComposeForm designId={design.id} />
    </>
  );
}
