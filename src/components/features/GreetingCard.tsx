"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
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

function CardCover({
  design,
  compact,
}: {
  design: CardDesign;
  compact?: boolean;
}) {
  const night = design.vibe === "night";
  const clipId = useId().replace(/:/g, "");

  /* Gallery thumbs: photo of a physical card (PNG), not cartoon SVG */
  if (compact) {
    return (
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-[0.85rem] bg-[#f3ebe0]"
        style={{
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.65) inset, 0 14px 28px rgba(61,47,34,0.16), 0 2px 6px rgba(61,47,34,0.08)",
          border: "1px solid rgba(61,47,34,0.12)",
        }}
      >
        <Image
          src={`/ecards/${design.id}.png`}
          alt={`${design.title} greeting card`}
          fill
          sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 30vw"
          className="object-cover object-center"
          priority={design.id === "balloon-bash"}
        />
        {/* Soft paper edge so it reads as print stock */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.35), inset 0 0 28px rgba(61,47,34,0.08)",
          }}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[1.35rem] border-[3px]"
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
        className="relative flex h-[42%] flex-col items-center justify-center px-4 pb-4 pt-2 text-center"
        style={{ background: design.cardBg }}
      >
        {/* Ribbon */}
        <div className="relative mb-2 inline-flex min-h-[1.85rem] max-w-[95%] items-center justify-center px-4">
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
          <span className="relative z-[1] font-pixel text-[8px] tracking-wide text-white">
            {design.badge}
          </span>
        </div>

        <h3
          className="font-display text-2xl leading-tight sm:text-3xl"
          style={{ color: design.accent }}
        >
          {design.title}
        </h3>

        <p
          className="mt-1.5 max-w-[16rem] text-sm leading-snug"
          style={{ color: design.muted }}
        >
          {design.blurb}
        </p>
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

        <div className="mt-4 flex items-end justify-end gap-3">
          <p
            className="font-display text-sm"
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
