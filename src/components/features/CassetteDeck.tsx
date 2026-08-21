"use client";

import { memo, type ReactNode, type Ref } from "react";
import { motion } from "framer-motion";
import type { MixTrack } from "@/lib/tracks";
import { cn } from "@/lib/utils";

type CassetteDeckProps = {
  title: string;
  fromName: string;
  toName: string;
  tracks: MixTrack[];
  spinning?: boolean;
  loading?: boolean;
  className?: string;
  nowPlaying?: MixTrack | null;
  /** Stable host for the YouTube iframe */
  screenRef?: Ref<HTMLDivElement>;
  /** Extra controls (search, etc.) between the LCD and the video */
  children?: ReactNode;
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
  loading = false,
  className,
  nowPlaying,
  screenRef,
  children,
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
  const showScreen = Boolean(screenRef);
  const current = nowPlaying ?? tracks[0] ?? null;
  const status = spinning
    ? "STEREO"
    : loading
      ? "LOAD"
      : showScreen
        ? "READY"
        : "STOP";

  return (
    <div
      className={cn(
        "mx-auto w-full",
        className ?? (showScreen ? "max-w-lg" : "max-w-md")
      )}
    >
      <section
        className={cn(
          "overflow-hidden rounded-[22px] border-[3px] border-[#2a2218]",
          "bg-gradient-to-b from-[#4a4036] via-[#322a22] to-[#241c16]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),6px_8px_0_rgba(61,47,34,0.22)]"
        )}
      >
        <div className="flex items-center justify-between border-b border-[#1a1510]/80 px-3 py-2">
          <p className="font-pixel text-[9px] tracking-wide text-[#f6d58a]">
            SIDE A · LITTLE LETTER MIX
          </p>
          <p className="font-pixel text-[8px] text-[#cbb892]">{status}</p>
        </div>

        <div className="space-y-3 p-3">
          <div className="rounded-md border-2 border-[#1a1510] bg-[#1a1510] px-3 py-3 text-[#f6d58a] shadow-[inset_0_0_18px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-pixel text-[8px] text-[#e8b86d]/80">
                  NOW PLAYING · {labelTitle}
                </p>
                <p className="mt-1 truncate font-pixel text-[10px] leading-relaxed text-[#fff0c2]">
                  {current?.title ?? "Pick a song"}
                </p>
                <p className="mt-1 truncate font-pixel text-[8px] text-[#cbb892]">
                  {current
                    ? `${current.artist}${current.year ? ` · ${current.year}` : ""}`
                    : `for ${forLine} · from ${fromLine}`}
                </p>
              </div>
              <motion.div
                animate={spinning ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  spinning
                    ? { repeat: Infinity, duration: 2.4, ease: "linear" }
                    : { duration: 0.2 }
                }
                className="mt-0.5 size-8 shrink-0 rounded-full border-2 border-[#f6d58a]/50 bg-[#0f0c09]"
              />
            </div>
            <p className="mt-3 border-t border-[#f6d58a]/20 pt-2 font-pixel text-[7px] leading-relaxed text-[#cbb892]">
              for {forLine} · from {fromLine}
              {tracks.length ? ` · ${tracks.length} track${tracks.length === 1 ? "" : "s"}` : ""}
            </p>
          </div>

          {children}

          {showScreen ? (
            <div className="overflow-hidden rounded-lg border-2 border-[#1a1510] bg-black">
              <div className="relative aspect-video min-h-[200px] w-full bg-black">
                <ScreenHost screenRef={screenRef} />
              </div>
            </div>
          ) : null}

          {hasControls ? (
            <div className="flex items-center justify-center gap-2">
              {onPrev ? (
                <DeckButton
                  label="Previous track"
                  disabled={controlsDisabled || prevDisabled}
                  onClick={onPrev}
                >
                  ⏮
                </DeckButton>
              ) : null}
              <DeckButton
                label="Play"
                disabled={controlsDisabled || spinning}
                onClick={onPlay}
                play
              >
                ▶
              </DeckButton>
              <DeckButton
                label="Stop"
                disabled={controlsDisabled || !spinning}
                onClick={onStop}
              >
                ■
              </DeckButton>
              {onNext ? (
                <DeckButton
                  label="Next track"
                  disabled={controlsDisabled || nextDisabled}
                  onClick={onNext}
                >
                  ⏭
                </DeckButton>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function DeckButton({
  label,
  disabled,
  onClick,
  play = false,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  play?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full border-2 border-[#1a1510] text-[#3d2f22]",
        play ? "h-11 w-11 bg-[#f6d58a] text-base" : "h-10 w-10 bg-[#d8cdb6] text-sm",
        "shadow-[0_3px_0_#1a1510] active:translate-y-[2px] active:shadow-none",
        "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
      )}
    >
      {children}
    </button>
  );
}

/** Isolated so cassette re-renders don’t wipe the YouTube iframe. */
const ScreenHost = memo(function ScreenHost({
  screenRef,
}: {
  screenRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={screenRef}
      className="absolute inset-0 h-full w-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full"
    />
  );
});
