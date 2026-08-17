"use client";

import { useEffect, useState } from "react";
import { FloatingClouds } from "@/components/decorations/FloatingClouds";
import { FloatingHearts } from "@/components/decorations/FloatingHearts";
import { FlyingButterflies } from "@/components/decorations/FlyingButterflies";
import { WhimsicalFlyers } from "@/components/decorations/WhimsicalFlyers";

export function AnimatedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 crt-overlay" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 mp3-bezel opacity-40 dark:opacity-25"
        aria-hidden
      />
      {reduceMotion ? null : (
        <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
          <FloatingClouds />
          <WhimsicalFlyers />
          <FloatingHearts />
          <FlyingButterflies />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
