"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { LEFT_IMAGE_AFFILIATE } from "@/lib/affiliates";
import { cn } from "@/lib/utils";

/**
 * Slim left-edge sponsored image (CJ creative) — narrow tab, not a wide banner.
 */
export function LeftAffiliateAd() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const offer = LEFT_IMAGE_AFFILIATE;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <aside
      className="pointer-events-none fixed left-0 top-[28%] z-[200] hidden -translate-y-1/2 items-stretch sm:flex"
      aria-label={`Sponsored: ${offer.label}`}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-stretch transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-[calc(-100%+2.5rem)]"
        )}
      >
        <div
          id={panelId}
          className={cn(
            "flex w-[7.5rem] flex-col overflow-hidden rounded-r-xl border-[3px] border-r-0 border-[var(--ll-window-border)] bg-[var(--ll-window-bg)] shadow-[3px_3px_0_rgba(61,47,34,0.28)]",
            !open && "pointer-events-none"
          )}
          aria-hidden={!open}
        >
          <p className="px-1.5 pt-1.5 text-center font-pixel text-[5px] tracking-widest text-[var(--ll-muted)]">
            SPONSORED
          </p>
          <a
            href={offer.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="block px-1.5 pb-1.5 pt-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- affiliate tracking creative */}
            <img
              src={offer.imageSrc}
              alt={offer.label}
              width={120}
              height={65}
              className="h-auto w-full rounded-md border border-[var(--ll-lavender)] object-contain"
            />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            "flex min-h-[5.5rem] w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-r-xl border-[3px] border-l-0 border-[var(--ll-window-border)] bg-gradient-to-b from-[var(--ll-btn-from)] to-[var(--ll-btn-to)] py-2 shadow-[3px_3px_0_rgba(61,47,34,0.28)]",
            !open && "animate-pulse"
          )}
        >
          <span className="text-lg leading-none" aria-hidden>
            {open ? "✕" : offer.emoji}
          </span>
          <span className="font-pixel text-[6px] tracking-[0.18em] text-[var(--ll-btn-text)] [writing-mode:vertical-rl]">
            {open ? "CLOSE" : offer.tabLabel}
          </span>
        </button>
      </div>
    </aside>,
    document.body
  );
}
