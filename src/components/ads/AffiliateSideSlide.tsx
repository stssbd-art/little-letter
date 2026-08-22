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
  tabLabel: string;
  tabClassName: string;
  /** Tailwind top classes, e.g. "top-[36%] lg:top-[16%]" */
  topClassName: string;
  /** When false, slide is desktop/tablet-large only (hidden on phones). */
  showOnMobile: boolean;
  open: boolean;
  onToggle: () => void;
};

function OneSideSlide({
  offer,
  tabLabel,
  tabClassName,
  topClassName,
  showOnMobile,
  open,
  onToggle,
}: SlideProps) {
  const panelId = useId();

  return (
    <aside
      /* Layout box stays wide while closed; never steal taps from page content */
      className={cn(
        "pointer-events-none fixed right-0 z-[200] -translate-y-1/2 items-stretch",
        topClassName,
        showOnMobile ? "flex" : "hidden lg:flex"
      )}
      aria-label={`Sponsored: ${offer.label}`}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-stretch transition-transform duration-300 ease-out",
          open
            ? "translate-x-0"
            : "translate-x-[calc(100%-2.5rem)] lg:translate-x-[calc(100%-3rem)]"
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            "flex min-h-[5.25rem] w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-l-2xl border-[3px] border-r-0 py-3 shadow-[4px_4px_0_rgba(61,47,34,0.35)] lg:min-h-[7.5rem] lg:w-12 lg:gap-2 lg:py-4",
            tabClassName,
            !open && "animate-pulse"
          )}
        >
          <span className="text-xl leading-none lg:text-2xl" aria-hidden>
            {offer.emoji}
          </span>
          <span className="font-pixel text-[6px] tracking-[0.15em] text-[#fff6df] [writing-mode:vertical-rl] rotate-180 lg:text-[7px] lg:tracking-[0.2em]">
            {open ? "CLOSE" : tabLabel}
          </span>
        </button>

        <div
          id={panelId}
          className={cn(
            "flex w-[min(17.5rem,calc(100vw-3.25rem))] flex-col rounded-l-none rounded-bl-2xl border-[3px] border-l-0 px-3.5 py-3.5 shadow-[4px_4px_0_rgba(61,47,34,0.35)] lg:w-[min(17.5rem,calc(100vw-3.75rem))]",
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

/** Right-edge slides: 2 on phone/tablet, all five on large desktops. */
export function AffiliateSideSlide() {
  const [mounted, setMounted] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const cadbury = AFFILIATE_OFFERS.find((o) => o.id === "cadbury");
  const stories = AFFILIATE_OFFERS.find((o) => o.id === "social-stories");
  const deanMorris = AFFILIATE_OFFERS.find((o) => o.id === "dean-morris");
  const vintageWine = AFFILIATE_OFFERS.find((o) => o.id === "vintage-wine");
  const brickZone = AFFILIATE_OFFERS.find((o) => o.id === "brick-zone");

  useEffect(() => {
    setMounted(true);
  }, []);

  const slides = [
    cadbury
      ? {
          offer: cadbury,
          showOnMobile: true,
          topClassName: "top-[36%] lg:top-[16%]",
          tabLabel: "CHOCS",
          tabClassName:
            "border-[#6b3a2a] bg-gradient-to-b from-[#8b4a32] to-[#4a2018]",
        }
      : null,
    deanMorris
      ? {
          offer: deanMorris,
          showOnMobile: true,
          topClassName: "top-[62%] lg:top-[32%]",
          tabLabel: "CARDS",
          tabClassName:
            "border-[#4a5a7a] bg-gradient-to-b from-[#5a6a88] to-[#2a3548]",
        }
      : null,
    stories
      ? {
          offer: stories,
          showOnMobile: false,
          topClassName: "lg:top-[48%]",
          tabLabel: "BOOKS",
          tabClassName:
            "border-[#7a4a5a] bg-gradient-to-b from-[#8a4a5a] to-[#4a2030]",
        }
      : null,
    vintageWine
      ? {
          offer: vintageWine,
          showOnMobile: false,
          topClassName: "lg:top-[64%]",
          tabLabel: "WINE",
          tabClassName:
            "border-[#5a2a3a] bg-gradient-to-b from-[#7a3040] to-[#3a1520]",
        }
      : null,
    brickZone
      ? {
          offer: brickZone,
          showOnMobile: false,
          topClassName: "lg:top-[80%]",
          tabLabel: "BRICKS",
          tabClassName:
            "border-[#3a6a4a] bg-gradient-to-b from-[#3a7a4a] to-[#1a3a28]",
        }
      : null,
  ].filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  if (!mounted || slides.length === 0) {
    return null;
  }

  return createPortal(
    <>
      {slides.map((slide) => (
        <OneSideSlide
          key={slide.offer.id}
          offer={slide.offer}
          topClassName={slide.topClassName}
          showOnMobile={slide.showOnMobile}
          tabLabel={slide.tabLabel}
          tabClassName={slide.tabClassName}
          open={openId === slide.offer.id}
          onToggle={() =>
            setOpenId((id) =>
              id === slide.offer.id ? null : slide.offer.id
            )
          }
        />
      ))}
    </>,
    document.body
  );
}
