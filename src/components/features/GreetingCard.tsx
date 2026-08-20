"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { CardSceneArt } from "@/components/features/CardSceneArt";
import { getCardDesign, type CardDesign, type CardDesignId } from "@/lib/card-designs";
import { cn } from "@/lib/utils";

type Props = {
  designId: CardDesignId;
  recipientName?: string;
  subject?: string;
  message?: string;
  senderName?: string;
  occasionLabel?: string;
  className?: string;
  compact?: boolean;
  defaultOpen?: boolean;
  autoOpen?: boolean;
};

function Shimmer({ night }: { night?: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-[inherit]"
      initial={false}
    >
      <motion.div
        className="absolute -inset-y-8 w-1/3 skew-x-[-18deg]"
        style={{
          background: night
            ? "linear-gradient(90deg, transparent, rgba(255,233,168,0.18), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
        }}
        animate={{ x: ["-120%", "280%"] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.2 }}
      />
    </motion.div>
  );
}

function WaxSeal({ accent, border, compact }: { accent: string; border: string; compact?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute z-[3] flex items-center justify-center rounded-full border-2 shadow-md",
        compact ? "bottom-2 right-2 h-8 w-8" : "bottom-3 right-3 h-12 w-12"
      )}
      style={{
        background: `radial-gradient(circle at 35% 30%, ${accent}cc, ${accent})`,
        borderColor: border,
      }}
    >
      <span
        className={cn("font-pixel leading-none text-white/90", compact ? "text-[7px]" : "text-[9px]")}
      >
        LL
      </span>
    </div>
  );
}

function CardCover({
  design,
  compact,
}: {
  design: CardDesign;
  compact?: boolean;
}) {
  const night = design.vibe === "night";
  const clipId = useId().replace(/:/g, "");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] border-[3px]",
        compact ? "aspect-[3/4]" : "aspect-[3/4] w-full max-w-md mx-auto"
      )}
      style={{
        borderColor: design.border,
        boxShadow: `6px 8px 0 ${design.border}44, 0 18px 40px rgba(61,47,34,0.14)`,
        background: design.cardBg,
        color: design.ink,
      }}
    >
      {/* Scene art — top ~60% */}
      <div className="relative h-[58%] w-full overflow-hidden">
        <CardSceneArt
          designId={design.id}
          compact={compact}
          accent={design.accent}
          border={design.border}
          gid={`${clipId}-cover`}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
          style={{
            background: `linear-gradient(to top, ${design.cardBg}, transparent)`,
          }}
        />
        <Shimmer night={night} />
      </div>

      {/* Title plate */}
      <div
        className={cn(
          "relative flex h-[42%] flex-col items-center justify-center px-4 text-center",
          compact ? "pb-2 pt-1" : "pb-4 pt-2"
        )}
        style={{ background: design.cardBg }}
      >
        {/* Ribbon */}
        <div
          className={cn(
            "relative mb-2 inline-flex max-w-[95%] items-center justify-center px-4",
            compact ? "min-h-[1.4rem]" : "min-h-[1.85rem]"
          )}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 200 36"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id={`rib-${clipId}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={design.border} />
                <stop offset="50%" stopColor={design.accent} />
                <stop offset="100%" stopColor={design.border} />
              </linearGradient>
            </defs>
            <path
              d="M8 4 H192 L184 18 L192 32 H8 L16 18 Z"
              fill={`url(#rib-${clipId})`}
              opacity="0.92"
            />
          </svg>
          <span
            className={cn(
              "relative z-[1] font-pixel tracking-wide text-white",
              compact ? "text-[6px]" : "text-[8px]"
            )}
          >
            {design.badge}
          </span>
        </div>

        <h3
          className={cn(
            "font-display leading-tight",
            compact ? "line-clamp-2 text-base" : "text-2xl sm:text-3xl"
          )}
          style={{ color: night ? design.accent : design.accent }}
        >
          {design.title}
        </h3>

        <p
          className={cn(
            "mt-1.5 max-w-[16rem] leading-snug",
            compact ? "line-clamp-2 text-[10px]" : "text-sm"
          )}
          style={{ color: design.muted }}
        >
          {design.blurb}
        </p>

        {!compact ? (
          <p
            className="mt-3 font-pixel text-[7px] uppercase tracking-[0.18em]"
            style={{ color: design.border }}
          >
            little letter e-card
          </p>
        ) : null}

        <WaxSeal accent={design.accent} border={design.border} compact={compact} />
      </div>

      {/* Ornate outer frame hint */}
      <div
        className="pointer-events-none absolute inset-2 rounded-[1.05rem] border"
        style={{ borderColor: `${design.border}66` }}
        aria-hidden
      />
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
  const night = design.vibe === "night";
  const gid = useId().replace(/:/g, "");

  return (
    <div
      className="relative mx-auto flex aspect-[3/4] w-full max-w-md flex-col overflow-hidden rounded-[1.35rem] border-[3px]"
      style={{
        borderColor: design.border,
        boxShadow: `6px 8px 0 ${design.border}44`,
        background: design.pageBg,
      }}
    >
      <div
        className="m-3 flex flex-1 flex-col rounded-2xl border-2 p-4 sm:m-4 sm:p-5"
        style={{
          backgroundColor: design.cardBg,
          borderColor: design.border,
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 26px,
            ${design.border}18 26px,
            ${design.border}18 27px
          )`,
          backgroundPosition: "0 5rem",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border-2"
            style={{ borderColor: design.border }}
          >
            <div className="h-full w-full scale-150">
              <CardSceneArt
                designId={design.id}
                compact
                accent={design.accent}
                border={design.border}
                gid={`${gid}-in`}
              />
            </div>
          </div>
          <span
            className="rounded-full border px-2.5 py-0.5 font-pixel text-[8px]"
            style={{
              borderColor: design.border,
              color: design.accent,
              background: night ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.65)",
            }}
          >
            {design.badge}
          </span>
        </div>

        {occasionLabel ? (
          <p
            className="mt-3 font-pixel text-[8px] uppercase tracking-widest"
            style={{ color: design.muted }}
          >
            {occasionLabel}
          </p>
        ) : null}

        <h3
          className="mt-1 font-display text-xl leading-snug sm:text-2xl"
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

        <div className="mt-4 flex items-end justify-between gap-3">
          <WaxSeal accent={design.accent} border={design.border} compact />
          <p
            className="flex-1 text-right font-display text-sm"
            style={{ color: design.accent }}
          >
            — {senderName}
          </p>
        </div>
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
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (compact || defaultOpen || !autoOpen) return;
    const id = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(id);
  }, [compact, defaultOpen, autoOpen, designId]);

  if (compact) {
    return (
      <motion.div
        className={cn("relative w-full", className)}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div whileHover={{ y: -6, scale: 1.03 }} className="w-full">
          <CardCover design={design} compact />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="mb-2 flex items-center justify-between gap-2 px-0.5">
        <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
          {open ? "inside your e-card" : "tap to open e-card"}
        </p>
        <button
          type="button"
          className="font-pixel text-[8px] text-[var(--ll-pink-deep)] underline decoration-dotted underline-offset-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Show cover" : "Open card"}
        </button>
      </div>

      <div style={{ perspective: 1400 }} className="w-full">
        <motion.button
          type="button"
          aria-label={open ? "Close e-card" : "Open e-card"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative mx-auto block w-full max-w-md cursor-pointer border-0 bg-transparent p-0 text-left [transform-style:preserve-3d]"
          animate={{ rotateY: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 16 }}
        >
          <div
            className="w-full [backface-visibility:hidden]"
            style={{ WebkitBackfaceVisibility: "hidden" }}
          >
            <CardCover design={design} />
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
