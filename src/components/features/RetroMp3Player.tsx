"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/components/providers/SoundProvider";
import { DAILY_QUOTES } from "@/lib/quotes";
import { cn } from "@/lib/utils";

const TRACKS = [
  { title: "inbox_lullaby.mp3", artist: "Little Letter FM" },
  { title: "pixel_post.wav", artist: "Dial-Up Dreams" },
  { title: "warm_reply.mp3", artist: "Cosy Bytes" },
  { title: "stationery_shuffle.mp3", artist: "Winamp Memories" },
  { title: "hello_again.mid", artist: "Pip the Envelope" },
];

export function RetroMp3Player({ className }: { className?: string }) {
  const { play, muted } = useSound();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(18);
  const quote = DAILY_QUOTES[Math.floor(Date.now() / 86_400_000) % DAILY_QUOTES.length]!;
  const track = TRACKS[index % TRACKS.length]!;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIndex((i) => (i + 1) % TRACKS.length);
          return 0;
        }
        return p + 1;
      });
    }, 400);
    return () => window.clearInterval(id);
  }, [playing]);

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
          LL-PLAYER 2003
        </p>
        <p className="font-pixel text-[8px] text-[#8a7a62]">
          {muted ? "MUTE" : "STEREO"}
        </p>
      </div>

      <div className="p-3 sm:p-4">
        <div className="lcd-screen rounded-md border-2 border-[#3d2f22] bg-[#1a2e1a] px-3 py-3 text-[#8fef7a] shadow-[inset_0_0_18px_rgba(0,0,0,0.55)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-pixel text-[8px] opacity-80">NOW PLAYING</p>
              <p className="mt-1 truncate font-pixel text-[10px] leading-relaxed">
                {track.title}
              </p>
              <p className="mt-1 truncate text-[11px] text-[#8fef7a]/80">
                {track.artist}
              </p>
            </div>
            <div className="flex h-8 items-end gap-[3px]" aria-hidden>
              {[0, 1, 2, 3, 4].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-[4px] rounded-sm bg-[#8fef7a]"
                  animate={
                    playing
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
                className="h-full rounded-full bg-[#8fef7a]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between font-pixel text-[7px] opacity-70">
              <span>0:{String(Math.floor(progress / 4)).padStart(2, "0")}</span>
              <span>TRACK {index + 1}/{TRACKS.length}</span>
            </div>
          </div>

          <p className="mt-3 border-t border-[#8fef7a]/20 pt-2 text-[11px] leading-relaxed text-[#8fef7a]/90">
            “{quote}”
          </p>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <ControlButton
            label="Previous track"
            onClick={() => {
              play("click");
              setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
              setProgress(0);
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
              setIndex((i) => (i + 1) % TRACKS.length);
              setProgress(0);
            }}
          >
            ⏭
          </ControlButton>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1">
          {TRACKS.map((t, i) => (
            <button
              key={t.title}
              type="button"
              onClick={() => {
                play("click");
                setIndex(i);
                setProgress(0);
                setPlaying(true);
              }}
              className={cn(
                "rounded-sm border px-1 py-1.5 font-pixel text-[7px] leading-none",
                i === index
                  ? "border-[#8b5e34] bg-[#fff6df] text-[#8b5e34]"
                  : "border-[#b9a888]/80 bg-[#ebe1cd]/80 text-[#6b5a44] dark:bg-[#2a2218] dark:text-[#cbb892]"
              )}
              aria-label={`Play ${t.title}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
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
