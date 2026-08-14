"use client";

import { motion } from "framer-motion";
import type { MixTrack } from "@/lib/tracks";
import { cn } from "@/lib/utils";

type CassetteDeckProps = {
  title: string;
  fromName: string;
  toName: string;
  tracks: MixTrack[];
  spinning?: boolean;
  className?: string;
  /** When set, shows working Play / Stop / Prev / Next controls on the deck */
  onPlay?: () => void;
  onStop?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  controlsDisabled?: boolean;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
};

export function CassetteDeck({
  title,
  fromName,
  toName,
  tracks,
  spinning = false,
  className,
  onPlay,
  onStop,
  onPrev,
  onNext,
  controlsDisabled = false,
  prevDisabled = false,
  nextDisabled = false,
}: CassetteDeckProps) {
  const labelTitle = title.trim() || "Untitled Mix";
  const forLine = toName.trim() || "someone special";
  const fromLine = fromName.trim() || "a friend";
  const hasControls = Boolean(onPlay || onStop || onPrev || onNext);

  return (
    <div className={cn("mx-auto w-full max-w-md", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[18px] border-[3px] border-[#2a2218]",
          "bg-gradient-to-b from-[#4a4036] via-[#322a22] to-[#241c16]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),10px_12px_0_rgba(61,47,34,0.22)]"
        )}
      >
        {/* Screws */}
        {[
          "left-3 top-3",
          "right-3 top-3",
          "bottom-3 left-3",
          "bottom-3 right-3",
        ].map((pos) => (
          <span
            key={pos}
            className={cn(
              "absolute h-2.5 w-2.5 rounded-full bg-[#1a1510] shadow-[inset_0_1px_0_#6b5a44]",
              pos
            )}
          />
        ))}

        {/* Label sticker */}
        <div className="m-4 mb-3 rounded-md border-2 border-[#8b5e34]/80 bg-gradient-to-br from-[#f7ecd4] via-[#f0d9a0] to-[#e4c078] px-3 py-2.5 shadow-inner">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-pixel text-[7px] tracking-widest text-[#8b5e34]/80">
                SIDE A · LITTLE LETTER MIX
              </p>
              <p className="mt-1 truncate font-display text-lg font-semibold text-[#3d2f22]">
                {labelTitle}
              </p>
              <p className="mt-0.5 font-pixel text-[8px] text-[#6b4f36]">
                for {forLine} · from {fromLine}
              </p>
            </div>
            <span className="shrink-0 rounded-sm border border-[#8b5e34]/50 bg-[#fff6df] px-1.5 py-1 font-pixel text-[7px] text-[#8b5e34]">
              ♡
            </span>
          </div>
          <div className="mt-2 space-y-0.5 border-t border-dashed border-[#8b5e34]/35 pt-2">
            {(tracks.length
              ? tracks
              : [{ id: "empty", title: "— pick tracks —", artist: "", year: "" }]
            )
              .slice(0, 4)
              .map((t, i) => (
                <p
                  key={t.id}
                  className="truncate font-pixel text-[7px] leading-relaxed text-[#5c4a34]"
                >
                  {i + 1}. {t.title}
                  {t.artist ? ` · ${t.artist}` : ""}
                </p>
              ))}
            {tracks.length > 4 ? (
              <p className="font-pixel text-[7px] text-[#8b5e34]/70">
                +{tracks.length - 4} more on the B-side…
              </p>
            ) : null}
          </div>
        </div>

        {/* Reel window */}
        <div className="mx-4 mb-3 flex items-center justify-between gap-3 rounded-lg border-2 border-[#1a1510] bg-[#0f0c09] px-4 py-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.65)]">
          <Reel spinning={spinning} />
          <div className="flex flex-1 flex-col items-center gap-1">
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#2a2218] via-[#6b5a44] to-[#2a2218]" />
            <p className="font-pixel text-[6px] tracking-widest text-[#8a7a62]">
              {spinning ? "▶ PLAYING" : "■ STOP"}
            </p>
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#2a2218] via-[#6b5a44] to-[#2a2218]" />
          </div>
          <Reel spinning={spinning} />
        </div>

        {hasControls ? (
          <div className="mx-4 mb-4 flex items-center justify-center gap-2">
            {onPrev ? (
              <button
                type="button"
                aria-label="Previous track"
                disabled={controlsDisabled || prevDisabled}
                onClick={onPrev}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1a1510] bg-gradient-to-b from-[#d8cdb6] to-[#b9a888] text-base text-[#3d2f22]",
                  "shadow-[0_3px_0_#1a1510] active:translate-y-[2px] active:shadow-none",
                  "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
                )}
              >
                ⏮
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Play"
              disabled={controlsDisabled || spinning}
              onClick={onPlay}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1a1510] bg-gradient-to-b from-[#f6d58a] to-[#e0b45a] text-base text-[#3d2f22]",
                "shadow-[0_3px_0_#1a1510] active:translate-y-[2px] active:shadow-none",
                "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
              )}
            >
              ▶
            </button>
            <button
              type="button"
              aria-label="Stop"
              disabled={controlsDisabled || !spinning}
              onClick={onStop}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1a1510] bg-gradient-to-b from-[#d8cdb6] to-[#b9a888] text-base text-[#3d2f22]",
                "shadow-[0_3px_0_#1a1510] active:translate-y-[2px] active:shadow-none",
                "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
              )}
            >
              ■
            </button>
            {onNext ? (
              <button
                type="button"
                aria-label="Next track"
                disabled={controlsDisabled || nextDisabled}
                onClick={onNext}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1a1510] bg-gradient-to-b from-[#d8cdb6] to-[#b9a888] text-base text-[#3d2f22]",
                  "shadow-[0_3px_0_#1a1510] active:translate-y-[2px] active:shadow-none",
                  "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
                )}
              >
                ⏭
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex justify-center gap-1 pb-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-[2px] bg-[#1a1510]/80"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Reel({ spinning }: { spinning: boolean }) {
  return (
    <motion.div
      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#5c4a34] bg-gradient-to-br from-[#3d3228] to-[#1a1510]"
      animate={spinning ? { rotate: 360 } : { rotate: 0 }}
      transition={
        spinning
          ? { duration: 2.4, repeat: Infinity, ease: "linear" }
          : { duration: 0.4 }
      }
    >
      <div className="absolute inset-2 rounded-full border border-[#6b5a44]/50" />
      {/* Three diameters through the hub = six even spokes */}
      {[0, 60, 120].map((deg) => (
        <span
          key={deg}
          className="absolute left-1/2 top-1/2 h-[2px] w-10 bg-[#8a7a62]/85"
          style={{
            transform: `translate(-50%, -50%) rotate(${deg}deg)`,
          }}
        />
      ))}
      <span className="absolute left-1/2 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0f0c09] ring-2 ring-[#8a7a62]" />
    </motion.div>
  );
}
