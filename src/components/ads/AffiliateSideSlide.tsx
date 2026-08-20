"use client";

import { useState } from "react";
import { SIDE_SLIDE_OFFERS } from "@/lib/affiliates";
import { cn } from "@/lib/utils";

const TAB = SIDE_SLIDE_OFFERS[0];

/** Fixed side tab that slides out Awin sponsored offers. */
export function AffiliateSideSlide() {
  const [open, setOpen] = useState(false);

  if (!TAB || SIDE_SLIDE_OFFERS.length === 0) return null;

  return (
    <aside
      className="pointer-events-none fixed right-0 top-[42%] z-[45] flex -translate-y-1/2 items-stretch sm:top-1/2"
      aria-label="Sponsored offers"
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
            TAB.tone.border,
            TAB.tone.bg
          )}
        >
          <span className="text-base leading-none" aria-hidden>
            🍫
          </span>
          <span className="text-base leading-none" aria-hidden>
            📖
          </span>
          <span
            className={cn(
              "font-pixel text-[6px] tracking-widest [writing-mode:vertical-rl] rotate-180",
              TAB.tone.title
            )}
          >
            {open ? "CLOSE" : "OFFERS"}
          </span>
        </button>

        <div
          id="affiliate-side-panel"
          className={cn(
            "flex w-[min(17rem,calc(100vw-3.5rem))] flex-col gap-2.5 rounded-l-none rounded-bl-xl border-2 border-l-0 px-3 py-3 shadow-[3px_3px_0_rgba(61,47,34,0.25)]",
            TAB.tone.border,
            "bg-[var(--ll-window-bg)]/95 backdrop-blur-sm"
          )}
        >
          <p className="font-pixel text-[6px] tracking-widest text-[var(--ll-muted)]">
            SPONSORED
          </p>
          {SIDE_SLIDE_OFFERS.map((offer) => (
            <a
              key={offer.id}
              href={offer.href}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className={cn(
                "group block overflow-hidden rounded-xl border-2 px-2.5 py-2.5 shadow-[2px_2px_0_rgba(61,47,34,0.18)] transition hover:brightness-110",
                offer.tone.border,
                offer.tone.bg
              )}
            >
              <span className="flex items-start gap-2">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl",
                    offer.tone.iconBg
                  )}
                  aria-hidden
                >
                  {offer.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block font-display text-sm leading-snug",
                      offer.tone.title
                    )}
                  >
                    {offer.label}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-[11px] leading-snug",
                      offer.tone.muted
                    )}
                  >
                    {offer.blurb}
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 inline-block font-pixel text-[7px]",
                      offer.tone.title
                    )}
                  >
                    SHOP →
                  </span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
