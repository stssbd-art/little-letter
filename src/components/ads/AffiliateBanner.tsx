import { AWIN_CADBURY } from "@/lib/affiliates";

/** Small sponsored Awin banner above the footer. */
export function AffiliateBanner() {
  return (
    <aside
      className="relative z-10 mx-auto mt-8 max-w-6xl px-4"
      aria-label="Sponsored"
    >
      <a
        href={AWIN_CADBURY.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="group flex items-center gap-3 overflow-hidden rounded-xl border-2 border-[#6b3a2a]/40 bg-gradient-to-r from-[#4a2018] via-[#6b3a2a] to-[#8b4a32] px-3 py-2.5 shadow-[3px_3px_0_rgba(61,47,34,0.2)] transition hover:brightness-110 sm:gap-4 sm:px-4 sm:py-3"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f5e6c8] text-2xl shadow-inner sm:h-12 sm:w-12"
          aria-hidden
        >
          🍫
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-pixel text-[6px] tracking-widest text-[#f5e6c8]/80">
            SPONSORED
          </span>
          <span className="mt-0.5 block truncate font-display text-sm text-[#fff6df] sm:text-base">
            {AWIN_CADBURY.label}
          </span>
          <span className="mt-0.5 block truncate text-xs text-[#f5e6c8]/90">
            {AWIN_CADBURY.blurb}
          </span>
        </span>
        <span className="shrink-0 rounded-lg border border-[#f5e6c8]/35 bg-[#f5e6c8]/15 px-2.5 py-1.5 font-pixel text-[7px] text-[#fff6df] transition group-hover:bg-[#f5e6c8]/25">
          SHOP →
        </span>
      </a>
    </aside>
  );
}
