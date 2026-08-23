"use client";

import type { LetterStationery } from "@/lib/letter-stationery";
import { PostageStamp } from "@/components/features/PostageStamp";
import { cn } from "@/lib/utils";

const DECOR_GLYPH: Record<LetterStationery["decor"], string | null> = {
  none: null,
  lace: "✦",
  deco: "◆",
  roses: "🌹",
  retro: "🌼",
  story: "⭐",
  botanical: "🌿",
  hearts: "♡",
  cake: "🎂",
  birds: "🕊️",
  toys: "🧸",
  holly: "🎄",
};

type Props = {
  stationery: LetterStationery;
  subject?: string;
  children: React.ReactNode;
  className?: string;
  /** Show stamp + era ribbon (default true) */
  showChrome?: boolean;
  /** Compact for draft editor */
  compact?: boolean;
};

/** Shared vintage paper frame for draft + preview. */
export function StationeryPaper({
  stationery,
  subject,
  children,
  className,
  showChrome = true,
  compact = false,
}: Props) {
  const glyph = DECOR_GLYPH[stationery.decor];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-[3px] shadow-[4px_4px_0_rgba(61,47,34,0.12)]",
        stationery.fontClass,
        className
      )}
      style={{
        backgroundColor: stationery.paperBg,
        borderColor: stationery.paperBorder,
        color: stationery.ink,
        backgroundImage: [
          "radial-gradient(rgba(61,47,34,0.045) 0.7px, transparent 0.7px)",
          stationery.decor === "lace"
            ? `linear-gradient(90deg, ${stationery.paperBorder}22 1px, transparent 1px), linear-gradient(${stationery.paperBorder}22 1px, transparent 1px)`
            : stationery.decor === "deco"
              ? `repeating-linear-gradient(135deg, ${stationery.accent}14 0 6px, transparent 6px 12px)`
              : undefined,
        ]
          .filter(Boolean)
          .join(", "),
        backgroundSize:
          stationery.decor === "lace"
            ? "7px 7px, 14px 14px, 14px 14px"
            : stationery.decor === "deco"
              ? "7px 7px, auto"
              : "7px 7px",
      }}
    >
      {showChrome ? (
        <>
          <div
            className={cn(
              "flex items-center justify-between gap-2 border-b px-3",
              compact ? "py-2" : "py-2.5"
            )}
            style={{ borderColor: `${stationery.paperBorder}99` }}
          >
            <div className="min-w-0">
              <p
                className="font-pixel text-[8px] tracking-wide"
                style={{ color: stationery.accent }}
              >
                {stationery.emoji} {stationery.title}
              </p>
              <p
                className="truncate text-[10px]"
                style={{ color: stationery.muted }}
              >
                {stationery.era} stationery
              </p>
            </div>
            <PostageStamp
              emoji={stationery.emoji}
              label={stationery.stampLabel}
              colors={stationery.stampColors}
              postmarkColor={stationery.postmarkColor}
              className="shrink-0 scale-75 origin-top-right"
            />
          </div>
          {glyph ? (
            <span
              className="pointer-events-none absolute bottom-3 right-3 text-xl opacity-50"
              aria-hidden
            >
              {glyph}
            </span>
          ) : null}
        </>
      ) : null}

      <div className={cn(compact ? "p-3" : "p-5", showChrome && "pt-3")}>
        {subject ? (
          <p
            className="mb-2 font-pixel text-[10px]"
            style={{ color: stationery.accent }}
          >
            {subject}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
