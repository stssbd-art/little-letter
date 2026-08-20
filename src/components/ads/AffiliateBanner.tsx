import { AFFILIATE_OFFERS } from "@/lib/affiliates";
import { cn } from "@/lib/utils";

/** Small sponsored affiliate banners above the footer. */
export function AffiliateBanner() {
  return (
    <aside
      className="relative z-10 mx-auto mt-8 max-w-6xl space-y-3 px-4"
      aria-label="Sponsored"
    >
      {AFFILIATE_OFFERS.map((offer) => (
        <a
          key={offer.id}
          href={offer.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className={cn(
            "group flex items-center gap-3 overflow-hidden rounded-xl border-2 px-3 py-2.5 shadow-[3px_3px_0_rgba(61,47,34,0.2)] transition hover:brightness-110 sm:gap-4 sm:px-4 sm:py-3",
            offer.tone.border,
            offer.tone.bg
          )}
        >
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl shadow-inner sm:h-12 sm:w-12",
              offer.tone.iconBg
            )}
            aria-hidden
          >
            {offer.emoji}
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span
              className={cn(
                "block font-pixel text-[6px] tracking-widest",
                offer.tone.muted
              )}
            >
              SPONSORED
            </span>
            <span
              className={cn(
                "mt-0.5 block truncate font-display text-sm sm:text-base",
                offer.tone.title
              )}
            >
              {offer.label}
            </span>
            <span
              className={cn(
                "mt-0.5 block truncate text-xs",
                offer.tone.muted
              )}
            >
              {offer.blurb}
            </span>
          </span>
          <span
            className={cn(
              "shrink-0 rounded-lg border px-2.5 py-1.5 font-pixel text-[7px] transition",
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
