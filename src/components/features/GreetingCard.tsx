"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getCardDesign,
  type CardDesign,
  type CardDesignId,
} from "@/lib/card-designs";
import { cn } from "@/lib/utils";

type Props = {
  designId: CardDesignId;
  recipientName?: string;
  subject?: string;
  message?: string;
  senderName?: string;
  occasionLabel?: string;
  className?: string;
  /** Compact gallery thumbnail — cover only */
  compact?: boolean;
  /** Start open (preview after envelope). Default: closed with auto-open. */
  defaultOpen?: boolean;
  /** Auto-flip open once after mount (compose). Default true when not compact. */
  autoOpen?: boolean;
};

const CONFETTI_COLORS = [
  "#ff6b8a",
  "#ffd166",
  "#6bcBff",
  "#9b7bff",
  "#7ed957",
  "#ff9f68",
];

function paperGrain(opacity = 0.35) {
  return {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")`,
    opacity,
  } as const;
}

function CornerOrnaments({
  color,
  compact,
}: {
  color: string;
  compact?: boolean;
}) {
  const size = compact ? 10 : 16;
  const arm = compact ? 6 : 10;
  return (
    <>
      {(
        [
          ["top-2 left-2", 0],
          ["top-2 right-2", 90],
          ["bottom-2 left-2", -90],
          ["bottom-2 right-2", 180],
        ] as const
      ).map(([pos, rot]) => (
        <span
          key={pos}
          aria-hidden
          className={cn("pointer-events-none absolute", pos)}
          style={{
            width: size,
            height: size,
            borderTop: `2px solid ${color}`,
            borderLeft: `2px solid ${color}`,
            transform: `rotate(${rot}deg)`,
            opacity: 0.55,
          }}
        >
          <span
            className="absolute"
            style={{
              width: arm,
              height: 2,
              background: color,
              top: -2,
              left: -2,
              opacity: 0.7,
            }}
          />
        </span>
      ))}
    </>
  );
}

function PixelCorners({ color, compact }: { color: string; compact?: boolean }) {
  const s = compact ? 4 : 6;
  return (
    <>
      {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map(
        (pos) => (
          <span
            key={pos}
            aria-hidden
            className={cn("pointer-events-none absolute", pos)}
            style={{
              width: s,
              height: s,
              background: color,
              boxShadow: `2px 0 0 ${color}, 0 2px 0 ${color}`,
              opacity: 0.7,
            }}
          />
        )
      )}
    </>
  );
}

function VibeDecor({
  design,
  compact,
}: {
  design: CardDesign;
  compact?: boolean;
}) {
  const vibe = design.vibe;
  const night = vibe === "night";

  if (vibe === "party") {
    return (
      <>
        {CONFETTI_COLORS.map((c, i) => (
          <motion.span
            key={`dot-${i}`}
            aria-hidden
            className="pointer-events-none absolute rounded-sm"
            style={{
              width: compact ? 4 : 6,
              height: compact ? 4 : 6,
              background: c,
              left: `${8 + ((i * 17) % 84)}%`,
              top: `${12 + ((i * 23) % 70)}%`,
              opacity: 0.75,
            }}
            animate={{
              y: [0, -10 - (i % 4) * 4, 0],
              rotate: [0, 40 + i * 8, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.8 + (i % 5) * 0.25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12,
            }}
          />
        ))}
        {design.sparkles.map((spark, i) => (
          <motion.span
            key={`spark-${spark}-${i}`}
            aria-hidden
            className="pointer-events-none absolute select-none"
            style={{
              left: `${12 + i * 28}%`,
              top: `${8 + (i % 2) * 18}%`,
              fontSize: compact ? 14 : 22,
            }}
            animate={{
              y: [0, -14, 0],
              rotate: [0, 14, -10, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          >
            {spark}
          </motion.span>
        ))}
      </>
    );
  }

  if (vibe === "soft") {
    return (
      <>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={`heart-${i}`}
            aria-hidden
            className="pointer-events-none absolute select-none"
            style={{
              left: `${10 + i * 18}%`,
              bottom: `${6 + (i % 3) * 10}%`,
              fontSize: compact ? 10 : 16,
              color: design.accent,
              opacity: 0.45,
            }}
            animate={{
              y: [0, -18 - i * 3, 0],
              opacity: [0.25, 0.7, 0.25],
              scale: [0.85, 1.1, 0.85],
            }}
            transition={{
              duration: 3.2 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.35,
            }}
          >
            {i % 2 === 0 ? "♥" : "♡"}
          </motion.span>
        ))}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-6 rounded-full"
          style={{
            background: `radial-gradient(circle, ${design.accent}22 0%, transparent 70%)`,
          }}
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {design.sparkles.slice(0, 2).map((spark, i) => (
          <motion.span
            key={`soft-spark-${i}`}
            aria-hidden
            className="pointer-events-none absolute select-none"
            style={{
              right: `${8 + i * 14}%`,
              top: `${10 + i * 12}%`,
              fontSize: compact ? 12 : 18,
            }}
            animate={{ y: [0, -8, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{
              duration: 2.8 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {spark}
          </motion.span>
        ))}
      </>
    );
  }

  if (vibe === "garden") {
    return (
      <>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={`petal-${i}`}
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              width: compact ? 8 : 12,
              height: compact ? 5 : 8,
              borderRadius: "60% 40% 60% 40%",
              background: i % 2 === 0 ? design.accent : design.border,
              left: `${6 + ((i * 15) % 88)}%`,
              top: `${-4 + (i % 4) * 8}%`,
              opacity: 0.55,
            }}
            animate={{
              y: ["0%", "110%"],
              x: [0, (i % 2 === 0 ? 12 : -14), 4],
              rotate: [0, 120 + i * 20],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 4.5 + i * 0.55,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.55,
            }}
          />
        ))}
        {design.sparkles.map((spark, i) => (
          <motion.span
            key={`garden-${i}`}
            aria-hidden
            className="pointer-events-none absolute select-none"
            style={{
              left: `${14 + i * 30}%`,
              bottom: `${8 + (i % 2) * 10}%`,
              fontSize: compact ? 12 : 18,
            }}
            animate={{ y: [0, -6, 0], rotate: [-6, 6, -6] }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {spark}
          </motion.span>
        ))}
      </>
    );
  }

  if (vibe === "night") {
    return (
      <>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.span
            key={`star-${i}`}
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              width: compact ? 2 : 3,
              height: compact ? 2 : 3,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#ffe9a8" : "#fff",
              left: `${10 + ((i * 11) % 80)}%`,
              top: `${8 + ((i * 13) % 55)}%`,
              boxShadow: night ? "0 0 6px #ffe9a8" : undefined,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
            transition={{
              duration: 1.6 + (i % 4) * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.18,
            }}
          />
        ))}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute select-none"
          style={{
            right: compact ? "10%" : "12%",
            top: compact ? "10%" : "12%",
            fontSize: compact ? 18 : 28,
            filter: "drop-shadow(0 0 8px rgba(255,233,168,0.45))",
          }}
          animate={{ y: [0, -4, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {design.emoji === "🌙" ? "🌙" : design.sparkles[1] ?? "🌙"}
        </motion.span>
        {design.sparkles
          .filter((s) => s !== "🌙")
          .slice(0, 2)
          .map((spark, i) => (
            <motion.span
              key={`night-spark-${i}`}
              aria-hidden
              className="pointer-events-none absolute select-none"
              style={{
                left: `${16 + i * 40}%`,
                top: `${20 + i * 8}%`,
                fontSize: compact ? 11 : 16,
                opacity: 0.85,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2.2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {spark}
            </motion.span>
          ))}
      </>
    );
  }

  // retro
  return (
    <>
      <PixelCorners color={design.accent} compact={compact} />
      {[0, 1, 2].map((i) => (
        <motion.span
          key={`retro-${i}`}
          aria-hidden
          className="pointer-events-none absolute select-none"
          style={{
            left: `${14 + i * 32}%`,
            top: `${10 + (i % 2) * 14}%`,
            fontSize: compact ? 12 : 18,
          }}
          animate={{ y: [0, -5, 0], rotate: [0, i % 2 === 0 ? 6 : -6, 0] }}
          transition={{
            duration: 3.4 + i * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.25,
          }}
        >
          {design.sparkles[i] ?? "✦"}
        </motion.span>
      ))}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 bottom-3 h-1.5 rounded-sm opacity-40"
        style={{
          background: `repeating-linear-gradient(90deg, ${design.border} 0 4px, transparent 4px 8px)`,
        }}
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function CardCover({
  design,
  compact,
  night,
}: {
  design: CardDesign;
  compact?: boolean;
  night: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border-[3px] shadow-[5px_6px_0_rgba(61,47,34,0.16)]",
        compact ? "aspect-[4/5] p-2.5" : "min-h-[320px] p-4 sm:p-5"
      )}
      style={{
        background: design.pageBg,
        borderColor: design.border,
        color: night ? "#f5ecd8" : design.ink,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={paperGrain(night ? 0.2 : 0.4)}
        aria-hidden
      />
      <VibeDecor design={design} compact={compact} />

      <div
        className={cn(
          "relative z-[1] flex h-full flex-col items-center justify-center rounded-xl border-2 text-center",
          compact ? "p-2.5" : "p-5 sm:p-6"
        )}
        style={{
          backgroundColor: night
            ? "rgba(247,236,212,0.92)"
            : design.cardBg,
          borderColor: design.border,
          color: design.ink,
          boxShadow: night
            ? "inset 0 0 40px rgba(255,233,168,0.12)"
            : `inset 0 0 0 1px ${design.border}33`,
        }}
      >
        {design.vibe === "retro" ? (
          <PixelCorners color={design.border} compact={compact} />
        ) : (
          <CornerOrnaments color={design.accent} compact={compact} />
        )}

        <motion.span
          className={cn(
            "select-none drop-shadow-sm",
            compact ? "text-4xl" : "text-6xl sm:text-7xl"
          )}
          aria-hidden
          animate={
            design.vibe === "party"
              ? { y: [0, -8, 0], rotate: [-4, 4, -4], scale: [1, 1.06, 1] }
              : design.vibe === "soft"
                ? { scale: [1, 1.05, 1] }
                : { y: [0, -4, 0] }
          }
          transition={{
            duration: design.vibe === "party" ? 2.2 : 3.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {design.emoji}
        </motion.span>

        <span
          className={cn(
            "mt-3 rounded-full border px-2.5 py-0.5 font-pixel tracking-wide",
            compact ? "text-[6px]" : "text-[8px]"
          )}
          style={{
            borderColor: design.border,
            color: design.accent,
            background: "rgba(255,255,255,0.55)",
          }}
        >
          {design.badge}
        </span>

        <h3
          className={cn(
            "mt-3 font-display leading-snug",
            compact ? "line-clamp-2 text-sm" : "text-2xl sm:text-3xl"
          )}
          style={{ color: design.accent }}
        >
          {design.title}
        </h3>

        {compact ? (
          <p
            className="mt-auto pt-2 text-[10px] leading-snug"
            style={{ color: design.muted }}
          >
            {design.blurb}
          </p>
        ) : (
          <p
            className="mt-2 max-w-[16rem] text-sm"
            style={{ color: design.muted }}
          >
            {design.blurb}
          </p>
        )}
      </div>
    </div>
  );
}

function CardInterior({
  design,
  recipientName,
  subject,
  message,
  senderName,
  occasionLabel,
}: {
  design: CardDesign;
  recipientName: string;
  subject: string;
  message: string;
  senderName: string;
  occasionLabel?: string;
}) {
  return (
    <div
      className="relative flex h-full min-h-[320px] w-full flex-col overflow-hidden rounded-2xl border-[3px] p-4 shadow-[5px_6px_0_rgba(61,47,34,0.16)] sm:p-5"
      style={{
        background: design.pageBg,
        borderColor: design.border,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={paperGrain(0.3)}
        aria-hidden
      />

      <div
        className="relative z-[1] flex flex-1 flex-col rounded-xl border-2 p-4 sm:p-5"
        style={{
          backgroundColor: design.cardBg,
          borderColor: design.border,
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 27px,
            ${design.border}22 27px,
            ${design.border}22 28px
          )`,
          backgroundPosition: "0 4.5rem",
        }}
      >
        <CornerOrnaments color={design.accent} />

        <div className="flex items-center justify-between gap-2">
          <span className="text-2xl" aria-hidden>
            {design.emoji}
          </span>
          <span
            className="rounded-full border px-2 py-0.5 font-pixel text-[8px] tracking-wide"
            style={{
              borderColor: design.border,
              color: design.accent,
              background: "rgba(255,255,255,0.55)",
            }}
          >
            {design.badge}
          </span>
        </div>

        {occasionLabel ? (
          <p
            className="mt-2 font-pixel text-[8px] uppercase tracking-widest"
            style={{ color: design.muted }}
          >
            {occasionLabel}
          </p>
        ) : null}

        <h3
          className="mt-2 font-display text-xl leading-snug sm:text-2xl"
          style={{ color: design.accent }}
        >
          {subject}
        </h3>

        <p className="mt-1 text-sm" style={{ color: design.muted }}>
          For {recipientName}
        </p>

        <p
          className="mt-4 flex-1 whitespace-pre-wrap text-sm leading-relaxed sm:text-base"
          style={{ color: design.ink }}
        >
          {message}
        </p>

        <p
          className="mt-4 text-right font-display text-sm"
          style={{ color: design.accent }}
        >
          — {senderName}
        </p>
      </div>
    </div>
  );
}

export function GreetingCard({
  designId,
  recipientName = "friend",
  subject = "A little card",
  message = "Your words will land here…",
  senderName = "you",
  occasionLabel,
  className,
  compact = false,
  defaultOpen = false,
  autoOpen = true,
}: Props) {
  const design = getCardDesign(designId);
  const night = design.vibe === "night";
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (compact || defaultOpen || !autoOpen) return;
    const id = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(id);
  }, [compact, defaultOpen, autoOpen, designId]);

  if (compact) {
    return (
      <motion.div
        layout
        className={cn("relative w-full", className)}
        animate={{ rotate: [-1.4, 1.4, -1.4], y: [0, -4, 0] }}
        transition={{
          rotate: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.div whileHover={{ y: -6, scale: 1.035 }} className="w-full">
          <CardCover design={design} compact night={night} />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="mb-2 flex items-center justify-between gap-2 px-0.5">
        <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
          {open ? "inside the card" : "tap card to open"}
        </p>
        <button
          type="button"
          className="font-pixel text-[8px] text-[var(--ll-pink-deep)] underline decoration-dotted underline-offset-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close cover" : "Open card"}
        </button>
      </div>

      <div style={{ perspective: 1200 }} className="w-full">
        <motion.button
          type="button"
          aria-label={open ? "Close greeting card" : "Open greeting card"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative block w-full cursor-pointer border-0 bg-transparent p-0 text-left [transform-style:preserve-3d]"
          animate={{ rotateY: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div
            className="w-full [backface-visibility:hidden]"
            style={{ WebkitBackfaceVisibility: "hidden" }}
          >
            <CardCover design={design} night={night} />
          </div>

          <div
            className="absolute inset-0 w-full [backface-visibility:hidden]"
            style={{
              transform: "rotateY(180deg)",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <CardInterior
              design={design}
              recipientName={recipientName}
              subject={subject}
              message={message}
              senderName={senderName}
              occasionLabel={occasionLabel}
            />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
