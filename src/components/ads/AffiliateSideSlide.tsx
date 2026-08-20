"use client";

import { useEffect, useState } from "react";
import { SIDE_SLIDE_OFFERS } from "@/lib/affiliates";
import { cn } from "@/lib/utils";

/** Fixed side tab — one sponsored offer per slide. */
export function AffiliateSideSlide() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const total = SIDE_SLIDE_OFFERS.length;
  const offer = SIDE_SLIDE_OFFERS[index] ?? SIDE_SLIDE_OFFERS[0];

  useEffect(() => {
    if (!open || total < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5200);
    return () => window.clearInterval(id);
  }, [open, total]);

  if (!offer || total === 0) return null;

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + total) % total);
  };

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
            "flex w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-l-xl border-2 border-r-0 py-3 shadow-[3px_3px_0_rgba(61,47,34,0.25)] transition-colors duration-300",
            offer.tone.border,
            offer.tone.bg
          )}
        >
          <span className="text-lg leading-none" aria-hidden>
            {offer.emoji}
          </span>
          <span
            className={cn(
              "font-pixel text-[6px] tracking-widest [writing-mode:vertical-rl] rotate-180",
              offer.tone.title
            )}
          >
            {open ? "CLOSE" : "OFFERS"}
          </span>
        </button>

        <div
          id="affiliate-side-panel"
          className={cn(
            "flex w-[min(17rem,calc(100vw-3.5rem))] flex-col rounded-l-none rounded-bl-xl border-2 border-l-0 px-3 py-3 shadow-[3px_3px_0_rgba(61,47,34,0.25)] transition-colors duration-300",
            offer.tone.border,
            offer.tone.bg
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className={cn("font-pixel text-[6px] tracking-widest", offer.tone.muted)}>
              SPONSORED · {index + 1}/{total}
            </p>
            {total > 1 ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className={cn(
                    "rounded border px-1.5 py-0.5 font-pixel text-[7px] transition hover:brightness-125",
                    offer.tone.ctaBorder,
                    offer.tone.title
                  )}
                  aria-label="Previous offer"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className={cn(
                    "rounded border px-1.5 py-0.5 font-pixel text-[7px] transition hover:brightness-125",
                    offer.tone.ctaBorder,
                    offer.tone.title
                  )}
                  aria-label="Next offer"
                >
                  →
                </button>
              </div>
            ) : null}
          </div>

          <a
            key={offer.id}
            href={offer.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="block"
          >
            <span className="flex items-start gap-2.5">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl shadow-inner",
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
                    "mt-1 block text-[11px] leading-snug",
                    offer.tone.muted
                  )}
                >
                  {offer.blurb}
                </span>
              </span>
            </span>
            <span
              className={cn(
                "mt-3 inline-flex rounded-lg border px-3 py-2 font-pixel text-[8px] transition",
                offer.tone.title,
                offer.tone.ctaBorder,
                offer.tone.ctaBg
              )}
            >
              SHOP →
            </span>
          </a>

          {total > 1 ? (
            <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden>
              {SIDE_SLIDE_OFFERS.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index
                      ? cn("w-4", offer.tone.iconBg)
                      : "w-1.5 bg-white/35"
                  )}
                  aria-label={`Show ${item.label}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
