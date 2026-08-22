import { FOOTER_AFFILIATE_OFFERS } from "@/lib/affiliates";
import { cn } from "@/lib/utils";

/** Compact sponsored banners above the footer (kept small on phones). */
export function AffiliateBanner() {
  return (
    <aside
      className="relative z-10 mx-auto mt-6 max-w-6xl space-y-2 px-3 sm:mt-8 sm:space-y-3 sm:px-4"
      aria-label="Sponsored"
    >
      {FOOTER_AFFILIATE_OFFERS.map((offer) => (
        <a
          key={offer.id}
          href={offer.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className={cn(
            "group flex items-center gap-2.5 overflow-hidden rounded-lg border-2 px-2.5 py-2 shadow-[2px_2px_0_rgba(61,47,34,0.18)] transition hover:brightness-110 sm:gap-4 sm:rounded-xl sm:px-4 sm:py-3 sm:shadow-[3px_3px_0_rgba(61,47,34,0.2)]",
            offer.tone.border,
            offer.tone.bg
          )}
        >
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xl shadow-inner sm:h-12 sm:w-12 sm:rounded-lg sm:text-2xl",
              offer.tone.iconBg
            )}
            aria-hidden
          >
            {offer.emoji}
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span
              className={cn(
                "block font-pixel text-[5px] tracking-widest sm:text-[6px]",
                offer.tone.muted
              )}
            >
              SPONSORED
            </span>
            <span
              className={cn(
                "mt-0.5 block truncate font-display text-xs sm:text-base",
                offer.tone.title
              )}
            >
              {offer.label}
            </span>
            <span
              className={cn(
                "mt-0.5 block truncate text-[11px] sm:text-xs",
                offer.tone.muted
              )}
            >
              {offer.blurb}
            </span>
          </span>
          <span
            className={cn(
              "shrink-0 rounded-md border px-2 py-1 font-pixel text-[6px] transition sm:rounded-lg sm:px-2.5 sm:py-1.5 sm:text-[7px]",
              offer.tone.title,
              offer.tone.ctaBorder,
              offer.tone.ctaBg
            )}
          >
            SHOP →
          </span>
        </a>
      ))}
    </aside>
  );
}
