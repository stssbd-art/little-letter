"use client";

import { useEffect, useRef, useState } from "react";
import { CassetteDeck } from "@/components/features/CassetteDeck";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import type { MixShare } from "@/lib/mixtape-link";
import { resolveShareTracks } from "@/lib/mixtape-link";
import { cn } from "@/lib/utils";

/** DJ-style slice length per track */
const CLIP_SEC = 30;
const FADE_SEC = 2.4;

type Props = {
  mix: MixShare;
};

export function MixtapeRemixPlayer({ mix }: Props) {
  const tracks = resolveShareTracks(mix);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);
  const clipStartRef = useRef(0);
  const fadingRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [clipTime, setClipTime] = useState(0);
  const [error, setError] = useState("");

  const current = tracks[index];

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const sync = () => setPlaying(!audio.paused && !audio.ended);
    audio.addEventListener("playing", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("ended", sync);
    return () => {
      audio.removeEventListener("playing", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("ended", sync);
    };
  }, []);

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function pickClipStart(duration: number) {
    if (!Number.isFinite(duration) || duration <= CLIP_SEC + 5) return 0;
    // Start ~20% in so the slice feels like a DJ drop, not always the intro
    return Math.min(duration - CLIP_SEC - 1, Math.max(0, duration * 0.2));
  }

  async function waitForCanPlay(el: HTMLAudioElement) {
    if (el.readyState >= 3) return;
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        cleanup();
        resolve();
      }, 8000);
      const onReady = () => {
        cleanup();
        resolve();
      };
      const onErr = () => {
        cleanup();
        reject(new Error("Track failed to load."));
      };
      const cleanup = () => {
        window.clearTimeout(timer);
        el.removeEventListener("canplay", onReady);
        el.removeEventListener("loadeddata", onReady);
        el.removeEventListener("error", onErr);
      };
      el.addEventListener("canplay", onReady);
      el.addEventListener("loadeddata", onReady);
      el.addEventListener("error", onErr);
    });
  }

  async function playIndex(nextIndex: number) {
    const audio = audioRef.current;
    const track = tracks[nextIndex];
    if (!audio || !track) return;

    fadingRef.current = false;
    setLoading(true);
    setError("");
    setIndex(nextIndex);
    indexRef.current = nextIndex;
    setClipTime(0);
    setProgress(0);

    try {
      if (audio.getAttribute("data-track") !== track.id) {
        audio.src = track.src;
        audio.setAttribute("data-track", track.id);
      }
      audio.volume = 1;
      await waitForCanPlay(audio);

      const startAt = pickClipStart(audio.duration || 0);
      clipStartRef.current = startAt;
      audio.currentTime = startAt;
      await audio.play();
      setPlaying(true);
    } catch (err) {
      setPlaying(false);
      setError(
        err instanceof Error
          ? err.message
          : "Could not play — tap Play again (browser may block autoplay)."
      );
    } finally {
      setLoading(false);
    }
  }

  async function djAdvance(nextIndex: number) {
    const current = audioRef.current;
    if (!current || fadingRef.current) return;
    fadingRef.current = true;
    try {
      const startVol = current.volume;
      for (let i = 1; i <= 12; i++) {
        current.volume = Math.max(0, startVol * (1 - i / 12));
        await new Promise((r) => setTimeout(r, (FADE_SEC * 1000) / 12));
      }
      current.pause();
      current.volume = 1;
      fadingRef.current = false;
      await playIndex(nextIndex);
    } catch {
      fadingRef.current = false;
      await playIndex(nextIndex);
    }
  }

  function finishMix() {
    const audio = audioRef.current;
    audio?.pause();
    setPlaying(false);
    setProgress(100);
    setClipTime(CLIP_SEC);
  }

  function onTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;

    const elapsed = Math.max(0, audio.currentTime - clipStartRef.current);
    setClipTime(Math.min(CLIP_SEC, elapsed));
    setProgress(Math.min(100, (elapsed / CLIP_SEC) * 100));

    if (fadingRef.current) return;

    const next = indexRef.current + 1;

    // DJ cut: after ~30s, fade into the next slice
    if (elapsed >= CLIP_SEC - FADE_SEC) {
      if (next < tracks.length) {
        void djAdvance(next);
      } else if (elapsed >= CLIP_SEC) {
        finishMix();
      }
    }
  }

  function onEnded() {
    if (fadingRef.current) return;
    const next = indexRef.current + 1;
    if (next < tracks.length) {
      void playIndex(next);
    } else {
      finishMix();
    }
  }

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing && !audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    // Fresh DJ start or resume current slice
    if (!audio.src || audio.getAttribute("data-track") !== tracks[index]?.id) {
      await playIndex(index);
      return;
    }

    try {
      setLoading(true);
      await audio.play();
      setPlaying(true);
      setError("");
    } catch {
      await playIndex(index);
    } finally {
      setLoading(false);
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
          DJ REMIX · 30-SEC SLICES
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

      <PixelWindow title="dj_deck.exe" icon="🎧" liftOnHover={false}>
        <div className="space-y-4">
          <div className="min-w-0">
            <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
              SLICE {index + 1}/{tracks.length} · 30 SEC MIX
              {loading ? " · LOADING…" : playing ? " · LIVE" : ""}
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
            <span>{formatTime(clipTime)}</span>
            <span>0:30 slice</span>
          </div>

          <div className="rounded-xl border-2 border-[var(--ll-lavender)] bg-white/70 p-3 dark:bg-white/5">
            <p className="mb-2 font-pixel text-[8px] text-[var(--ll-muted)]">
              DJ transport
            </p>
            <audio
              ref={audioRef}
              controls
              playsInline
              preload="auto"
              onTimeUpdate={onTimeUpdate}
              onEnded={onEnded}
              onError={() =>
                setError(
                  "Audio failed to load. Check your connection and tap Play again."
                )
              }
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <PixelButton
              variant="ghost"
              onClick={() => void playIndex(Math.max(0, index - 1))}
              disabled={index === 0 || loading}
            >
              ⏮ Prev slice
            </PixelButton>
            <PixelButton
              size="lg"
              onClick={() => void togglePlay()}
              disabled={loading}
            >
              {loading
                ? "⏳ Cueing…"
                : playing
                  ? "⏸ Pause mix"
                  : "▶ Play DJ mix"}
            </PixelButton>
            <PixelButton
              variant="ghost"
              onClick={() =>
                void playIndex(Math.min(tracks.length - 1, index + 1))
              }
              disabled={index >= tracks.length - 1 || loading}
            >
              Next slice ⏭
            </PixelButton>
          </div>

          {error ? (
            <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <p className="text-center font-pixel text-[7px] leading-relaxed text-[var(--ll-muted)]">
            Each track plays a 30-second DJ slice, then fades into the next —
            not the full song. Demo instrumentals under romantic titles.
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
