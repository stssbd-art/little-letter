import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { OpenCardView } from "@/components/features/OpenCardView";
import { decodeCardShare } from "@/lib/card-link";
import { getCardDesign, isCardDesignId } from "@/lib/card-designs";
import { SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ code: string }>;
};

async function coverImageUrl(designId: string): Promise<string> {
  if (!isCardDesignId(designId)) {
    return `${SITE_URL}/opengraph-image`;
  }
  const file = path.join(process.cwd(), "public", "ecards", `${designId}.png`);
  try {
    await fs.access(file);
    return `${SITE_URL}/ecards/${designId}.png`;
  } catch {
    return `${SITE_URL}/opengraph-image`;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const card = decodeCardShare(decodeURIComponent(code.trim()));
  if (!card) {
    return { title: "Open card" };
  }
  const design = getCardDesign(card.designId);
  const title = `${design.title} for ${card.to}`;
  const description = `${card.from} sent you a digital card — open it on Little Letter.`;
  const url = `${SITE_URL}/open/${encodeURIComponent(code.trim())}`;
  const imageUrl = await coverImageUrl(card.designId);
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${design.emoji} A card for ${card.to}`,
      description: `From ${card.from} · ${design.title}`,
      url,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${design.title} card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${design.emoji} A card for ${card.to}`,
      description: `From ${card.from} · ${design.title}`,
      images: [imageUrl],
    },
  };
}

export default async function OpenCardPage({ params }: Props) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw.trim());
  const card = decodeCardShare(code);
  if (!card) notFound();

  return <OpenCardView card={card} code={code} />;
}
