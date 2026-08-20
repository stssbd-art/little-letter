import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpenCardView } from "@/components/features/OpenCardView";
import { decodeCardShare } from "@/lib/card-link";
import { getCardDesign } from "@/lib/card-designs";
import { SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const card = decodeCardShare(decodeURIComponent(code.trim()));
  if (!card) {
    return { title: "Open card" };
  }
  const design = getCardDesign(card.designId);
  return {
    title: `${design.title} for ${card.to}`,
    description: `${card.from} sent you a digital card — open it on Little Letter.`,
    openGraph: {
      title: `${design.emoji} A card for ${card.to}`,
      description: `From ${card.from} · ${design.title}`,
      url: `/open/${encodeURIComponent(code.trim())}`,
      images: [{ url: `${SITE_URL}/ecards/${card.designId}.png` }],
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
