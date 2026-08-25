"use client";

import { useId } from "react";
import type { LetterStationery } from "@/lib/letter-stationery";
import { cn } from "@/lib/utils";

type Props = {
  stationery: LetterStationery;
  subject?: string;
  children: React.ReactNode;
  className?: string;
  showChrome?: boolean;
  compact?: boolean;
};

/** Bold vintage artwork — each decor reads as a different paper world. */
function StationeryArt({
  decor,
  accent,
  border,
  compact,
}: {
  decor: LetterStationery["decor"];
  accent: string;
  border: string;
  compact?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const size = compact ? "text-lg" : "text-2xl sm:text-3xl";

  if (decor === "none") {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-x-0 top-0 h-3"
          style={{
            background: `repeating-linear-gradient(90deg, ${accent} 0 10px, ${border} 10px 20px)`,
            opacity: 0.55,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-3"
          style={{
            background: `repeating-linear-gradient(90deg, ${border} 0 10px, ${accent} 10px 20px)`,
            opacity: 0.55,
          }}
        />
        <span className={cn("absolute left-3 top-5 opacity-80", size)}>💌</span>
        <span className={cn("absolute right-3 top-5 opacity-80", size)}>✨</span>
        <span className={cn("absolute bottom-4 left-3 opacity-70", size)}>✦</span>
        <span className={cn("absolute bottom-4 right-3 opacity-70", size)}>✦</span>
      </div>
    );
  }

  if (decor === "lace") {
    const pid = `ll-lace-${uid}`;
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <defs>
            <pattern id={pid} width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="8" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.35" />
              <circle cx="12" cy="12" r="3" fill={accent} opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pid})`} />
          <rect
            x="3%"
            y="3%"
            width="94%"
            height="94%"
            fill="none"
            stroke={border}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.55"
          />
        </svg>
        <span className={cn("absolute left-2 top-3", size)}>🥀</span>
        <span className={cn("absolute right-2 top-3", size)}>🥀</span>
        <span className={cn("absolute bottom-3 left-2", size)}>✿</span>
        <span className={cn("absolute bottom-3 right-2", size)}>✿</span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-sm opacity-80 sm:text-base">
          ❦ · Victorian lace · ❦
        </span>
      </div>
    );
  }

  if (decor === "deco") {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <rect x="2%" y="2%" width="96%" height="96%" fill="none" stroke={border} strokeWidth="3" />
          <rect x="4%" y="4%" width="92%" height="92%" fill="none" stroke={accent} strokeWidth="1.5" />
          <polygon points="20,8 40,8 30,22" fill={accent} opacity="0.55" />
          <polygon points="60,8 80,8 70,22" fill={border} opacity="0.45" />
          <polygon points="20,92 40,92 30,78" fill={border} opacity="0.45" />
          <polygon points="60,92 80,92 70,78" fill={accent} opacity="0.55" />
          <line x1="8%" y1="50%" x2="92%" y2="50%" stroke={accent} strokeWidth="1" opacity="0.25" />
        </svg>
        <span className={cn("absolute left-3 top-6 opacity-90", size)}>◆</span>
        <span className={cn("absolute right-3 top-6 opacity-90", size)}>◆</span>
        <span className={cn("absolute bottom-5 left-3 opacity-80", size)}>◇</span>
        <span className={cn("absolute bottom-5 right-3 opacity-80", size)}>◇</span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 font-pixel text-[8px] tracking-widest opacity-80 sm:text-[9px]">
          1920 · ART DECO · GLAM
        </span>
      </div>
    );
  }

  if (decor === "roses") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `repeating-linear-gradient(transparent, transparent 26px, ${border}55 26px, ${border}55 27px)`,
          }}
        />
        <span className={cn("absolute -left-1 top-2 rotate-[-12deg]", size)}>🌹</span>
        <span className={cn("absolute -right-1 top-4 rotate-[14deg]", size)}>🌹</span>
        <span className={cn("absolute bottom-2 left-2 rotate-[8deg]", size)}>🥀</span>
        <span className={cn("absolute bottom-3 right-1 rotate-[-10deg]", size)}>💋</span>
        <span className="absolute left-[18%] top-[40%] text-4xl opacity-15 sm:text-5xl">♡</span>
        <span className="absolute right-[20%] top-[55%] text-3xl opacity-10">♡</span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs opacity-80 sm:text-sm">
          ♥ 1950s love letter ♥
        </span>
      </div>
    );
  }

  if (decor === "retro") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-x-0 top-0 h-10 sm:h-12"
          style={{
            background: `repeating-linear-gradient(90deg, #e8a060 0 18px, #f0c878 18px 36px, #d47850 36px 54px)`,
            opacity: 0.85,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-8"
          style={{
            background: `repeating-linear-gradient(90deg, #d47850 0 16px, #e8a060 16px 32px)`,
            opacity: 0.75,
          }}
        />
        <span className={cn("absolute left-3 top-12", size)}>🌼</span>
        <span className={cn("absolute right-3 top-14", size)}>🌻</span>
        <span className={cn("absolute bottom-10 left-4", size)}>✌️</span>
        <span className={cn("absolute bottom-10 right-4", size)}>🌈</span>
        <span className="absolute left-1/2 top-11 -translate-x-1/2 font-pixel text-[8px] tracking-wide text-[#6a4020] sm:top-12 sm:text-[9px]">
          1970s FLOWER POWER
        </span>
      </div>
    );
  }

  if (decor === "story") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(transparent, transparent 28px, ${border}66 28px, ${border}66 29px)`,
          }}
        />
        <div
          className="absolute bottom-0 top-0 w-1 left-[12%]"
          style={{ backgroundColor: `${accent}66` }}
        />
        <span className={cn("absolute right-3 top-3", size)}>☁️</span>
        <span className={cn("absolute right-10 top-8 text-lg opacity-80", size)}>⭐</span>
        <span className={cn("absolute left-3 bottom-4", size)}>🌙</span>
        <span className={cn("absolute right-4 bottom-5", size)}>📖</span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs opacity-75 sm:text-sm">
          Once upon a letter…
        </span>
      </div>
    );
  }

  if (decor === "botanical") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 200 260" preserveAspectRatio="xMidYMid slice">
          <path d="M20 40 C40 20, 60 30, 50 60 C70 50, 80 70, 55 85" fill="none" stroke={accent} strokeWidth="2" />
          <path d="M180 50 C160 30, 140 40, 150 70 C130 60, 120 90, 155 100" fill="none" stroke={border} strokeWidth="2" />
          <ellipse cx="35" cy="55" rx="10" ry="16" fill={accent} opacity="0.35" transform="rotate(-30 35 55)" />
          <ellipse cx="165" cy="70" rx="11" ry="17" fill={border} opacity="0.3" transform="rotate(25 165 70)" />
          <ellipse cx="40" cy="200" rx="12" ry="18" fill={accent} opacity="0.28" transform="rotate(20 40 200)" />
          <ellipse cx="170" cy="210" rx="10" ry="15" fill={border} opacity="0.28" transform="rotate(-15 170 210)" />
        </svg>
        <span className={cn("absolute left-2 top-3", size)}>🦋</span>
        <span className={cn("absolute right-2 top-4", size)}>🌿</span>
        <span className={cn("absolute bottom-3 left-3", size)}>🌸</span>
        <span className={cn("absolute bottom-3 right-2", size)}>🍃</span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs opacity-80 sm:text-sm">
          pressed flowers · cottage
        </span>
      </div>
    );
  }

  if (decor === "hearts") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 25%, ${accent} 0 6px, transparent 7px),
              radial-gradient(circle at 55% 40%, ${accent} 0 8px, transparent 9px),
              radial-gradient(circle at 80% 22%, ${accent} 0 5px, transparent 6px),
              radial-gradient(circle at 30% 70%, ${accent} 0 7px, transparent 8px),
              radial-gradient(circle at 75% 75%, ${accent} 0 9px, transparent 10px)`,
          }}
        />
        <span className={cn("absolute left-2 top-2", size)}>💘</span>
        <span className={cn("absolute right-2 top-3", size)}>💝</span>
        <span className={cn("absolute bottom-3 left-3", size)}>♡</span>
        <span className={cn("absolute bottom-3 right-3", size)}>♥</span>
        <span className="absolute left-1/2 top-[42%] -translate-x-1/2 text-6xl opacity-10 sm:text-7xl">
          ♥
        </span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs opacity-85 sm:text-sm">
          be my valentine
        </span>
      </div>
    );
  }

  if (decor === "cake") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 20%, #f6d58a 0 5px, transparent 6px),
              radial-gradient(circle at 40% 12%, #e8b4a8 0 4px, transparent 5px),
              radial-gradient(circle at 70% 18%, #c5d4a0 0 5px, transparent 6px),
              radial-gradient(circle at 88% 35%, #f6d58a 0 4px, transparent 5px),
              radial-gradient(circle at 22% 60%, #e8b4a8 0 4px, transparent 5px),
              radial-gradient(circle at 60% 70%, #c5d4a0 0 5px, transparent 6px),
              radial-gradient(circle at 85% 80%, #f6d58a 0 4px, transparent 5px)`,
          }}
        />
        <span className={cn("absolute left-2 top-3", size)}>🎂</span>
        <span className={cn("absolute right-2 top-3", size)}>🎈</span>
        <span className={cn("absolute bottom-3 left-3", size)}>🎁</span>
        <span className={cn("absolute bottom-3 right-2", size)}>✨</span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs opacity-85 sm:text-sm">
          happy birthday · vintage card
        </span>
      </div>
    );
  }

  if (decor === "birds") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-2 rounded-xl border-2 border-dashed opacity-50"
          style={{ borderColor: accent }}
        />
        <span className={cn("absolute left-3 top-3", size)}>🕊️</span>
        <span className={cn("absolute right-3 top-4", size)}>✉️</span>
        <span className={cn("absolute bottom-4 left-3", size)}>💌</span>
        <span className={cn("absolute bottom-4 right-3", size)}>🕊️</span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs opacity-80 sm:text-sm">
          thank you · friendship post
        </span>
      </div>
    );
  }

  if (decor === "toys") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${accent}55 0 12px, transparent 12px 24px)`,
          }}
        />
        <span className={cn("absolute left-2 top-2", size)}>🧸</span>
        <span className={cn("absolute right-2 top-3", size)}>🏠</span>
        <span className={cn("absolute bottom-3 left-3", size)}>⭐</span>
        <span className={cn("absolute bottom-3 right-2", size)}>🌟</span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs opacity-85 sm:text-sm">
          childhood keepsake
        </span>
      </div>
    );
  }

  if (decor === "holly") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-x-0 top-0 h-9"
          style={{
            background: `linear-gradient(90deg, #2a5a40, #8b3a3a, #2a5a40)`,
            opacity: 0.85,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-7"
          style={{
            background: `linear-gradient(90deg, #8b3a3a, #2a5a40, #8b3a3a)`,
            opacity: 0.8,
          }}
        />
        <span className={cn("absolute left-2 top-10 text-white drop-shadow", size)}>🎄</span>
        <span className={cn("absolute right-2 top-10", size)}>❄️</span>
        <span className={cn("absolute bottom-8 left-3", size)}>⭐</span>
        <span className={cn("absolute bottom-8 right-3", size)}>🎄</span>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 text-[10px] font-semibold tracking-wide text-[#fff8f0] sm:text-xs">
          ✶ vintage christmas post ✶
        </span>
      </div>
    );
  }

  return null;
}

function paperWash(stationery: LetterStationery): string {
  const a = stationery.accent;
  const b = stationery.paperBorder;
  switch (stationery.decor) {
    case "lace":
      return `radial-gradient(ellipse at 50% 0%, ${a}33, transparent 55%), linear-gradient(180deg, #faf3e6, #f3e6d0)`;
    case "deco":
      return `linear-gradient(135deg, #f4efe4 0%, #e8dfc8 50%, #f0e8d4 100%)`;
    case "roses":
      return `linear-gradient(180deg, #fff5f2, #ffe8e4 40%, #fff8f6)`;
    case "retro":
      return `linear-gradient(180deg, #faf0d8, #f5e0b8 45%, #f8e8c8)`;
    case "story":
      return `linear-gradient(180deg, #f8fbff, #eef4fa 50%, #f7fafc)`;
    case "botanical":
      return `linear-gradient(160deg, #f5ecd8, #e8f0d8 40%, #f2ead8)`;
    case "hearts":
      return `radial-gradient(circle at 80% 10%, ${a}44, transparent 40%), linear-gradient(180deg, #fff0f3, #ffe4ea)`;
    case "cake":
      return `linear-gradient(180deg, #fffaf0, #fff3dc 50%, #fff8ec)`;
    case "birds":
      return `linear-gradient(180deg, #f8faf2, #eef4e4 50%, #f5f8ee)`;
    case "toys":
      return `linear-gradient(180deg, #fff8f0, #ffe8d4 45%, #fff4e8)`;
    case "holly":
      return `linear-gradient(180deg, #faf8f4, #f0f4ee 40%, #faf6f0)`;
    default:
      return `linear-gradient(180deg, ${stationery.paperBg}, #fff6df 55%, ${stationery.paperBg})`;
  }
}

export function StationeryPaper({
  stationery,
  subject,
  children,
  className,
  showChrome = true,
  compact = false,
}: Props) {
  const topPad = compact ? "pt-12 sm:pt-14" : "pt-14 sm:pt-16";
  const sidePad = compact ? "px-4 pb-4 sm:px-5" : "px-5 pb-5 sm:px-7 sm:pb-7";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-[3px] shadow-[6px_8px_0_rgba(61,47,34,0.16)]",
        stationery.fontClass,
        className
      )}
      style={{
        backgroundColor: stationery.paperBg,
        borderColor: stationery.paperBorder,
        color: stationery.ink,
        backgroundImage: paperWash(stationery),
      }}
    >
      <StationeryArt
        decor={stationery.decor}
        accent={stationery.accent}
        border={stationery.paperBorder}
        compact={compact}
      />

      <div
        className="pointer-events-none absolute inset-2 rounded-xl border-2 sm:inset-2.5"
        style={{ borderColor: `${stationery.paperBorder}cc` }}
        aria-hidden
      />

      {showChrome ? (
        <div
          className={cn(
            "relative z-[2] mx-4 mt-10 flex items-center justify-between gap-2 rounded-lg border-2 px-3 shadow-sm sm:mx-5 sm:mt-12",
            compact ? "py-1.5" : "py-2"
          )}
          style={{
            borderColor: stationery.paperBorder,
            backgroundColor: "rgba(255,255,255,0.72)",
          }}
        >
          <div className="min-w-0">
            <p
              className="font-pixel text-[8px] tracking-wide sm:text-[9px]"
              style={{ color: stationery.accent }}
            >
              {stationery.emoji} {stationery.title}
            </p>
            <p className="truncate text-[10px]" style={{ color: stationery.muted }}>
              {stationery.era} · {stationery.blurb}
            </p>
          </div>
          <span className="shrink-0 text-xl sm:text-2xl" aria-hidden>
            {stationery.sealEmoji}
          </span>
        </div>
      ) : null}

      <div
        className={cn(
          "relative z-[2]",
          sidePad,
          showChrome ? (compact ? "pt-3" : "pt-4") : topPad
        )}
      >
        {subject ? (
          <p
            className="mb-2 break-words font-display text-sm font-semibold leading-snug sm:mb-3 sm:text-base"
            style={{ color: stationery.accent }}
          >
            {subject}
          </p>
        ) : null}
        <div
          className="rounded-xl border border-dashed bg-white/55 px-3 py-3 backdrop-blur-[1px] sm:px-4 sm:py-4"
          style={{ borderColor: `${stationery.paperBorder}99` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** Tall visual card for the stationery picker — art first, labels second. */
export function StationerySwatch({
  stationery,
  selected,
  onSelect,
}: {
  stationery: LetterStationery;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border-[3px] text-left transition",
        "shadow-[3px_4px_0_rgba(61,47,34,0.14)]",
        selected
          ? "border-[var(--ll-pink-deep)] ring-2 ring-[var(--ll-pink)]/60"
          : "border-[var(--ll-lavender)] hover:border-[var(--ll-pink-deep)]"
      )}
    >
      <div
        className="relative h-28 w-full overflow-hidden border-b-2 sm:h-32"
        style={{
          backgroundColor: stationery.paperBg,
          borderColor: stationery.paperBorder,
          backgroundImage: paperWash(stationery),
        }}
      >
        <StationeryArt
          decor={stationery.decor}
          accent={stationery.accent}
          border={stationery.paperBorder}
          compact
        />
        <div
          className="absolute inset-1.5 rounded-lg border"
          style={{ borderColor: `${stationery.paperBorder}aa` }}
        />
        <div className="absolute inset-x-4 bottom-3 top-10 rounded-md bg-white/50 px-2 py-1.5 backdrop-blur-[0.5px]">
          <div
            className="mt-0.5 h-1.5 rounded-full opacity-45"
            style={{ backgroundColor: stationery.ink }}
          />
          <div
            className="mt-1 h-1.5 w-4/5 rounded-full opacity-30"
            style={{ backgroundColor: stationery.ink }}
          />
          <div
            className="mt-1 h-1.5 w-3/5 rounded-full opacity-20"
            style={{ backgroundColor: stationery.ink }}
          />
        </div>
      </div>
      <div className="space-y-0.5 bg-white/80 px-2.5 py-2 dark:bg-black/25">
        <p className="flex items-center gap-1 font-display text-xs text-[var(--ll-ink)]">
          <span aria-hidden>{stationery.emoji}</span>
          <span className="truncate">{stationery.title}</span>
        </p>
        <p className="text-[10px] font-medium capitalize text-[var(--ll-pink-deep)]">
          {stationery.writingStyle} voice
        </p>
        <p className="line-clamp-2 text-[10px] leading-snug text-[var(--ll-muted)]">
          {stationery.era} · {stationery.blurb}
        </p>
      </div>
    </button>
  );
}
