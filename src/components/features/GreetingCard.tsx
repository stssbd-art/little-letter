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
  /** Compact picker thumbnail */
  compact?: boolean;
};

export function GreetingCard({
  designId,
  recipientName = "friend",
  subject = "A little note",
  message = "Your words will land here…",
  senderName = "you",
  occasionLabel,
  className,
  compact = false,
}: Props) {
  const design = getCardDesign(designId);
  const dark = designId === "starlight";

  return (
    <motion.div
      layout
      initial={false}
      animate={{ rotate: compact ? [-1.5, 1.5, -1.5] : 0 }}
      transition={
        compact
          ? { rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
          : { type: "spring", stiffness: 220, damping: 20 }
      }
      className={cn("relative w-full", className)}
      style={{ perspective: 900 }}
    >
      <motion.div
        whileHover={compact ? { y: -4, scale: 1.02 } : undefined}
        className={cn(
          "relative overflow-hidden rounded-2xl border-[3px] shadow-[5px_6px_0_rgba(61,47,34,0.18)]",
          compact ? "aspect-[4/5] p-3" : "min-h-[280px] p-5 sm:p-6"
        )}
        style={{
          background: design.pageBg,
          borderColor: design.border,
          color: design.ink,
        }}
      >
        {/* Floating sparkles */}
        {design.sparkles.map((spark, i) => (
          <motion.span
            key={`${spark}-${i}`}
            className="pointer-events-none absolute select-none"
            style={{
              left: `${12 + i * 28}%`,
              top: `${8 + (i % 3) * 12}%`,
              fontSize: compact ? 14 : 22,
              opacity: dark ? 0.85 : 0.55,
            }}
            animate={{ y: [0, -8, 0], opacity: [0.35, 0.9, 0.35] }}
            transition={{
              duration: 2.4 + i * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            aria-hidden
          >
            {spark}
          </motion.span>
        ))}

        <div
          className={cn(
            "relative rounded-xl border-2",
            compact ? "h-full p-2.5" : "p-4 sm:p-5"
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
                backgroundColor: dark ? "rgba(255,246,223,0.08)" : "rgba(255,255,255,0.55)",
              }}
            >
              {design.badge}
            </span>
          </div>

          {!compact && occasionLabel ? (
            <p
              className="mt-3 font-pixel text-[8px] tracking-widest"
              style={{ color: design.accent }}
            >
              {occasionLabel.toUpperCase()} CARD
            </p>
          ) : null}

          <p
            className={cn(
              "mt-2 font-display leading-snug",
              compact ? "line-clamp-2 text-xs" : "text-lg sm:text-xl"
            )}
            style={{ color: design.ink }}
          >
            {compact ? design.label : `For ${recipientName}`}
          </p>

          {!compact ? (
            <>
              <p
                className="mt-1 font-pixel text-[9px]"
                style={{ color: design.muted }}
              >
                {subject}
              </p>
              <p
                className="mt-4 line-clamp-5 whitespace-pre-wrap font-display text-sm leading-relaxed sm:text-base"
                style={{ color: design.ink }}
              >
                {message}
              </p>
              <p
                className="mt-5 text-right font-display text-sm"
                style={{ color: design.accent }}
              >
                — {senderName}
              </p>
            </>
          ) : (
            <p
              className="mt-1 line-clamp-3 text-[10px] leading-snug"
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
