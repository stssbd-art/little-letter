"use client";

import { useEffect, useRef, useState } from "react";
import { CassetteDeck } from "@/components/features/CassetteDeck";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import type { MixShare } from "@/lib/mixtape-link";
import { resolveShareTracks } from "@/lib/mixtape-link";
import { youtubeWatchUrl } from "@/lib/tracks";
import { loadYouTubeApi, type YtPlayer } from "@/lib/youtube";
import { cn } from "@/lib/utils";

/** Short mix slice per track — not the full song */
const CLIP_SEC = 30;

type Props = {
  mix: MixShare;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function pickClipStart(duration: number) {
  if (!Number.isFinite(duration) || duration <= CLIP_SEC + 5) return 0;
  // Start ~20% in so the slice feels like a mix drop, not always the intro
  return Math.min(duration - CLIP_SEC - 1, Math.max(0, duration * 0.2));
}

export function MixtapePlayer({ mix }: Props) {
  const tracks = resolveShareTracks(mix);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const indexRef = useRef(0);
  const clipStartRef = useRef(0);
  const advancingRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [clipTime, setClipTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const current = tracks[index];

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (!tracks.length || !hostRef.current) return;

    let cancelled = false;
    const mount = hostRef.current;

    void (async () => {
      try {
        const YT = await loadYouTubeApi();
        if (cancelled || !mount) return;

        playerRef.current?.destroy();
        playerRef.current = new YT.Player(mount, {
          videoId: tracks[0]!.youtubeId,
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
            onReady: (event) => {
              if (cancelled) return;
              const startAt = pickClipStart(event.target.getDuration() || 0);
              clipStartRef.current = startAt;
              if (startAt > 0) event.target.seekTo(startAt, true);
              setReady(true);
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const { ENDED, PLAYING, PAUSED } = YT.PlayerState;
              if (event.data === PLAYING) {
                setPlaying(true);
                // After load, duration may only be ready once playing
                const duration = event.target.getDuration() || 0;
                if (
                  clipStartRef.current === 0 &&
                  duration > CLIP_SEC + 5 &&
                  event.target.getCurrentTime() < 2
                ) {
                  const startAt = pickClipStart(duration);
                  clipStartRef.current = startAt;
                  event.target.seekTo(startAt, true);
                }
              }
              if (event.data === PAUSED) setPlaying(false);
              if (event.data === ENDED) {
                void advanceFrom(indexRef.current);
              }
            },
            onError: () => {
              if (cancelled) return;
              setError(
                "One video couldn’t play here — skipping to the next track."
              );
              setPlaying(false);
              const next = indexRef.current + 1;
              if (next < tracks.length) {
                void playIndex(next);
              }
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
    // Intentionally once per mixtape track list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mix.title, tracks.map((t) => t.id).join(",")]);

  // Poll clip progress and auto-advance after ~30s
  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player || advancingRef.current) return;
      try {
        if (player.getPlayerState() !== 1) return;
        const elapsed = Math.max(
          0,
          player.getCurrentTime() - clipStartRef.current
        );
        setClipTime(Math.min(CLIP_SEC, elapsed));
        setProgress(Math.min(100, (elapsed / CLIP_SEC) * 100));
        if (elapsed >= CLIP_SEC) {
          void advanceFrom(indexRef.current);
        }
      } catch {
        /* player may be mid-swap */
      }
    }, 250);
    return () => window.clearInterval(id);
    // advanceFrom is stable via refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, tracks.length]);

  async function advanceFrom(fromIndex: number) {
    if (advancingRef.current) return;
    const next = fromIndex + 1;
    if (next < tracks.length) {
      advancingRef.current = true;
      await playIndex(next);
      advancingRef.current = false;
    } else {
      const player = playerRef.current;
      player?.pauseVideo();
      setPlaying(false);
      setProgress(100);
      setClipTime(CLIP_SEC);
    }
  }

  async function playIndex(nextIndex: number) {
    const track = tracks[nextIndex];
    const player = playerRef.current;
    if (!track || !player) return;
    setError("");
    setIndex(nextIndex);
    indexRef.current = nextIndex;
    setClipTime(0);
    setProgress(0);
    clipStartRef.current = 0;

    player.loadVideoById({
      videoId: track.youtubeId,
      startSeconds: 0,
    });
    // Brief wait so duration metadata can arrive, then seek into the slice
    await new Promise((r) => setTimeout(r, 600));
    try {
      const startAt = pickClipStart(player.getDuration() || 0);
      clipStartRef.current = startAt;
      if (startAt > 0) player.seekTo(startAt, true);
      player.playVideo();
      setPlaying(true);
    } catch {
      player.playVideo();
      setPlaying(true);
    }
  }

  function playMix() {
    const player = playerRef.current;
    if (!player || !ready) return;
    try {
      player.playVideo();
      setPlaying(true);
    } catch {
      void playIndex(index);
    }
  }

  function stopMix() {
    const player = playerRef.current;
    if (!player || !ready) return;
    try {
      player.pauseVideo();
      setPlaying(false);
    } catch {
      setPlaying(false);
    }
  }

  if (!tracks.length) {
    return (
      <PixelWindow title="empty_tape.err" icon="⚠️">
        <p className="text-sm text-[var(--ll-ink)]">
          This mixtape has no playable tracks.
        </p>
      </PixelWindow>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <p className="font-pixel text-[9px] tracking-widest text-[var(--ll-muted)]">
          SIDE A · 30-SEC MIX
        </p>
        <h1 className="mt-2 font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          {mix.title}
        </h1>
        <p className="mt-2 font-display text-sm text-[var(--ll-muted)]">
          for {mix.to || "you"} · from {mix.from || "a friend"}
        </p>
      </div>

      <CassetteDeck
        title={mix.title}
        fromName={mix.from}
        toName={mix.to}
        tracks={tracks}
        spinning={playing}
        onPlay={playMix}
        onStop={stopMix}
        controlsDisabled={!ready}
      />

      {mix.note ? (
        <p className="text-center font-display text-sm italic text-[var(--ll-ink)]">
          “{mix.note}”
        </p>
      ) : null}

      <PixelWindow title="mixtape_player.exe" icon="🎵" liftOnHover={false}>
        <div className="space-y-4">
          <div className="min-w-0">
            <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
              SLICE {index + 1}/{tracks.length} · 30 SEC
              {!ready ? " · LOADING…" : playing ? " · LIVE" : " · READY"}
            </p>
            <p className="truncate font-display text-base text-[var(--ll-ink)]">
              {current?.title}
            </p>
            <p className="truncate text-xs text-[var(--ll-muted)]">
              {current?.artist} · {current?.year}
            </p>
          </div>

          <div className="aspect-video overflow-hidden rounded-xl border-2 border-[var(--ll-lavender)] bg-black">
            <div ref={hostRef} className="h-full w-full" />
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#ebe1cd]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8b5e34] via-[#e8b86d] to-[#8b5e34] transition-[width] duration-150"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="flex justify-between font-pixel text-[7px] text-[var(--ll-muted)]">
            <span>{formatTime(clipTime)}</span>
            <span>0:30 slice</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <PixelButton
              variant="ghost"
              onClick={() => void playIndex(Math.max(0, index - 1))}
              disabled={index === 0 || !ready}
            >
              ⏮ Prev
            </PixelButton>
            <PixelButton size="lg" onClick={playMix} disabled={!ready || playing}>
              ▶ Play mix
            </PixelButton>
            <PixelButton
              variant="ghost"
              size="lg"
              onClick={stopMix}
              disabled={!ready || !playing}
            >
              ■ Stop
            </PixelButton>
            <PixelButton
              variant="ghost"
              onClick={() =>
                void playIndex(Math.min(tracks.length - 1, index + 1))
              }
              disabled={index >= tracks.length - 1 || !ready}
            >
              Next ⏭
            </PixelButton>
          </div>

          {current ? (
            <p className="text-center text-xs text-[var(--ll-muted)]">
              <a
                href={youtubeWatchUrl(current.youtubeId)}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-[var(--ll-pink-deep)]"
              >
                Hear the full song on YouTube
              </a>
            </p>
          ) : null}

          {error ? (
            <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <p className="text-center font-pixel text-[7px] leading-relaxed text-[var(--ll-muted)]">
            Original songs via YouTube — each plays a 30-second mix slice, then
            the next track starts. Not the full recording.
          </p>
        </div>
      </PixelWindow>

      <PixelWindow title="side_a.tracklist" icon="📜" liftOnHover={false}>
        <ul className="space-y-1">
          {tracks.map((t, i) => (
            <li key={`${t.id}-${i}`}>
              <button
                type="button"
                onClick={() => void playIndex(i)}
                disabled={!ready}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left",
                  i === index
                    ? "bg-[#fff6df] text-[#8b5e34]"
                    : "text-[var(--ll-ink)] hover:bg-white/50 dark:hover:bg-white/10"
                )}
              >
                <span className="font-pixel text-[8px] opacity-70">{i + 1}.</span>
                <span className="min-w-0 flex-1 truncate font-display text-sm">
                  {t.title}
                </span>
                <span className="shrink-0 font-pixel text-[7px] opacity-60">
                  0:30
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PixelWindow>
    </div>
  );
}
