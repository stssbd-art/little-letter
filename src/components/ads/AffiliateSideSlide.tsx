"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SIDE_SLIDE_OFFERS } from "@/lib/affiliates";
import { cn } from "@/lib/utils";

/** Fixed right-edge slide — one sponsored offer at a time. */
export function AffiliateSideSlide() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);
  const total = SIDE_SLIDE_OFFERS.length;
  const offer = SIDE_SLIDE_OFFERS[index] ?? SIDE_SLIDE_OFFERS[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || total < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5500);
    return () => window.clearInterval(id);
  }, [open, total]);

  if (!mounted || !offer || total === 0) return null;

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + total) % total);
  };

  return createPortal(
    <aside
      className="fixed right-0 top-1/2 z-[200] flex -translate-y-1/2 items-stretch"
      aria-label="Sponsored gift offers"
    >
      <div
        className={cn(
          "flex items-stretch transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-[calc(100%-3rem)]"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="affiliate-side-panel"
          className={cn(
            "flex w-12 shrink-0 flex-col items-center justify-center gap-2 rounded-l-2xl border-[3px] border-r-0 py-4 shadow-[4px_4px_0_rgba(61,47,34,0.35)]",
            "border-[#6b3a2a] bg-gradient-to-b from-[#8b4a32] to-[#4a2018]",
            !open && "animate-pulse"
          )}
        >
          <span className="text-2xl leading-none" aria-hidden>
            {offer.emoji}
          </span>
          <span className="font-pixel text-[7px] tracking-[0.2em] text-[#fff6df] [writing-mode:vertical-rl] rotate-180">
            {open ? "CLOSE" : "GIFTS"}
          </span>
        </button>

        <div
          id="affiliate-side-panel"
          className={cn(
            "flex w-[min(18rem,calc(100vw-3.75rem))] flex-col rounded-l-none rounded-bl-2xl border-[3px] border-l-0 px-3.5 py-3.5 shadow-[4px_4px_0_rgba(61,47,34,0.35)]",
            offer.tone.border,
            offer.tone.bg
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className={cn("font-pixel text-[7px] tracking-widest", offer.tone.muted)}>
              SPONSORED · SLIDE {index + 1}/{total}
            </p>
            {total > 1 ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className={cn(
                    "rounded border px-2 py-1 font-pixel text-[8px] transition hover:brightness-125",
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
                    "rounded border px-2 py-1 font-pixel text-[8px] transition hover:brightness-125",
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
            href={offer.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="block"
          >
            <span className="flex items-start gap-2.5">
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-3xl shadow-inner",
                  offer.tone.iconBg
                )}
                aria-hidden
              >
                {offer.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block font-display text-base leading-snug",
                    offer.tone.title
                  )}
                >
                  {offer.label}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-xs leading-snug",
                    offer.tone.muted
                  )}
                >
                  {offer.blurb}
                </span>
              </span>
            </span>
            <span
              className={cn(
                "mt-3 inline-flex rounded-lg border-2 px-3 py-2 font-pixel text-[9px] transition",
                offer.tone.title,
                offer.tone.ctaBorder,
                offer.tone.ctaBg
              )}
            >
              SHOP NOW →
            </span>
          </a>

          {total > 1 ? (
            <div className="mt-3 flex items-center justify-center gap-2">
              {SIDE_SLIDE_OFFERS.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? cn("w-5", offer.tone.iconBg) : "w-2 bg-white/40"
                  )}
                  aria-label={`Show ${item.label}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </aside>,
    document.body
  );
}
