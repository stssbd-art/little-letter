"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LEFT_IMAGE_AFFILIATE } from "@/lib/affiliates";

/**
 * Always-open left-edge sponsored image — horizontal creative, fixed vertically
 * on the left (not folded, not full-page wide).
 */
export function LeftAffiliateAd() {
  const [mounted, setMounted] = useState(false);
  const offer = LEFT_IMAGE_AFFILIATE;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <aside
      className="pointer-events-none fixed left-2 top-1/2 z-[200] hidden -translate-y-1/2 sm:block"
      aria-label={`Sponsored: ${offer.label}`}
    >
      <div className="pointer-events-auto w-[11.5rem] overflow-hidden rounded-xl border-[3px] border-[var(--ll-window-border)] bg-[var(--ll-window-bg)] p-1.5 shadow-[3px_3px_0_rgba(61,47,34,0.28)]">
        <p className="mb-1 text-center font-pixel text-[5px] tracking-widest text-[var(--ll-muted)]">
          SPONSORED
        </p>
        <a
          href={offer.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- affiliate tracking creative */}
          <img
            src={offer.imageSrc}
            alt={offer.label}
            width={480}
            height={260}
            className="h-auto w-full rounded-md border border-[var(--ll-lavender)] object-contain"
          />
        </a>
      </div>
    </aside>,
    document.body
  );
}
