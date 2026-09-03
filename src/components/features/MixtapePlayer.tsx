"use client";

import { useEffect, useRef, useState } from "react";
import { CassetteDeck } from "@/components/features/CassetteDeck";
import { PixelWindow } from "@/components/ui/PixelWindow";
import type { MixShare } from "@/lib/mixtape-link";
import { resolveShareTracks } from "@/lib/mixtape-link";
import { loadYouTubeApi, type YtPlayer } from "@/lib/youtube";
import {
  MIX_FADE_LEAD_SECONDS,
  safeSetVolume,
  softMixToVideo,
} from "@/lib/youtube-mix";
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
  const fadeArmedRef = useRef(false);
  const tracksRef = useRef(tracks);
  const playIndexRef = useRef<(nextIndex: number, quick?: boolean) => Promise<void>>(
    async () => undefined
  );

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [mixing, setMixing] = useState(false);

  const current = tracks[index];
  tracksRef.current = tracks;

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
            onReady: (event) => {
              if (cancelled) return;
              safeSetVolume(event.target, 100);
              setReady(true);
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const { ENDED, PLAYING, PAUSED } = YT.PlayerState;
              if (event.data === PLAYING) {
                setPlaying(true);
                setDuration(event.target.getDuration() || 0);
                if (!advancingRef.current) {
                  safeSetVolume(event.target, 100);
                }
              }
              if (event.data === PAUSED) setPlaying(false);
              if (event.data === ENDED) {
                // Fallback if near-end fade didn't fire (very short tracks, etc.)
                if (!advancingRef.current) {
                  const next = indexRef.current + 1;
                  if (next < tracksRef.current.length) {
                    void playIndexRef.current(next, false);
                  } else {
                    event.target.pauseVideo();
                    setPlaying(false);
                    fadeArmedRef.current = false;
                  }
                }
              }
            },
            onError: () => {
              if (cancelled) return;
              setError(
                "One video couldn’t play here — skipping to the next track."
              );
              setPlaying(false);
              const next = indexRef.current + 1;
              if (next < tracksRef.current.length) {
                void playIndexRef.current(next, true);
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

  // Soft-mix near the end of each track
  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player || advancingRef.current) return;
      try {
        const total = player.getDuration() || 0;
        const currentTime = player.getCurrentTime() || 0;
        setDuration(total);

        const nextIndex = indexRef.current + 1;
        if (
          total > MIX_FADE_LEAD_SECONDS + 2 &&
          currentTime > 0 &&
          total - currentTime <= MIX_FADE_LEAD_SECONDS &&
          nextIndex < tracksRef.current.length &&
          !fadeArmedRef.current
        ) {
          fadeArmedRef.current = true;
          void playIndexRef.current(nextIndex, false);
        }
      } catch {
        /* player may be mid-swap */
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [ready]);

  async function playIndex(nextIndex: number, quick = true) {
    const track = tracksRef.current[nextIndex];
    const player = playerRef.current;
    if (!track || !player) return;
    if (advancingRef.current) return;

    advancingRef.current = true;
    setMixing(true);
    setError("");
    setIndex(nextIndex);
    indexRef.current = nextIndex;
    setDuration(0);
    fadeArmedRef.current = false;

    try {
      await softMixToVideo(player, track.youtubeId, { quick });
      setPlaying(true);
    } catch {
      try {
        player.loadVideoById(track.youtubeId);
        player.playVideo();
        safeSetVolume(player, 100);
        setPlaying(true);
      } catch {
        setError("Couldn’t start the next track.");
        setPlaying(false);
      }
    } finally {
      advancingRef.current = false;
      setMixing(false);
      fadeArmedRef.current = false;
    }
  }
  playIndexRef.current = playIndex;

  function playMix() {
    const player = playerRef.current;
    if (!player || !ready) return;
    try {
      safeSetVolume(player, 100);
      player.playVideo();
      setPlaying(true);
    } catch {
      void playIndex(index, true);
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
        showFullSongLink
        onPlay={playMix}
        onStop={stopMix}
        onPrev={() => void playIndex(Math.max(0, index - 1), true)}
        onNext={() =>
          void playIndex(Math.min(tracks.length - 1, index + 1), true)
        }
        controlsDisabled={!ready || mixing}
        prevDisabled={index === 0}
        nextDisabled={index >= tracks.length - 1}
      />

      {mix.note ? (
        <p className="text-center font-display text-sm italic text-[var(--ll-ink)]">
          “{mix.note}”
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-center text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <PixelWindow title="side_a.tracklist" icon="📜" liftOnHover={false}>
        <ul className="ll-song-scroll max-h-64 space-y-1 pr-1">
          {tracks.map((t, i) => (
            <li key={`${t.id}-${i}`}>
              <button
                type="button"
                onClick={() => void playIndex(i, true)}
                disabled={!ready || mixing}
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
