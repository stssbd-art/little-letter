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
  topClassName: string;
  open: boolean;
  onToggle: () => void;
};

/** Full desktop right-edge slide (large screens only). */
function DesktopSideSlide({
  offer,
  tabLabel,
  tabClassName,
  topClassName,
  open,
  onToggle,
}: SlideProps) {
  const panelId = useId();

  return (
    <aside
      className={cn(
        "pointer-events-none fixed right-0 z-[200] hidden -translate-y-1/2 items-stretch lg:flex",
        topClassName
      )}
      aria-label={`Sponsored: ${offer.label}`}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-stretch transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-[calc(100%-2.75rem)]"
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            "flex min-h-[6.5rem] w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-l-xl border-[3px] border-r-0 py-3 shadow-[3px_3px_0_rgba(61,47,34,0.3)]",
            tabClassName,
            !open && "animate-pulse"
          )}
        >
          <span className="text-xl leading-none" aria-hidden>
            {offer.emoji}
          </span>
          <span className="font-pixel text-[6px] tracking-[0.18em] text-[#fff6df] [writing-mode:vertical-rl] rotate-180">
            {open ? "CLOSE" : tabLabel}
          </span>
        </button>

        <div
          id={panelId}
          className={cn(
            "flex w-[min(16rem,calc(100vw-3.5rem))] flex-col rounded-l-none rounded-bl-xl border-[3px] border-l-0 px-3 py-3 shadow-[3px_3px_0_rgba(61,47,34,0.3)]",
            !open && "pointer-events-none",
            offer.tone.border,
            offer.tone.bg
          )}
          aria-hidden={!open}
        >
          <OfferBody offer={offer} compact />
        </div>
      </div>
    </aside>
  );
}

/** Tiny emoji chips for phones — two only, small so they don’t dominate the screen. */
function MobileChip({
  offer,
  tabClassName,
  topClassName,
  open,
  onToggle,
}: Omit<SlideProps, "tabLabel">) {
  const panelId = useId();

  return (
    <aside
      className={cn(
        "pointer-events-none fixed right-0 z-[200] flex -translate-y-1/2 items-stretch lg:hidden",
        topClassName
      )}
      aria-label={`Sponsored: ${offer.label}`}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-stretch transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-[calc(100%-2rem)]"
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            "flex h-9 w-8 shrink-0 items-center justify-center rounded-l-md border-2 border-r-0 shadow-[2px_2px_0_rgba(61,47,34,0.28)]",
            tabClassName,
            !open && "animate-pulse"
          )}
        >
          <span className="text-base leading-none" aria-hidden>
            {open ? "✕" : offer.emoji}
          </span>
        </button>

        <div
          id={panelId}
          className={cn(
            "flex w-[min(12rem,calc(100vw-2.75rem))] flex-col rounded-l-none rounded-bl-lg border-2 border-l-0 px-2 py-2 shadow-[2px_2px_0_rgba(61,47,34,0.28)]",
            !open && "pointer-events-none",
            offer.tone.border,
            offer.tone.bg
          )}
          aria-hidden={!open}
        >
          <OfferBody offer={offer} compact />
        </div>
      </div>
    </aside>
  );
}

function OfferBody({
  offer,
  compact,
}: {
  offer: AffiliateOffer;
  compact?: boolean;
}) {
  return (
    <>
      <p className={cn("font-pixel text-[6px] tracking-widest", offer.tone.muted)}>
        SPONSORED
      </p>
      <a
        href={offer.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-1.5 block"
      >
        <span className="flex items-start gap-2">
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg shadow-inner",
              compact ? "h-9 w-9 text-xl" : "h-11 w-11 text-2xl",
              offer.tone.iconBg
            )}
            aria-hidden
          >
            {offer.emoji}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block font-display leading-snug",
                compact ? "text-sm" : "text-base",
                offer.tone.title
              )}
            >
              {offer.label}
            </span>
            <span
              className={cn(
                "mt-0.5 block leading-snug",
                compact ? "text-[11px]" : "text-xs",
                offer.tone.muted
              )}
            >
              {offer.blurb}
            </span>
          </span>
        </span>
        <span
          className={cn(
            "mt-2 inline-flex items-center rounded-md border px-2.5 py-1.5 font-pixel text-[8px] transition",
            compact ? "min-h-9" : "min-h-10 border-2",
            offer.tone.title,
            offer.tone.ctaBorder,
            offer.tone.ctaBg
          )}
        >
          SHOP →
        </span>
      </a>
    </>
  );
}

/** Side affiliate: 2 tiny chips on mobile, full tabs on large desktops. */
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

  const desktopSlides = [
    cadbury
      ? {
          offer: cadbury,
          topClassName: "top-[16%]",
          tabLabel: "CHOCS",
          tabClassName:
            "border-[#6b3a2a] bg-gradient-to-b from-[#8b4a32] to-[#4a2018]",
        }
      : null,
    deanMorris
      ? {
          offer: deanMorris,
          topClassName: "top-[32%]",
          tabLabel: "CARDS",
          tabClassName:
            "border-[#4a5a7a] bg-gradient-to-b from-[#5a6a88] to-[#2a3548]",
        }
      : null,
    stories
      ? {
          offer: stories,
          topClassName: "top-[48%]",
          tabLabel: "BOOKS",
          tabClassName:
            "border-[#7a4a5a] bg-gradient-to-b from-[#8a4a5a] to-[#4a2030]",
        }
      : null,
    vintageWine
      ? {
          offer: vintageWine,
          topClassName: "top-[64%]",
          tabLabel: "WINE",
          tabClassName:
            "border-[#5a2a3a] bg-gradient-to-b from-[#7a3040] to-[#3a1520]",
        }
      : null,
    brickZone
      ? {
          offer: brickZone,
          topClassName: "top-[80%]",
          tabLabel: "BRICKS",
          tabClassName:
            "border-[#3a6a4a] bg-gradient-to-b from-[#3a7a4a] to-[#1a3a28]",
        }
      : null,
  ].filter((s): s is NonNullable<typeof s> => Boolean(s));

  const mobileSlides = desktopSlides.slice(0, 2).map((slide, i) => ({
    ...slide,
    topClassName: i === 0 ? "top-[42%]" : "top-[58%]",
  }));

  if (!mounted || desktopSlides.length === 0) {
    return null;
  }

  return createPortal(
    <>
      {mobileSlides.map((slide) => (
        <MobileChip
          key={`m-${slide.offer.id}`}
          offer={slide.offer}
          topClassName={slide.topClassName}
          tabClassName={slide.tabClassName}
          open={openId === `m-${slide.offer.id}`}
          onToggle={() =>
            setOpenId((id) =>
              id === `m-${slide.offer.id}` ? null : `m-${slide.offer.id}`
            )
          }
        />
      ))}
      {desktopSlides.map((slide) => (
        <DesktopSideSlide
          key={`d-${slide.offer.id}`}
          offer={slide.offer}
          topClassName={slide.topClassName}
          tabLabel={slide.tabLabel}
          tabClassName={slide.tabClassName}
          open={openId === `d-${slide.offer.id}`}
          onToggle={() =>
            setOpenId((id) =>
              id === `d-${slide.offer.id}` ? null : `d-${slide.offer.id}`
            )
          }
        />
      ))}
    </>,
    document.body
  );
}
