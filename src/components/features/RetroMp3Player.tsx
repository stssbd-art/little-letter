"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/components/providers/SoundProvider";
import { MIX_TRACKS } from "@/lib/tracks";
import { cn } from "@/lib/utils";

const TRACKS = MIX_TRACKS.slice(0, 5);

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function RetroMp3Player({ className }: { className?: string }) {
  const { play, muted } = useSound();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const track = TRACKS[index % TRACKS.length]!;

  useEffect(() => {
    const audio = new Audio(track.src);
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
      );
    };
    const onEnded = () => {
      setIndex((i) => (i + 1) % TRACKS.length);
    };
    const onLoaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audioRef.current = null;
    };
  }, [track.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
    if (playing && !muted) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, muted, index]);

  function selectTrack(next: number) {
    setIndex(next);
    setProgress(0);
    setCurrentTime(0);
    setPlaying(true);
  }

  return (
    <section
      className={cn(
        "mp3-shell overflow-hidden rounded-[22px] border-[3px] border-[#8a7a62] bg-gradient-to-b from-[#efe6d4] to-[#d8cdb6]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.65),6px_8px_0_rgba(61,47,34,0.18)]",
        "dark:from-[#2a2218] dark:to-[#1a1510] dark:border-[#5c4a34]",
        className
      )}
      aria-label="Retro MP3 player"
    >
      <div className="flex items-center justify-between border-b border-[#b9a888]/70 px-3 py-2 dark:border-[#5c4a34]">
        <p className="font-pixel text-[9px] tracking-wide text-[#5c4a34] dark:text-[#e6c98a]">
          LL-PLAYER 90s
        </p>
        <p className="font-pixel text-[8px] text-[#8a7a62]">
          {muted ? "MUTE" : playing ? "STEREO" : "READY"}
        </p>
      </div>

      <div className="p-3 sm:p-4">
        <div className="lcd-screen rounded-md border-2 border-[#3d2f22] bg-[#1a2e1a] px-3 py-3 text-[#8fef7a] shadow-[inset_0_0_18px_rgba(0,0,0,0.55)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-pixel text-[8px] opacity-80">NOW PLAYING · 90s MIX</p>
              <p className="mt-1 truncate font-pixel text-[10px] leading-relaxed">
                {track.title}.mp3
              </p>
              <p className="mt-1 truncate text-[11px] text-[#8fef7a]/80">
                {track.artist} · {track.year}
              </p>
            </div>
            <div className="flex h-8 items-end gap-[3px]" aria-hidden>
              {[0, 1, 2, 3, 4].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-[4px] rounded-sm bg-[#8fef7a]"
                  animate={
                    playing && !muted
                      ? { height: [6, 18 + bar * 2, 8, 22, 6] }
                      : { height: 6 }
                  }
                  transition={{
                    duration: 0.9 + bar * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-[#0d1a0d]">
              <div
                className="h-full rounded-full bg-[#8fef7a] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between font-pixel text-[7px] opacity-70">
              <span>{formatTime(currentTime)}</span>
              <span>
                TRACK {index + 1}/{TRACKS.length}
              </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <p className="mt-3 border-t border-[#8fef7a]/20 pt-2 font-pixel text-[7px] leading-relaxed text-[#8fef7a]/80">
            90s classics on the dial · demo audio stream (unmute site sound to hear)
          </p>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <ControlButton
            label="Previous track"
            onClick={() => {
              play("click");
              selectTrack((index - 1 + TRACKS.length) % TRACKS.length);
            }}
          >
            ⏮
          </ControlButton>
          <ControlButton
            label={playing ? "Pause" : "Play"}
            primary
            onClick={() => {
              play("click");
              setPlaying((v) => !v);
            }}
          >
            {playing ? "⏸" : "▶️"}
          </ControlButton>
          <ControlButton
            label="Next track"
            onClick={() => {
              play("click");
              selectTrack((index + 1) % TRACKS.length);
            }}
          >
            ⏭
          </ControlButton>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1">
          {TRACKS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                play("click");
                selectTrack(i);
              }}
              className={cn(
                "rounded-sm border px-1 py-1.5 font-pixel text-[7px] leading-none",
                i === index
                  ? "border-[#8b5e34] bg-[#fff6df] text-[#8b5e34]"
                  : "border-[#b9a888]/80 bg-[#ebe1cd]/80 text-[#6b5a44] dark:bg-[#2a2218] dark:text-[#cbb892]"
              )}
              aria-label={`Play ${t.title}`}
              title={`${t.title} — ${t.artist}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <ul className="mt-3 max-h-28 space-y-1 overflow-y-auto rounded-md border border-[#b9a888]/70 bg-[#ebe1cd]/50 p-2 text-left dark:border-[#5c4a34] dark:bg-[#2a2218]/60">
          {TRACKS.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => {
                  play("click");
                  selectTrack(i);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded px-1.5 py-1 text-left",
                  i === index
                    ? "bg-[#fff6df] text-[#8b5e34]"
                    : "text-[#5c4a34] dark:text-[#e6c98a]"
                )}
              >
                <span className="font-pixel text-[8px] opacity-70">{i + 1}.</span>
                <span className="min-w-0 flex-1 truncate font-display text-xs">
                  {t.title}
                </span>
                <span className="truncate font-pixel text-[7px] opacity-60">
                  {t.artist}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ControlButton({
  children,
  onClick,
  label,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#8a7a62] bg-gradient-to-b from-[#f7f0e2] to-[#d2c4a8] text-sm",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_0_#8a7a62] active:translate-y-[1px] active:shadow-none",
        "dark:from-[#3a2f22] dark:to-[#241c14] dark:text-[#f5ecd9]",
        primary && "h-12 w-12 text-base"
      )}
    >
      {children}
    </button>
  );
}
