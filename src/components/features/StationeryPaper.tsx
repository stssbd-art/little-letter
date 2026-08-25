"use client";

import type { LetterStationery } from "@/lib/letter-stationery";
import { cn } from "@/lib/utils";

type Props = {
  stationery: LetterStationery;
  subject?: string;
  children: React.ReactNode;
  className?: string;
  /** Show era ribbon (default true). Stamp lives on the envelope only. */
  showChrome?: boolean;
  /** Compact for draft editor / picker preview */
  compact?: boolean;
};

function paperLayers(stationery: LetterStationery): {
  backgroundImage: string;
  backgroundSize: string;
} {
  const accent = stationery.accent;
  const border = stationery.paperBorder;
  const grain = "radial-gradient(rgba(61,47,34,0.055) 0.8px, transparent 0.8px)";

  switch (stationery.decor) {
    case "lace":
      return {
        backgroundImage: [
          grain,
          `radial-gradient(circle at 12% 18%, ${accent}22 0 10px, transparent 11px)`,
          `radial-gradient(circle at 88% 16%, ${accent}22 0 10px, transparent 11px)`,
          `radial-gradient(circle at 10% 88%, ${accent}18 0 12px, transparent 13px)`,
          `radial-gradient(circle at 90% 90%, ${accent}18 0 12px, transparent 13px)`,
          `linear-gradient(90deg, ${border}33 1px, transparent 1px), linear-gradient(${border}33 1px, transparent 1px)`,
          `linear-gradient(180deg, ${accent}14, transparent 18%, transparent 82%, ${accent}14)`,
        ].join(", "),
        backgroundSize: "6px 6px, auto, auto, auto, auto, 18px 18px, auto",
      };
    case "deco":
      return {
        backgroundImage: [
          grain,
          `repeating-linear-gradient(135deg, ${accent}20 0 8px, transparent 8px 16px)`,
          `linear-gradient(180deg, ${border}26 0 10px, transparent 10px), linear-gradient(0deg, ${border}26 0 10px, transparent 10px)`,
          `linear-gradient(90deg, ${border}26 0 10px, transparent 10px), linear-gradient(270deg, ${border}26 0 10px, transparent 10px)`,
        ].join(", "),
        backgroundSize: "6px 6px, auto, auto, auto",
      };
    case "roses":
      return {
        backgroundImage: [
          grain,
          `repeating-linear-gradient(transparent, transparent 27px, ${border}28 27px, ${border}28 28px)`,
          `radial-gradient(circle at 92% 12%, ${accent}30 0 18px, transparent 19px)`,
          `radial-gradient(circle at 8% 90%, ${accent}22 0 22px, transparent 23px)`,
          `linear-gradient(180deg, ${accent}12, transparent 20%)`,
        ].join(", "),
        backgroundSize: "6px 6px, 100% 28px, auto, auto, auto",
      };
    case "retro":
      return {
        backgroundImage: [
          grain,
          `repeating-linear-gradient(90deg, ${accent}24 0 14px, ${border}18 14px 28px)`,
          `radial-gradient(circle at 20% 30%, ${accent}35 0 7px, transparent 8px)`,
          `radial-gradient(circle at 70% 55%, ${border}30 0 9px, transparent 10px)`,
          `radial-gradient(circle at 40% 80%, ${accent}28 0 6px, transparent 7px)`,
        ].join(", "),
        backgroundSize: "6px 6px, auto, auto, auto, auto",
      };
    case "story":
      return {
        backgroundImage: [
          grain,
          `repeating-linear-gradient(transparent, transparent 26px, ${border}30 26px, ${border}30 27px)`,
          `linear-gradient(90deg, transparent 0 11%, ${accent}22 11%, ${accent}22 calc(11% + 2px), transparent calc(11% + 2px))`,
          `radial-gradient(circle at 85% 18%, ${accent}25 0 14px, transparent 15px)`,
        ].join(", "),
        backgroundSize: "6px 6px, 100% 27px, auto, auto",
      };
    case "botanical":
      return {
        backgroundImage: [
          grain,
          `radial-gradient(ellipse at 15% 20%, ${accent}28 0 30px, transparent 31px)`,
          `radial-gradient(ellipse at 85% 75%, ${border}24 0 36px, transparent 37px)`,
          `radial-gradient(circle at 78% 22%, ${accent}20 0 10px, transparent 11px)`,
          `linear-gradient(180deg, ${border}18, transparent 14%, transparent 86%, ${border}18)`,
        ].join(", "),
        backgroundSize: "6px 6px, auto, auto, auto, auto",
      };
    case "hearts":
      return {
        backgroundImage: [
          grain,
          `radial-gradient(circle at 18% 22%, ${accent}26 0 8px, transparent 9px)`,
          `radial-gradient(circle at 42% 48%, ${accent}18 0 10px, transparent 11px)`,
          `radial-gradient(circle at 72% 28%, ${accent}22 0 7px, transparent 8px)`,
          `radial-gradient(circle at 88% 70%, ${accent}20 0 11px, transparent 12px)`,
          `radial-gradient(circle at 28% 78%, ${accent}16 0 9px, transparent 10px)`,
          `linear-gradient(180deg, ${accent}16, transparent 22%)`,
        ].join(", "),
        backgroundSize: "6px 6px, auto, auto, auto, auto, auto, auto",
      };
    case "cake":
      return {
        backgroundImage: [
          grain,
          `radial-gradient(circle at 20% 25%, ${accent}35 0 4px, transparent 5px)`,
          `radial-gradient(circle at 55% 18%, ${border}40 0 3px, transparent 4px)`,
          `radial-gradient(circle at 78% 40%, ${accent}30 0 5px, transparent 6px)`,
          `radial-gradient(circle at 35% 70%, ${border}35 0 4px, transparent 5px)`,
          `radial-gradient(circle at 85% 80%, ${accent}28 0 3px, transparent 4px)`,
          `repeating-linear-gradient(135deg, transparent 0 10px, ${accent}12 10px 12px)`,
        ].join(", "),
        backgroundSize: "6px 6px, auto, auto, auto, auto, auto, auto",
      };
    case "birds":
      return {
        backgroundImage: [
          grain,
          `repeating-linear-gradient(transparent, transparent 28px, ${border}26 28px, ${border}26 29px)`,
          `linear-gradient(90deg, ${accent}20 0 8px, transparent 8px), linear-gradient(270deg, ${accent}20 0 8px, transparent 8px)`,
          `radial-gradient(circle at 88% 14%, ${accent}22 0 16px, transparent 17px)`,
        ].join(", "),
        backgroundSize: "6px 6px, 100% 29px, auto, auto",
      };
    case "toys":
      return {
        backgroundImage: [
          grain,
          `repeating-linear-gradient(45deg, ${accent}14 0 12px, transparent 12px 24px)`,
          `radial-gradient(circle at 14% 16%, ${border}35 0 12px, transparent 13px)`,
          `radial-gradient(circle at 90% 85%, ${accent}28 0 16px, transparent 17px)`,
        ].join(", "),
        backgroundSize: "6px 6px, auto, auto, auto",
      };
    case "holly":
      return {
        backgroundImage: [
          grain,
          `radial-gradient(circle at 16% 18%, ${accent}30 0 9px, transparent 10px)`,
          `radial-gradient(circle at 84% 20%, ${accent}28 0 10px, transparent 11px)`,
          `radial-gradient(circle at 20% 84%, ${border}25 0 8px, transparent 9px)`,
          `radial-gradient(circle at 80% 82%, ${accent}22 0 11px, transparent 12px)`,
          `linear-gradient(180deg, ${accent}14, transparent 16%, transparent 84%, ${accent}14)`,
        ].join(", "),
        backgroundSize: "6px 6px, auto, auto, auto, auto, auto",
      };
    default:
      return {
        backgroundImage: [
          grain,
          `linear-gradient(180deg, ${accent}10, transparent 18%, transparent 82%, ${accent}10)`,
          `linear-gradient(90deg, ${border}18 0 6px, transparent 6px), linear-gradient(270deg, ${border}18 0 6px, transparent 6px)`,
        ].join(", "),
        backgroundSize: "6px 6px, auto, auto",
      };
  }
}

const CORNER_MARKS: Record<LetterStationery["decor"], [string, string, string, string]> = {
  none: ["✦", "✦", "✦", "✦"],
  lace: ["✿", "✿", "✿", "✿"],
  deco: ["◆", "◆", "◆", "◆"],
  roses: ["🌹", "🥀", "🌹", "🥀"],
  retro: ["🌼", "✌️", "🌻", "🌼"],
  story: ["⭐", "☁️", "🌙", "⭐"],
  botanical: ["🌿", "🦋", "🌸", "🍃"],
  hearts: ["♡", "♥", "♡", "♥"],
  cake: ["🎂", "🎈", "🎁", "✨"],
  birds: ["🕊️", "✉️", "🕊️", "💌"],
  toys: ["🧸", "⭐", "🏠", "🌟"],
  holly: ["🎄", "❄️", "⭐", "🎄"],
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
  const layers = paperLayers(stationery);
  const marks = CORNER_MARKS[stationery.decor];
  const pad = compact ? "p-3 sm:p-4" : "p-4 sm:p-6";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-[3px] shadow-[5px_6px_0_rgba(61,47,34,0.14)]",
        stationery.fontClass,
        className
      )}
      style={{
        backgroundColor: stationery.paperBg,
        borderColor: stationery.paperBorder,
        color: stationery.ink,
        ...layers,
      }}
    >
      {/* Inner ornate frame */}
      <div
        className="pointer-events-none absolute inset-2 rounded-xl border sm:inset-2.5"
        style={{ borderColor: `${stationery.paperBorder}99` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-3 rounded-lg border border-dashed sm:inset-3.5"
        style={{ borderColor: `${stationery.accent}55` }}
        aria-hidden
      />

      {/* Corner ornaments */}
      {(
        [
          ["left-3 top-3", marks[0]],
          ["right-3 top-3", marks[1]],
          ["bottom-3 left-3", marks[2]],
          ["bottom-3 right-3", marks[3]],
        ] as const
      ).map(([pos, mark]) => (
        <span
          key={pos}
          className={cn(
            "pointer-events-none absolute z-[1] select-none opacity-70",
            compact ? "text-sm" : "text-base sm:text-lg",
            pos
          )}
          style={{ color: stationery.accent }}
          aria-hidden
        >
          {mark}
        </span>
      ))}

      {showChrome ? (
        <div
          className={cn(
            "relative z-[1] mx-4 mt-4 flex items-center justify-between gap-2 rounded-lg border px-3 sm:mx-5 sm:mt-5",
            compact ? "py-1.5" : "py-2"
          )}
          style={{
            borderColor: `${stationery.paperBorder}aa`,
            backgroundColor: `${stationery.paperBg}cc`,
          }}
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
              {stationery.era} stationery · vintage paper
            </p>
          </div>
          <span
            className="shrink-0 font-script text-xl leading-none"
            style={{ color: stationery.accent }}
            aria-hidden
          >
            {stationery.sealEmoji}
          </span>
        </div>
      ) : null}

      <div
        className={cn(
          "relative z-[1]",
          pad,
          showChrome && (compact ? "pt-3" : "pt-4")
        )}
      >
        {subject ? (
          <p
            className="mb-2 break-words font-display text-sm font-semibold leading-snug sm:mb-2.5 sm:text-base"
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

/** Compact visual swatch for the stationery picker grid. */
export function StationerySwatch({
  stationery,
  selected,
  onSelect,
}: {
  stationery: LetterStationery;
  selected: boolean;
  onSelect: () => void;
}) {
  const layers = paperLayers(stationery);
  const marks = CORNER_MARKS[stationery.decor];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border-[3px] text-left transition",
        "shadow-[3px_3px_0_rgba(61,47,34,0.12)]",
        selected
          ? "border-[var(--ll-pink-deep)] ring-2 ring-[var(--ll-pink)]/50"
          : "border-[var(--ll-lavender)] hover:border-[var(--ll-pink-deep)]"
      )}
    >
      <div
        className="relative h-[4.5rem] w-full overflow-hidden border-b-2"
        style={{
          backgroundColor: stationery.paperBg,
          borderColor: stationery.paperBorder,
          ...layers,
        }}
      >
        <span
          className="absolute left-1.5 top-1 text-[10px] opacity-80"
          style={{ color: stationery.accent }}
          aria-hidden
        >
          {marks[0]}
        </span>
        <span
          className="absolute right-1.5 top-1 text-[10px] opacity-80"
          style={{ color: stationery.accent }}
          aria-hidden
        >
          {marks[1]}
        </span>
        <span
          className="absolute bottom-1 left-1.5 text-[10px] opacity-70"
          style={{ color: stationery.accent }}
          aria-hidden
        >
          {marks[2]}
        </span>
        <span
          className="absolute bottom-1 right-1.5 text-[10px] opacity-70"
          style={{ color: stationery.accent }}
          aria-hidden
        >
          {marks[3]}
        </span>
        <div
          className="absolute inset-x-3 bottom-2 top-5 rounded-sm border border-dashed"
          style={{ borderColor: `${stationery.paperBorder}88` }}
        >
          <div
            className="mx-1.5 mt-1.5 h-1 rounded-full opacity-50"
            style={{ backgroundColor: stationery.ink }}
          />
          <div
            className="mx-1.5 mt-1 h-1 w-3/4 rounded-full opacity-35"
            style={{ backgroundColor: stationery.ink }}
          />
          <div
            className="mx-1.5 mt-1 h-1 w-1/2 rounded-full opacity-25"
            style={{ backgroundColor: stationery.ink }}
          />
        </div>
      </div>
      <div className="space-y-0.5 bg-white/70 px-2.5 py-2 dark:bg-black/20">
        <p className="flex items-center gap-1 font-display text-xs text-[var(--ll-ink)]">
          <span aria-hidden>{stationery.emoji}</span>
          <span className="truncate">{stationery.title}</span>
        </p>
        <p className="line-clamp-2 text-[10px] leading-snug text-[var(--ll-muted)]">
          {stationery.era} · {stationery.blurb}
        </p>
      </div>
    </button>
  );
}
