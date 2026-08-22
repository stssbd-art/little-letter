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
  /** Tailwind top classes, e.g. "top-[16%]" */
  topClassName: string;
  open: boolean;
  onToggle: () => void;
};

function OneSideSlide({
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
      /* Desktop/tablet-large only — phones use the bottom banner instead */
      className={cn(
        "pointer-events-none fixed right-0 z-[200] hidden -translate-y-1/2 items-stretch lg:flex",
        topClassName
      )}
      aria-label={`Sponsored: ${offer.label}`}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-stretch transition-transform duration-300 ease-out",
          open
            ? "translate-x-0"
            : "translate-x-[calc(100%-3rem)]"
        )}
      >
        <button
          type="button"
          onClick={onToggle}
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

/** Right-edge slides — large screens only (phones use AffiliateBanner). */
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
