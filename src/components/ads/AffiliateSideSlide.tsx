"use client";

import { useState } from "react";
import { AFFILIATE_OFFERS } from "@/lib/affiliates";
import { cn } from "@/lib/utils";

const OFFER = AFFILIATE_OFFERS.find((o) => o.id === "cadbury") ?? AFFILIATE_OFFERS[0];

/** Fixed side tab that slides out to the Cadbury Awin offer. */
export function AffiliateSideSlide() {
  const [open, setOpen] = useState(false);

  if (!OFFER) return null;

  return (
    <aside
      className="pointer-events-none fixed right-0 top-[42%] z-[45] flex -translate-y-1/2 items-stretch sm:top-1/2"
      aria-label="Sponsored offer"
    >
      <div
        className={cn(
          "pointer-events-auto flex items-stretch transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-[calc(100%-2.75rem)]"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="affiliate-side-panel"
          className={cn(
            "flex w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-l-xl border-2 border-r-0 py-3 shadow-[3px_3px_0_rgba(61,47,34,0.25)]",
            OFFER.tone.border,
            OFFER.tone.bg
          )}
        >
          <span className="text-lg leading-none" aria-hidden>
            {OFFER.emoji}
          </span>
          <span
            className={cn(
              "font-pixel text-[6px] tracking-widest [writing-mode:vertical-rl] rotate-180",
              OFFER.tone.title
            )}
          >
            {open ? "CLOSE" : "OFFER"}
          </span>
        </button>

        <div
          id="affiliate-side-panel"
          className={cn(
            "w-[min(16.5rem,calc(100vw-3.5rem))] rounded-l-none rounded-bl-xl border-2 border-l-0 px-3 py-3 shadow-[3px_3px_0_rgba(61,47,34,0.25)]",
            OFFER.tone.border,
            OFFER.tone.bg
          )}
        >
          <p className={cn("font-pixel text-[6px] tracking-widest", OFFER.tone.muted)}>
            SPONSORED
          </p>
          <p className={cn("mt-1 font-display text-sm leading-snug", OFFER.tone.title)}>
            {OFFER.label}
          </p>
          <p className={cn("mt-1 text-xs leading-snug", OFFER.tone.muted)}>{OFFER.blurb}</p>
          <a
            href={OFFER.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className={cn(
              "mt-3 inline-flex items-center rounded-lg border px-3 py-2 font-pixel text-[8px] transition",
              OFFER.tone.title,
              OFFER.tone.ctaBorder,
              OFFER.tone.ctaBg
            )}
          >
            SHOP CADBURY →
          </a>
        </div>
      </div>
    </aside>
  );
}
