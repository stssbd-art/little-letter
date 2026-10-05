"use client";

import { memo, type ReactNode, type Ref } from "react";
import { motion } from "framer-motion";
import type { MixTrack } from "@/lib/tracks";
import type { MixLook } from "@/lib/mixtape-link";
import { youtubeWatchUrl } from "@/lib/tracks";
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
  /** Show “Hear the full song on YouTube” under the video */
  showFullSongLink?: boolean;
  /** Extra controls (search, etc.) between the LCD and the video */
  children?: ReactNode;
  onPlay?: () => void;
  onStop?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  controlsDisabled?: boolean;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  look?: MixLook;
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
  showFullSongLink = false,
  children,
  onPlay,
  onStop,
  onPrev,
  onNext,
  controlsDisabled = false,
  prevDisabled = false,
  nextDisabled = false,
  look = "classic",
}: CassetteDeckProps) {
  const labelTitle = title.trim() || "Untitled Mix";
  const forLine = toName.trim() || "someone special";
  const fromLine = fromName.trim() || "a friend";
  const hasControls = Boolean(onPlay || onStop || onPrev || onNext);
  const showScreen = Boolean(screenRef);
  const current = nowPlaying ?? tracks[0] ?? null;
  const fullSongHref =
    showFullSongLink && current?.youtubeId
      ? youtubeWatchUrl(current.youtubeId)
      : null;
  const status = spinning
    ? "STEREO"
    : loading
      ? "LOAD"
      : showScreen
        ? "READY"
        : "STOP";
  const skin =
    look === "ghost"
      ? {
          shell:
            "border-[#c9b8e8] bg-gradient-to-b from-[#4a3870] via-[#2e2248] to-[#1c1430] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),6px_8px_0_rgba(40,20,70,0.35)]",
          kicker: "text-[#f4e8ff]",
          label: "SIDE A · GHOST MIX",
          play: "bg-[#e8d8ff]",
        }
      : look === "bats"
        ? {
            shell:
              "border-[#f0a040] bg-gradient-to-b from-[#1a1028] via-[#140c1c] to-[#0c0814] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),6px_8px_0_rgba(40,16,8,0.4)]",
            kicker: "text-[#ffb347]",
            label: "SIDE A · BAT MIX",
            play: "bg-[#f08a20]",
          }
        : look === "halloween"
          ? {
              shell:
                "border-[#e07a18] bg-gradient-to-b from-[#3a2158] via-[#241430] to-[#140c1c] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),6px_8px_0_rgba(90,40,10,0.35)]",
              kicker: "text-[#ffb347]",
              label: "SIDE A · PUMPKIN MIX",
              play: "bg-[#ffb347]",
            }
          : {
              shell:
                "border-[#2a2218] bg-gradient-to-b from-[#4a4036] via-[#322a22] to-[#241c16] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),6px_8px_0_rgba(61,47,34,0.22)]",
              kicker: "text-[#f6d58a]",
              label: "SIDE A · LITTLE LETTER MIX",
              play: "bg-[#f6d58a]",
            };

  return (
    <div
      className={cn(
        "mx-auto w-full",
        className ?? (showScreen ? "max-w-lg" : "max-w-md")
      )}
    >
      <section
        className={cn(
          "overflow-hidden rounded-[22px] border-[3px]",
          skin.shell
        )}
      >
        <div className="flex items-center justify-between border-b border-[#1a1510]/80 px-3 py-2">
          <p className={cn("font-pixel text-[9px] tracking-wide", skin.kicker)}>
            {skin.label}
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
              {fullSongHref ? (
                <p className="border-t border-[#1a1510] bg-[#0f0c09] px-3 py-2 text-center">
                  <a
                    href={fullSongHref}
                    target="_blank"
                    rel="noreferrer"
                    className="font-pixel text-[8px] text-[#cbb892] underline decoration-dotted underline-offset-2 hover:text-[#f6d58a]"
                  >
                    Hear the full song on YouTube
                  </a>
                </p>
              ) : null}
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
                playClass={skin.play}
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
  playClass = "bg-[#f6d58a]",
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  play?: boolean;
  playClass?: string;
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
        play ? cn("h-11 w-11 text-base", playClass) : "h-10 w-10 bg-[#d8cdb6] text-sm",
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
