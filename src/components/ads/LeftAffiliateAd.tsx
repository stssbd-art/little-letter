"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LEFT_IMAGE_AFFILIATE } from "@/lib/affiliates";
import cjBanner from "@/assets/cj-17343754.png";

/**
 * Always-open left-edge sponsored banner — horizontal creative rotated
 * to stand vertically (sideways) along the left side of the page.
 */
export function LeftAffiliateAd() {
  const [mounted, setMounted] = useState(false);
  const offer = LEFT_IMAGE_AFFILIATE;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const imgSrc = typeof cjBanner === "string" ? cjBanner : cjBanner.src;

  return createPortal(
    <aside
      className="pointer-events-none fixed left-2 top-1/2 z-[200] hidden -translate-y-1/2 sm:block"
      aria-label={`Sponsored: ${offer.label}`}
    >
      {/* Narrow vertical slot: 260×480 aspect after rotating the 480×260 art */}
      <div className="pointer-events-auto relative h-[min(20rem,55vh)] w-[6.75rem] overflow-hidden rounded-xl border-[3px] border-[var(--ll-window-border)] bg-[var(--ll-window-bg)] shadow-[3px_3px_0_rgba(61,47,34,0.28)]">
        <p className="absolute left-1/2 top-1.5 z-10 -translate-x-1/2 font-pixel text-[5px] tracking-widest text-[var(--ll-muted)]">
          SPONSORED
        </p>
        <a
          href={offer.href}
          target="_top"
          rel="sponsored"
          className="absolute inset-0 block outline-none ring-[var(--ll-pink-deep)] focus-visible:ring-2"
          aria-label={offer.label}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={offer.label}
            width={480}
            height={260}
            className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-90 rounded-md border border-[var(--ll-lavender)] object-contain"
            style={{
              /* After -90° rotate, width becomes the vertical span */
              width: "min(20rem, 55vh)",
              height: "auto",
            }}
          />
        </a>
        <span className="pointer-events-none absolute bottom-1.5 left-1/2 z-10 -translate-x-1/2 font-pixel text-[6px] tracking-wide text-[var(--ll-pink-deep)]">
          SHOP →
        </span>
      </div>
    </aside>,
    document.body
  );
}
