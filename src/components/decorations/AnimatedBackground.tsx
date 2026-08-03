"use client";

import { FloatingClouds } from "@/components/decorations/FloatingClouds";
import { FallingPetals } from "@/components/decorations/FallingPetals";
import { FlyingButterflies } from "@/components/decorations/FlyingButterflies";
import { FloatingEnvelopes } from "@/components/decorations/FloatingEnvelopes";
import { TwinklingStars } from "@/components/decorations/TwinklingStars";
import { FloatingHearts } from "@/components/decorations/FloatingHearts";
import { SparkleCursor } from "@/components/decorations/SparkleCursor";
import { EmojiRain } from "@/components/decorations/EmojiRain";
import {
  MoonEasterEgg,
  FlowerEasterEgg,
} from "@/components/decorations/MoonEasterEgg";

export function AnimatedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 crt-overlay" aria-hidden />
      <div className="pointer-events-none absolute inset-0 pixel-grid opacity-30 dark:opacity-20" aria-hidden />
      <FloatingClouds />
      <TwinklingStars />
      <FallingPetals />
      <FloatingHearts />
      <FloatingEnvelopes />
      <FlyingButterflies />
      <MoonEasterEgg />
      <FlowerEasterEgg />
      <SparkleCursor />
      <EmojiRain />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
