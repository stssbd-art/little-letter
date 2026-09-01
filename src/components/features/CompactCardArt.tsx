"use client";

import type { CardDesign } from "@/lib/card-designs";
import { cn } from "@/lib/utils";

const VIBE_DECOR: Record<
  CardDesign["vibe"],
  { corners: string[]; pattern?: string }
> = {
  party: {
    corners: ["🎉", "✨", "🎈", "⭐"],
    pattern:
      "radial-gradient(circle at 20% 30%, rgba(255,107,138,0.35) 0 8px, transparent 9px), radial-gradient(circle at 80% 25%, rgba(255,209,102,0.4) 0 6px, transparent 7px), radial-gradient(circle at 70% 75%, rgba(107,203,255,0.35) 0 7px, transparent 8px)",
  },
  soft: {
    corners: ["💕", "✨", "☁️", "♡"],
    pattern:
      "radial-gradient(circle at 15% 20%, rgba(255,180,200,0.4) 0 40px, transparent 41px), radial-gradient(circle at 85% 80%, rgba(255,230,200,0.45) 0 50px, transparent 51px)",
  },
  garden: {
    corners: ["🌿", "🦋", "🌸", "🌼"],
    pattern:
      "linear-gradient(180deg, transparent 70%, rgba(163,184,117,0.25) 100%)",
  },
  night: {
    corners: ["✦", "🌙", "⭐", "✧"],
    pattern:
      "radial-gradient(circle at 25% 30%, rgba(255,233,168,0.35) 0 35px, transparent 36px)",
  },
  retro: {
    corners: ["✌️", "🌈", "🌻", "📼"],
    pattern:
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 10px, transparent 10px 20px)",
  },
};

/** Bold, readable card art for gallery thumbnails and small previews. */
export function CompactCardArt({
  design,
  className,
}: {
  design: CardDesign;
  className?: string;
}) {
  const decor = VIBE_DECOR[design.vibe];
  const night = design.vibe === "night";

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ background: design.pageBg }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{ backgroundImage: decor.pattern }}
      />

      {/* Postcard-style frame */}
      <div
        className="absolute inset-2 rounded-xl border-[3px] sm:inset-2.5"
        style={{ borderColor: design.border }}
      />
      <div
        className="absolute inset-3.5 rounded-lg border border-dashed sm:inset-4"
        style={{ borderColor: `${design.accent}88` }}
      />

      {/* Corner ornaments */}
      {(
        [
          ["left-3 top-3", decor.corners[0]],
          ["right-3 top-3", decor.corners[1]],
          ["bottom-3 left-3", decor.corners[2]],
          ["bottom-3 right-3", decor.corners[3]],
        ] as const
      ).map(([pos, glyph]) => (
        <span
          key={pos}
          className={cn("absolute text-lg opacity-80 sm:text-xl", pos)}
        >
          {glyph}
        </span>
      ))}

      {/* Hero — big and obvious */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span
          className="text-6xl leading-none drop-shadow-[0_4px_12px_rgba(61,47,34,0.25)] sm:text-7xl"
          role="img"
          aria-label={design.title}
        >
          {design.emoji}
        </span>
        <span
          className="mt-3 max-w-[90%] rounded-full px-3 py-1 text-[9px] font-semibold tracking-wide text-white shadow-sm sm:text-[10px]"
          style={{ backgroundColor: design.accent }}
        >
          {design.badge}
        </span>
      </div>

      {/* Top band for night cards */}
      {night ? (
        <div
          className="absolute inset-x-0 top-0 h-8 opacity-60"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35), transparent)",
          }}
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
        style={{
          background: night
            ? "linear-gradient(to top, rgba(26,34,56,0.85), transparent)"
            : `linear-gradient(to top, ${design.cardBg}, transparent)`,
        }}
      />
    </div>
  );
}
