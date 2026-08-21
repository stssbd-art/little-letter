"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GreetingCard } from "@/components/features/GreetingCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { ShareBar } from "@/components/features/ShareBar";
import { OCCASIONS, SITE_URL } from "@/lib/constants";
import { getCardDesign, type CardDesignId } from "@/lib/card-designs";
import type { CardShare } from "@/lib/card-link";

type Props = {
  card: CardShare;
  code: string;
};

export function OpenCardView({ card, code }: Props) {
  const design = getCardDesign(card.designId);
  const occasionLabel = OCCASIONS.find((o) => o.value === card.occasion)?.label;
  const shareUrl = `${SITE_URL}/open/${encodeURIComponent(code)}`;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-pixel text-[9px] tracking-widest text-[var(--ll-pink-deep)]">
          A CARD FOR YOU
        </p>
        <h1 className="mt-2 font-display text-2xl text-[var(--ll-ink)] sm:text-3xl">
          {design.emoji} From {card.from}
        </h1>
        <p className="mt-1 text-sm text-[var(--ll-muted)]">
          Tap the card to open the animated e-card
        </p>
      </motion.div>

      <GreetingCard
        designId={card.designId as CardDesignId}
        recipientName={card.to}
        subject={card.subject}
        message={card.message}
        senderName={card.from}
        occasionLabel={occasionLabel}
      />

      <PixelWindow title="share_this_card.lnk" icon="📣" liftOnHover={false}>
        <ShareBar
          url={shareUrl}
          title={`${card.subject} · Little Letter card`}
          text={`${card.from} sent ${card.to} a digital card`}
        />
      </PixelWindow>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/cards">
          <PixelButton>🎴 Send a card back</PixelButton>
        </Link>
        <Link href="/">
          <PixelButton variant="ghost">Home</PixelButton>
        </Link>
      </div>
    </div>
  );
}
