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
  `10px 14px 0 ${border}55, 0 28px 48px rgba(61,47,34,0.22), inset 0 1px 0 rgba(255,255,255,0.35)`;

function CardCover({
  design,
  compact,
}: {
  design: CardDesign;
  compact?: boolean;
}) {
  const night = design.vibe === "night";

  if (compact) {
    return (
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.35rem] border-[4px]"
        style={{
          borderColor: design.border,
          boxShadow: coverShadow(design.border),
          background: design.cardBg,
          color: design.ink,
        }}
        role="img"
        aria-label={`${design.title} greeting card — ${design.blurb}`}
      >
        <CardSceneArt
          designId={design.id}
          compact
          accent={design.accent}
          border={design.border}
        />
        <div
          className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-10 text-center"
          style={{
            background: night
              ? "linear-gradient(to top, rgba(26,34,56,0.92) 55%, transparent)"
              : `linear-gradient(to top, ${design.cardBg} 50%, transparent)`,
          }}
        >
          <p
            className="font-display text-sm font-bold leading-tight"
            style={{ color: night ? "#f7ecd4" : design.accent }}
          >
            {design.emoji} {design.title}
          </p>
          <p
            className="mt-0.5 line-clamp-1 text-[10px]"
            style={{ color: night ? "#cbb892" : design.muted }}
          >
            {design.blurb}
          </p>
        </div>
        <Shimmer night={night} />
      </div>
    );
  }

  const clipId = useId().replace(/:/g, "");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] border-[4px] h-full w-full"
      )}
      style={{
        borderColor: design.border,
        boxShadow: coverShadow(design.border),
        background: design.cardBg,
        color: design.ink,
      }}
      role="img"
      aria-label={`${design.title} greeting card cover — ${design.blurb}`}
    >
      <div className="relative h-[62%] w-full overflow-hidden">
        <CardSceneArt
          designId={design.id}
          accent={design.accent}
          border={design.border}
          gid={`${clipId}-cover`}
        />
        {/* Large emoji so the theme reads instantly */}
        <div
          className="pointer-events-none absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white/80 text-2xl shadow-sm sm:h-14 sm:w-14 sm:text-3xl"
          style={{ borderColor: design.border }}
          aria-hidden
        >
          {design.emoji}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
          style={{
            background: `linear-gradient(to top, ${design.cardBg}, transparent)`,
          }}
        />
        <Shimmer night={night} />
      </div>

      <div
        className={cn(
          "relative flex h-[38%] flex-col items-center justify-center px-5 text-center",
          "pb-6 pt-3"
        )}
        style={{ background: design.cardBg }}
      >
        <div
          className={cn(
            "relative mb-3 inline-flex max-w-[95%] items-center justify-center px-5",
            "min-h-[2.1rem]"
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
              "text-base"
            )}
          >
            {design.badge}
          </span>
        </div>

        <h3
          className={cn(
            "font-display font-bold leading-tight",
            "text-3xl sm:text-4xl"
          )}
          style={{ color: design.accent }}
        >
          {design.title}
        </h3>

        <p
          className={cn(
            "mt-2 max-w-[20rem] font-display leading-snug",
            "text-base sm:text-lg"
          )}
          style={{ color: design.muted }}
        >
          {design.blurb}
        </p>
      </div>

      <div
        className="pointer-events-none absolute inset-2.5 rounded-[1rem] border-2"
        style={{ borderColor: `${design.border}66` }}
        aria-hidden
      />
    </div>
  );
}

function CoverInside({ design }: { design: CardDesign }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[1.35rem] border-[4px] px-8 text-center"
      style={{
        borderColor: design.border,
        background: design.cardBg,
        boxShadow: `inset 12px 0 28px rgba(61,47,34,0.12)`,
      }}
    >
      <div
        className="h-px w-20"
        style={{ background: `${design.border}88` }}
        aria-hidden
      />
      <p
        className="mt-5 font-display text-base sm:text-lg"
        style={{ color: design.muted }}
      >
        for you
      </p>
      <div
        className="mt-5 h-px w-20"
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
  roomy,
}: {
  design: CardDesign;
  recipientName: string;
  message: string;
  senderName: string;
  /** Extra space when shown as an open bifold panel */
  roomy?: boolean;
}) {
  const gid = useId().replace(/:/g, "");

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.35rem] border-[4px]"
      style={{
        borderColor: design.border,
        boxShadow: coverShadow(design.border),
        background: design.pageBg,
      }}
    >
      <div
        className={cn(
          "m-3 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain rounded-2xl border-2 sm:m-5",
          roomy ? "p-6 sm:p-8" : "p-5 sm:p-6"
        )}
        style={{
          backgroundColor: design.cardBg,
          borderColor: design.border,
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 32px,
            ${design.border}14 32px,
            ${design.border}14 33px
          )`,
          backgroundPosition: "0 6rem",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 sm:h-14 sm:w-14"
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

        <p
          className={cn(
            "mt-5 shrink-0 font-display",
            roomy ? "text-lg sm:text-xl" : "text-base sm:text-lg"
          )}
          style={{ color: design.muted }}
        >
          For {recipientName}
        </p>

        <p
          className={cn(
            "mt-5 flex-1 whitespace-pre-wrap font-sans leading-relaxed",
            roomy
              ? "text-lg sm:text-xl sm:leading-8"
              : "text-base sm:text-lg sm:leading-8"
          )}
          style={{ color: design.ink }}
        >
          {message}
        </p>

        <div className="mt-8 flex shrink-0 items-end justify-end gap-3 pb-1">
          <p
            className={cn(
              "font-display font-semibold",
              roomy ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            )}
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
  message = "Your words will land here…",
  senderName = "you",
  className,
  compact = false,
  defaultOpen = false,
}: Props) {
  const design = getCardDesign(designId);
  const [open, setOpen] = useState(defaultOpen);
  const openRef = useRef(open);
  const lockUntil = useRef(0);

  openRef.current = open;

  function canAct() {
    return Date.now() >= lockUntil.current;
  }

  function armLock() {
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

  function onCardActivate() {
    if (!canAct()) return;
    if (openRef.current) closeCard();
    else openCard();
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
      <div className="mb-3 flex items-center justify-between gap-2 px-0.5">
        <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
          {open
            ? "Scroll to read · use Close card when done"
            : "Open the cover to read your card"}
        </p>
        <button
          type="button"
          className="min-h-11 rounded-md px-2 font-pixel text-[8px] text-[var(--ll-pink-deep)] underline decoration-dotted underline-offset-2"
          onClick={onCardActivate}
          aria-expanded={open}
        >
          {open ? "Close card" : "Open card"}
        </button>
      </div>

      {/* Open bifold — scrollable message, not a button */}
      {open ? (
        <motion.div
          initial={{ opacity: 0.85, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.33, 1, 0.32, 1] }}
          className="mx-auto hidden w-full max-w-5xl md:block"
          aria-label="Open e-card"
        >
          <div
            className="grid grid-cols-2 gap-0 overflow-hidden rounded-[1.5rem]"
            style={{
              boxShadow: `0 24px 60px rgba(61,47,34,0.18)`,
              minHeight: "min(70vh, 36rem)",
            }}
          >
            <div className="relative min-h-[28rem] border-r-0">
              <CardCover design={design} />
            </div>
            <div className="relative min-h-[28rem]">
              <CardInterior
                design={design}
                recipientName={recipientName}
                message={message}
                senderName={senderName}
                roomy
              />
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Closed cover, or mobile open with flip */}
      <div
        className={cn(
          "relative mx-auto w-full overflow-visible",
          open
            ? "max-w-[min(100%,26rem)] md:hidden"
            : "max-w-[min(100%,26rem)] sm:max-w-[30rem] md:max-w-[34rem]"
        )}
        style={{ perspective: 1600, perspectiveOrigin: "left center" }}
      >
        <div
          className={cn(
            "relative w-full [transform-style:preserve-3d]",
            open
              ? "aspect-[3/4] min-h-[28rem]"
              : "aspect-[5/7] min-h-[32rem] sm:min-h-[36rem]"
          )}
        >
          <div
            className={cn("absolute inset-0", open ? "z-20" : "z-0")}
            aria-hidden={!open}
          >
            <CardInterior
              design={design}
              recipientName={recipientName}
              message={message}
              senderName={senderName}
              roomy
            />
          </div>

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
            {!open ? (
              <button
                type="button"
                className="absolute inset-0 z-30 cursor-pointer border-0 bg-transparent p-0"
                aria-label="Open e-card"
                aria-expanded={false}
                onClick={openCard}
              />
            ) : null}
            <div
              className="absolute inset-0 [backface-visibility:hidden]"
              style={{ WebkitBackfaceVisibility: "hidden" }}
            >
              <CardCover design={design} />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-5 rounded-l-[1.35rem]"
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
