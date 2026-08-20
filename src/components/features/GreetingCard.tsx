"use client";

import { motion } from "framer-motion";
import { getCardDesign, type CardDesignId } from "@/lib/card-designs";
import { cn } from "@/lib/utils";

type Props = {
  designId: CardDesignId;
  recipientName?: string;
  subject?: string;
  message?: string;
  senderName?: string;
  occasionLabel?: string;
  className?: string;
  /** Compact gallery thumbnail */
  compact?: boolean;
};

export function GreetingCard({
  designId,
  recipientName = "friend",
  subject = "A little card",
  message = "Your words will land here…",
  senderName = "you",
  occasionLabel,
  className,
  compact = false,
}: Props) {
  const design = getCardDesign(designId);
  const night = design.vibe === "night";

  return (
    <motion.div
      layout
      className={cn("relative w-full", className)}
      style={{ perspective: 900 }}
      animate={
        compact
          ? { rotate: [-1.2, 1.2, -1.2], y: [0, -3, 0] }
          : { rotate: 0, y: 0 }
      }
      transition={
        compact
          ? {
              rotate: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
            }
          : { type: "spring", stiffness: 220, damping: 20 }
      }
    >
      <motion.div
        whileHover={compact ? { y: -5, scale: 1.03 } : undefined}
        className={cn(
          "relative overflow-hidden rounded-2xl border-[3px] shadow-[5px_6px_0_rgba(61,47,34,0.16)]",
          compact ? "aspect-[4/5] p-2.5" : "min-h-[300px] p-5 sm:p-6"
        )}
        style={{
          background: design.pageBg,
          borderColor: design.border,
          color: design.ink,
        }}
      >
        {design.sparkles.map((spark, i) => (
          <motion.span
            key={`${spark}-${i}`}
            className="pointer-events-none absolute select-none"
            style={{
              left: `${10 + i * 30}%`,
              top: `${6 + (i % 3) * 14}%`,
              fontSize: compact ? 13 : 22,
              opacity: night ? 0.9 : 0.55,
            }}
            animate={{
              y: [0, design.vibe === "party" ? -12 : -7, 0],
              rotate: design.vibe === "party" ? [0, 12, -8, 0] : [0, 4, 0],
              opacity: [0.35, 0.95, 0.35],
            }}
            transition={{
              duration: 2.2 + i * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.18,
            }}
            aria-hidden
          >
            {spark}
          </motion.span>
        ))}

        <div
          className={cn(
            "relative flex h-full flex-col rounded-xl border-2",
            compact ? "p-2.5" : "p-4 sm:p-5"
          )}
          style={{
            backgroundColor: design.cardBg,
            borderColor: design.border,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className={cn(compact ? "text-lg" : "text-2xl")} aria-hidden>
              {design.emoji}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 font-pixel tracking-wide",
                compact ? "text-[6px]" : "text-[8px]"
              )}
              style={{
                borderColor: design.border,
                color: design.accent,
                background: night ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.55)",
              }}
            >
              {design.badge}
            </span>
          </div>

          {!compact && occasionLabel ? (
            <p
              className="mt-2 font-pixel text-[8px] uppercase tracking-widest"
              style={{ color: design.muted }}
            >
              {occasionLabel}
            </p>
          ) : null}

          <h3
            className={cn(
              "mt-2 font-display leading-snug",
              compact ? "line-clamp-2 text-xs" : "text-xl sm:text-2xl"
            )}
            style={{ color: design.accent }}
          >
            {compact ? design.title : subject}
          </h3>

          {!compact ? (
            <>
              <p
                className="mt-1 text-sm"
                style={{ color: design.muted }}
              >
                For {recipientName}
              </p>
              <p
                className="mt-3 flex-1 whitespace-pre-wrap text-sm leading-relaxed sm:text-base"
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
            </>
          ) : (
            <p
              className="mt-auto pt-2 text-[10px] leading-snug"
              style={{ color: design.muted }}
            >
              {design.blurb}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
