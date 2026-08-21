"use client";

import { useId, useRef, useState } from "react";
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

const coverShadow = (border: string) =>
  `8px 10px 0 ${border}55, 0 22px 36px rgba(61,47,34,0.22), inset 0 1px 0 rgba(255,255,255,0.35)`;

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
        "relative overflow-hidden rounded-[1.25rem] border-[4px]",
        compact ? "aspect-[3/4]" : "h-full w-full"
      )}
      style={{
        borderColor: design.border,
        boxShadow: coverShadow(design.border),
        background: design.cardBg,
        color: design.ink,
      }}
    >
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

      <div
        className={cn(
          "relative flex h-[42%] flex-col items-center justify-center px-4 text-center",
          compact ? "pb-2 pt-1" : "pb-4 pt-2"
        )}
        style={{ background: design.cardBg }}
      >
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
              "relative z-[1] font-display font-semibold tracking-wide text-white",
              compact ? "text-xs" : "text-sm"
            )}
          >
            {design.badge}
          </span>
        </div>

        <h3
          className={cn(
            "font-display font-bold leading-tight",
            compact ? "line-clamp-2 text-xl" : "text-2xl sm:text-3xl"
          )}
          style={{ color: design.accent }}
        >
          {design.title}
        </h3>

        <p
          className={cn(
            "mt-1.5 max-w-[16rem] font-display leading-snug",
            compact ? "line-clamp-2 text-xs" : "text-sm sm:text-base"
          )}
          style={{ color: design.muted }}
        >
          {design.blurb}
        </p>
      </div>

      <div
        className="pointer-events-none absolute inset-2 rounded-[0.9rem] border-2"
        style={{ borderColor: `${design.border}66` }}
        aria-hidden
      />
    </div>
  );
}

function CoverInside({ design }: { design: CardDesign }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[1.25rem] border-[4px] px-6 text-center"
      style={{
        borderColor: design.border,
        background: design.cardBg,
        boxShadow: `inset 10px 0 22px rgba(61,47,34,0.12)`,
      }}
    >
      <div
        className="h-px w-16"
        style={{ background: `${design.border}88` }}
        aria-hidden
      />
      <p
        className="mt-4 font-display text-sm"
        style={{ color: design.muted }}
      >
        for you
      </p>
      <div
        className="mt-4 h-px w-16"
        style={{ background: `${design.border}88` }}
        aria-hidden
      />
    </div>
  );
}

function CardInterior({
  design,
  recipientName,
  message,
  senderName,
}: {
  design: CardDesign;
  recipientName: string;
  message: string;
  senderName: string;
}) {
  const gid = useId().replace(/:/g, "");

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.25rem] border-[4px]"
      style={{
        borderColor: design.border,
        boxShadow: coverShadow(design.border),
        background: design.pageBg,
      }}
    >
      <div
        className="m-3 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain rounded-2xl border-2 p-4 sm:m-4 sm:p-5"
        style={{
          backgroundColor: design.cardBg,
          borderColor: design.border,
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 28px,
            ${design.border}18 28px,
            ${design.border}18 29px
          )`,
          backgroundPosition: "0 5rem",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex shrink-0 items-start justify-between gap-2">
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
        </div>

        <p
          className="mt-4 shrink-0 font-display text-base"
          style={{ color: design.muted }}
        >
          For {recipientName}
        </p>

        <p
          className="mt-4 whitespace-pre-wrap font-sans text-base leading-relaxed sm:text-[1.05rem] sm:leading-7"
          style={{ color: design.ink }}
        >
          {message}
        </p>

        <div className="mt-5 flex shrink-0 items-end justify-end gap-3 pb-1">
          <p
            className="font-display text-lg font-semibold sm:text-xl"
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
}: Props) {
  const design = getCardDesign(designId);
  const [open, setOpen] = useState(defaultOpen);
  const openRef = useRef(open);
  const lockUntil = useRef(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  openRef.current = open;

  function canAct() {
    return Date.now() >= lockUntil.current;
  }

  function armLock() {
    // Block duplicate touch + click / double-fires for half a second
    lockUntil.current = Date.now() + 500;
  }

  function openCard() {
    if (!canAct() || openRef.current) return;
    armLock();
    setOpen(true);
  }

  function closeCard() {
    if (!canAct() || !openRef.current) return;
    armLock();
    setOpen(false);
  }

  /** One intentional tap opens or closes — never both in one gesture. */
  function onCardActivate() {
    if (!canAct()) return;
    if (openRef.current) closeCard();
    else openCard();
  }

  function onPointerDown(e: React.PointerEvent) {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp(e: React.PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const moved =
      Math.abs(e.clientX - start.x) > 12 || Math.abs(e.clientY - start.y) > 12;
    if (moved) return; // scroll / drag — don't toggle
    e.preventDefault();
    onCardActivate();
  }

  if (compact) {
    return (
      <motion.div
        className={cn("relative w-full", className)}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="w-full">
          <CardCover design={design} compact />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="mb-2 flex items-center justify-between gap-2 px-0.5">
        <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
          {open
            ? "scroll to read · tap again to close"
            : "tap the cover to open"}
        </p>
        <button
          type="button"
          className="font-pixel text-[8px] text-[var(--ll-pink-deep)] underline decoration-dotted underline-offset-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCardActivate();
          }}
        >
          {open ? "Close card" : "Open card"}
        </button>
      </div>

      <div
        className={cn(
          "relative mx-auto w-full max-w-md overflow-visible transition-[padding] duration-500",
          open ? "pl-[16%] sm:pl-[40%]" : "pl-0"
        )}
        style={{ perspective: 1400, perspectiveOrigin: "left center" }}
      >
        <div
          className="relative aspect-[3/4] w-full touch-manipulation [transform-style:preserve-3d]"
          role="button"
          tabIndex={0}
          aria-label={open ? "Close e-card" : "Open e-card"}
          aria-expanded={open}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onCardActivate();
            }
          }}
        >
          {/* Message page — on top when open so it can scroll */}
          <div
            className={cn(
              "absolute inset-0",
              open ? "z-20" : "z-0"
            )}
          >
            <CardInterior
              design={design}
              recipientName={recipientName}
              message={message}
              senderName={senderName}
            />
          </div>

          {/* Cover — on top when closed; swings open and yields pointer to message */}
          <motion.div
            className={cn(
              "absolute inset-0 [transform-style:preserve-3d]",
              open ? "pointer-events-none z-10" : "z-20"
            )}
            style={{ transformOrigin: "left center" }}
            animate={{ rotateY: open ? -158 : 0 }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.32, 1] }}
            aria-hidden={open}
          >
            <div
              className="absolute inset-0 [backface-visibility:hidden]"
              style={{ WebkitBackfaceVisibility: "hidden" }}
            >
              <CardCover design={design} />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-4 rounded-l-[1.25rem]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(61,47,34,0.22), transparent)",
                }}
                aria-hidden
              />
            </div>
            <div
              className="absolute inset-0 [backface-visibility:hidden]"
              style={{
                transform: "rotateY(180deg)",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <CoverInside design={design} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
