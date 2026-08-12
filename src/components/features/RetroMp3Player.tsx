"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/components/providers/SoundProvider";
import { MIX_TRACKS, youtubeWatchUrl } from "@/lib/tracks";
import { loadYouTubeApi, type YtPlayer } from "@/lib/youtube";
import { cn } from "@/lib/utils";

const TRACKS = MIX_TRACKS.slice(0, 8);

export function RetroMp3Player({ className }: { className?: string }) {
  const { play } = useSound();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const indexRef = useRef(0);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const track = TRACKS[index % TRACKS.length]!;

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (!hostRef.current) return;
    let cancelled = false;
    const mount = hostRef.current;

    void (async () => {
      try {
        const YT = await loadYouTubeApi();
        if (cancelled || !mount) return;

        playerRef.current?.destroy();
        playerRef.current = new YT.Player(mount, {
          videoId: TRACKS[0]!.youtubeId,
          width: "100%",
          height: "100%",
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            controls: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!cancelled) {
                setReady(true);
                setError("");
              }
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const { ENDED, PLAYING, PAUSED } = YT.PlayerState;
              if (event.data === PLAYING) setPlaying(true);
              if (event.data === PAUSED) setPlaying(false);
              if (event.data === ENDED) {
                const next = (indexRef.current + 1) % TRACKS.length;
                setIndex(next);
                indexRef.current = next;
                event.target.loadVideoById(TRACKS[next]!.youtubeId);
              }
            },
            onError: () => {
              if (cancelled) return;
              setError("This track couldn’t play — try Next.");
              setPlaying(false);
            },
          },
        });
      } catch {
        if (!cancelled) {
          setError("Could not load the music player. Check your connection.");
        }
      }
    })();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setReady(false);
    };
  }, []);

  function selectTrack(next: number) {
    const player = playerRef.current;
    const nextTrack = TRACKS[next];
    if (!nextTrack) return;
    play("click");
    setIndex(next);
    indexRef.current = next;
    setError("");
    if (player && ready) {
      try {
        player.loadVideoById(nextTrack.youtubeId);
        player.playVideo();
        setPlaying(true);
      } catch {
        setError("Couldn’t switch track — try Play again.");
      }
    }
  }

  function playMix() {
    const player = playerRef.current;
    if (!player || !ready) return;
    play("click");
    try {
      player.playVideo();
      setPlaying(true);
    } catch {
      selectTrack(index);
    }
  }

  function stopMix() {
    const player = playerRef.current;
    if (!player || !ready) return;
    play("click");
    try {
      player.pauseVideo();
      setPlaying(false);
    } catch {
      setPlaying(false);
    }
  }

  return (
    <section
      className={cn(
        "mp3-shell overflow-hidden rounded-[22px] border-[3px] border-[#8a7a62] bg-gradient-to-b from-[#efe6d4] to-[#d8cdb6]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.65),6px_8px_0_rgba(61,47,34,0.18)]",
        "dark:from-[#2a2218] dark:to-[#1c1610] dark:border-[#5c4a34]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[#b9a888]/70 px-3 py-2 dark:border-[#5c4a34]">
        <p className="font-pixel text-[9px] tracking-wide text-[#5c4a34] dark:text-[#e6c98a]">
          LL-PLAYER LOVE
        </p>
        <p className="font-pixel text-[8px] text-[#8a7a62]">
          {!ready ? "LOAD" : playing ? "STEREO" : "READY"}
        </p>
      </div>

      <div className="space-y-3 p-3">
        <div className="lcd-screen rounded-md border-2 border-[#3d2f22] bg-[#1a2e1a] px-3 py-3 text-[#8fef7a] shadow-[inset_0_0_18px_rgba(0,0,0,0.55)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-pixel text-[8px] opacity-80">NOW PLAYING · LOVE MIX</p>
              <p className="mt-1 truncate font-pixel text-[10px] leading-relaxed">
                {track.title}
              </p>
              <p className="mt-1 truncate font-pixel text-[8px] opacity-80">
                {track.artist} · {track.year}
              </p>
            </div>
            <motion.div
              animate={playing ? { rotate: 360 } : { rotate: 0 }}
              transition={
                playing
                  ? { repeat: Infinity, duration: 2.4, ease: "linear" }
                  : { duration: 0.2 }
              }
              className="mt-0.5 size-8 shrink-0 rounded-full border-2 border-[#8fef7a]/50 bg-[#0f1c0f]"
            />
          </div>

          <p className="mt-3 border-t border-[#8fef7a]/20 pt-2 font-pixel text-[7px] leading-relaxed text-[#8fef7a]/80">
            Original romantic hits via YouTube
          </p>
        </div>

        <div className="aspect-video overflow-hidden rounded-lg border-2 border-[#3d2f22] bg-black">
          <div ref={hostRef} className="h-full w-full" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Previous track"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#8a7a62] bg-[#fff6df] text-sm text-[#5c4a34] dark:bg-[#322a22] dark:text-[#e6c98a] disabled:opacity-50"
            onClick={() =>
              selectTrack((index - 1 + TRACKS.length) % TRACKS.length)
            }
            disabled={!ready}
          >
            ⏮
          </button>
          <button
            type="button"
            aria-label="Play"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#8a7a62] bg-[#f6d58a] text-base text-[#3d2f22] disabled:opacity-50"
            onClick={playMix}
            disabled={!ready || playing}
          >
            ▶
          </button>
          <button
            type="button"
            aria-label="Stop"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#8a7a62] bg-[#fff6df] text-base text-[#5c4a34] dark:bg-[#322a22] dark:text-[#e6c98a] disabled:opacity-50"
            onClick={stopMix}
            disabled={!ready || !playing}
          >
            ■
          </button>
          <button
            type="button"
            aria-label="Next track"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#8a7a62] bg-[#fff6df] text-sm text-[#5c4a34] dark:bg-[#322a22] dark:text-[#e6c98a] disabled:opacity-50"
            onClick={() => selectTrack((index + 1) % TRACKS.length)}
            disabled={!ready}
          >
            ⏭
          </button>
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-300 bg-rose-50 px-2 py-1.5 text-center text-xs text-rose-700">
            {error}
          </p>
        ) : null}

        <ul className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-[#b9a888]/60 bg-white/40 p-2 dark:bg-black/20">
          {TRACKS.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => selectTrack(i)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left",
                  i === index
                    ? "bg-[#fff6df] text-[#8b5e34]"
                    : "text-[#5c4a34] hover:bg-white/60 dark:text-[#e6c98a] dark:hover:bg-white/10"
                )}
              >
                <span className="font-pixel text-[7px] opacity-70">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate font-display text-xs">
                  {t.title}
                </span>
                <a
                  href={youtubeWatchUrl(t.youtubeId)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 font-pixel text-[7px] underline opacity-70"
                >
                  YT
                </a>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
