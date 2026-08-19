"use client";

import { useEffect, useRef, useState } from "react";
import { CassetteDeck } from "@/components/features/CassetteDeck";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import type { MixShare } from "@/lib/mixtape-link";
import { resolveShareTracks } from "@/lib/mixtape-link";
import { youtubeWatchUrl } from "@/lib/tracks";
import { loadYouTubeApi, type YtPlayer } from "@/lib/youtube";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

type Props = {
  mix: MixShare;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MixtapePlayer({ mix }: Props) {
  const tracks = resolveShareTracks(mix);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const indexRef = useRef(0);
  const advancingRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const current = tracks[index];

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (!tracks.length) return;

    let cancelled = false;
    let tries = 0;

    const mountPlayer = async () => {
      const container = hostRef.current;
      if (!container) {
        if (!cancelled && tries++ < 30) {
          window.setTimeout(() => void mountPlayer(), 50);
        }
        return;
      }

      try {
        const YT = await loadYouTubeApi();
        if (cancelled) return;

        playerRef.current?.destroy();
        const mount = document.createElement("div");
        mount.style.width = "100%";
        mount.style.height = "100%";
        container.replaceChildren(mount);

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
            onReady: () => {
              if (cancelled) return;
              setReady(true);
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const { ENDED, PLAYING, PAUSED } = YT.PlayerState;
              if (event.data === PLAYING) {
                setPlaying(true);
                setDuration(event.target.getDuration() || 0);
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
    };

    void mountPlayer();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setReady(false);
    };
    // Intentionally once per mixtape track list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mix.title, tracks.map((t) => t.id).join(",")]);

  // Track progress for the full song
  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player || advancingRef.current) return;
      try {
        const total = player.getDuration() || 0;
        const current = player.getCurrentTime() || 0;
        setDuration(total);
        setPlayTime(current);
        setProgress(total > 0 ? Math.min(100, (current / total) * 100) : 0);
      } catch {
        /* player may be mid-swap */
      }
    }, 250);
    return () => window.clearInterval(id);
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
    }
  }

  async function playIndex(nextIndex: number) {
    const track = tracks[nextIndex];
    const player = playerRef.current;
    if (!track || !player) return;
    setError("");
    setIndex(nextIndex);
    indexRef.current = nextIndex;
    setPlayTime(0);
    setProgress(0);
    setDuration(0);

    player.loadVideoById({
      videoId: track.youtubeId,
      startSeconds: 0,
    });
    player.playVideo();
    setPlaying(true);
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
      <PageHeader kicker="SIDE A · PLAY" title={mix.title}>
        for {mix.to || "you"} · from {mix.from || "a friend"}
      </PageHeader>

      <CassetteDeck
        title={mix.title}
        fromName={mix.from}
        toName={mix.to}
        tracks={tracks}
        spinning={playing}
        nowPlaying={current}
        screenRef={hostRef}
        onPlay={playMix}
        onStop={stopMix}
        onPrev={() => void playIndex(Math.max(0, index - 1))}
        onNext={() =>
          void playIndex(Math.min(tracks.length - 1, index + 1))
        }
        controlsDisabled={!ready}
        prevDisabled={index === 0}
        nextDisabled={index >= tracks.length - 1}
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
              TRACK {index + 1}/{tracks.length}
              {!ready ? " · LOADING…" : playing ? " · LIVE" : " · READY"}
            </p>
            <p className="truncate font-display text-base text-[var(--ll-ink)]">
              {current?.title}
            </p>
            <p className="truncate text-xs text-[var(--ll-muted)]">
              {current?.artist} · {current?.year}
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#ebe1cd]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8b5e34] via-[#e8b86d] to-[#8b5e34] transition-[width] duration-150"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="flex justify-between font-pixel text-[7px] text-[var(--ll-muted)]">
            <span>{formatTime(playTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <PixelButton
              variant="ghost"
              onClick={() => void playIndex(Math.max(0, index - 1))}
              disabled={index === 0 || !ready}
              aria-label="Previous track"
            >
              ⏮
            </PixelButton>
            <PixelButton
              size="lg"
              onClick={playMix}
              disabled={!ready || playing}
              aria-label="Play"
            >
              ▶
            </PixelButton>
            <PixelButton
              variant="ghost"
              size="lg"
              onClick={stopMix}
              disabled={!ready || !playing}
              aria-label="Stop"
            >
              ■
            </PixelButton>
            <PixelButton
              variant="ghost"
              onClick={() =>
                void playIndex(Math.min(tracks.length - 1, index + 1))
              }
              disabled={index >= tracks.length - 1 || !ready}
              aria-label="Next track"
            >
              ⏭
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
            Songs play through YouTube. When one finishes, the next track starts.
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
                  {i === index && duration > 0 ? formatTime(duration) : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PixelWindow>
    </div>
  );
}
