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

type Props = {
  mix: MixShare;
};

export function MixtapePlayer({ mix }: Props) {
  const tracks = resolveShareTracks(mix);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const indexRef = useRef(0);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
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
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!cancelled) setReady(true);
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const { ENDED, PLAYING, PAUSED } = YT.PlayerState;
              if (event.data === PLAYING) setPlaying(true);
              if (event.data === PAUSED) setPlaying(false);
              if (event.data === ENDED) {
                const next = indexRef.current + 1;
                if (next < tracks.length) {
                  setIndex(next);
                  indexRef.current = next;
                  event.target.loadVideoById(tracks[next]!.youtubeId);
                } else {
                  setPlaying(false);
                }
              }
            },
            onError: () => {
              if (!cancelled) {
                setError(
                  "This video couldn’t play here. Open it on YouTube instead."
                );
                setPlaying(false);
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

  function playIndex(nextIndex: number) {
    const track = tracks[nextIndex];
    const player = playerRef.current;
    if (!track || !player) return;
    setError("");
    setIndex(nextIndex);
    indexRef.current = nextIndex;
    player.loadVideoById(track.youtubeId);
    player.playVideo();
    setPlaying(true);
  }

  function togglePlay() {
    const player = playerRef.current;
    if (!player || !ready) return;
    try {
      const state = player.getPlayerState();
      // 1 = playing
      if (state === 1) {
        player.pauseVideo();
        setPlaying(false);
      } else {
        player.playVideo();
        setPlaying(true);
      }
    } catch {
      playIndex(index);
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
          SIDE A · FULL MIX
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
              {!ready ? " · LOADING…" : playing ? " · PLAYING" : " · READY"}
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

          <div className="flex flex-wrap items-center justify-center gap-2">
            <PixelButton
              variant="ghost"
              onClick={() => playIndex(Math.max(0, index - 1))}
              disabled={index === 0 || !ready}
            >
              ⏮ Prev
            </PixelButton>
            <PixelButton size="lg" onClick={togglePlay} disabled={!ready}>
              {playing ? "⏸ Pause mix" : "▶ Play mix"}
            </PixelButton>
            <PixelButton
              variant="ghost"
              onClick={() =>
                playIndex(Math.min(tracks.length - 1, index + 1))
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
                Open “{current.title}” on YouTube
              </a>
            </p>
          ) : null}

          {error ? (
            <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <p className="text-center font-pixel text-[7px] leading-relaxed text-[var(--ll-muted)]">
            Original recordings via YouTube. Songs play in full, then the next
            track starts automatically.
          </p>
        </div>
      </PixelWindow>

      <PixelWindow title="side_a.tracklist" icon="📜" liftOnHover={false}>
        <ul className="space-y-1">
          {tracks.map((t, i) => (
            <li key={`${t.id}-${i}`}>
              <button
                type="button"
                onClick={() => playIndex(i)}
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
                  {t.artist}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PixelWindow>
    </div>
  );
}
