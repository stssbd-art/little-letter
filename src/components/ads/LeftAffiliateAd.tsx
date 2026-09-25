"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LEFT_IMAGE_AFFILIATE } from "@/lib/affiliates";

/**
 * Always-open left-edge sponsored banner.
 * Click uses the CJ tracking URL; art is hosted locally so ad-blockers
 * don’t leave an empty box (remote CJ image domains are often blocked).
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
      <div className="pointer-events-auto w-[15rem] overflow-hidden rounded-xl border-[3px] border-[var(--ll-window-border)] bg-[var(--ll-window-bg)] p-1.5 shadow-[3px_3px_0_rgba(61,47,34,0.28)]">
        <p className="mb-1 text-center font-pixel text-[5px] tracking-widest text-[var(--ll-muted)]">
          SPONSORED
        </p>
        <a
          href={offer.href}
          target="_blank"
          rel="sponsored noopener"
          className="block rounded-md outline-none ring-[var(--ll-pink-deep)] transition hover:brightness-105 focus-visible:ring-2"
        >
          {/* Local creative so the banner always shows; click still hits CJ. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={offer.localImageSrc}
            alt={offer.label}
            width={480}
            height={260}
            className="h-auto w-full rounded-md border border-[var(--ll-lavender)] object-contain"
          />
          <span className="mt-1 block text-center font-pixel text-[7px] tracking-wide text-[var(--ll-pink-deep)]">
            SHOP →
          </span>
        </a>
        {/* Impression pixel (may be blocked; harmless if so). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={offer.imageSrc}
          alt=""
          width={1}
          height={1}
          className="pointer-events-none absolute h-px w-px opacity-0"
          aria-hidden
        />
      </div>
    </aside>,
    document.body
  );
}
