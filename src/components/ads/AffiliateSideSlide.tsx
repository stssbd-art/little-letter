"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  AFFILIATE_OFFERS,
  type AffiliateOffer,
} from "@/lib/affiliates";
import { cn } from "@/lib/utils";

type SlideProps = {
  offer: AffiliateOffer;
  /** CSS top position, e.g. "38%" / "62%" */
  top: string;
  tabLabel: string;
  tabClassName: string;
};

function OneSideSlide({
  offer,
  top,
  tabLabel,
  tabClassName,
}: SlideProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <aside
      /* Layout box stays wide while closed; never steal taps from page content */
      className="pointer-events-none fixed right-0 z-[200] hidden -translate-y-1/2 items-stretch md:flex"
      style={{ top }}
      aria-label={`Sponsored: ${offer.label}`}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-stretch transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-[calc(100%-3rem)]"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            "flex min-h-[7.5rem] w-12 shrink-0 flex-col items-center justify-center gap-2 rounded-l-2xl border-[3px] border-r-0 py-4 shadow-[4px_4px_0_rgba(61,47,34,0.35)]",
            tabClassName,
            !open && "animate-pulse"
          )}
        >
          <span className="text-2xl leading-none" aria-hidden>
            {offer.emoji}
          </span>
          <span className="font-pixel text-[7px] tracking-[0.2em] text-[#fff6df] [writing-mode:vertical-rl] rotate-180">
            {open ? "CLOSE" : tabLabel}
          </span>
        </button>

        <div
          id={panelId}
          className={cn(
            "flex w-[min(17.5rem,calc(100vw-3.75rem))] flex-col rounded-l-none rounded-bl-2xl border-[3px] border-l-0 px-3.5 py-3.5 shadow-[4px_4px_0_rgba(61,47,34,0.35)]",
            /* Closed panel is off-screen — don't let it eat taps under the transform */
            !open && "pointer-events-none",
            offer.tone.border,
            offer.tone.bg
          )}
          aria-hidden={!open}
        >
          <p className={cn("font-pixel text-[7px] tracking-widest", offer.tone.muted)}>
            SPONSORED
          </p>
          <a
            href={offer.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="mt-2 block"
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
                "mt-3 inline-flex min-h-11 items-center rounded-lg border-2 px-3 py-2 font-pixel text-[9px] transition",
                offer.tone.title,
                offer.tone.ctaBorder,
                offer.tone.ctaBg
              )}
            >
              SHOP NOW →
            </span>
          </a>
        </div>
      </div>
    </aside>
  );
}

/** Desktop-only right-edge slides (Cadbury + Social Stories). Mobile uses footer banners. */
export function AffiliateSideSlide() {
  const [mounted, setMounted] = useState(false);
  const cadbury = AFFILIATE_OFFERS.find((o) => o.id === "cadbury");
  const stories = AFFILIATE_OFFERS.find((o) => o.id === "social-stories");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || (!cadbury && !stories)) return null;

  return createPortal(
    <>
      {cadbury ? (
        <OneSideSlide
          offer={cadbury}
          top="36%"
          tabLabel="CHOCS"
          tabClassName="border-[#6b3a2a] bg-gradient-to-b from-[#8b4a32] to-[#4a2018]"
        />
      ) : null}
      {stories ? (
        <OneSideSlide
          offer={stories}
          top="64%"
          tabLabel="BOOKS"
          tabClassName="border-[#7a4a5a] bg-gradient-to-b from-[#8a4a5a] to-[#4a2030]"
        />
      ) : null}
    </>,
    document.body
  );
}
