"use client";

import { useEffect, useRef, useState } from "react";
import { CassetteDeck } from "@/components/features/CassetteDeck";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import type { MixShare } from "@/lib/mixtape-link";
import { resolveShareTracks } from "@/lib/mixtape-link";
import { cn } from "@/lib/utils";

type Props = {
  mix: MixShare;
};

export function MixtapeRemixPlayer({ mix }: Props) {
  const tracks = resolveShareTracks(mix);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);
  const remixRef = useRef(true);
  const fadingRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remixOn, setRemixOn] = useState(true);
  const [error, setError] = useState("");

  const current = tracks[index];

  useEffect(() => {
    remixRef.current = remixOn;
  }, [remixOn]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Keep playing state honest with the element
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

  async function waitForCanPlay(el: HTMLAudioElement) {
    if (el.readyState >= 3) return;
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        cleanup();
        // Soft-continue — play() may still work while buffering
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

    try {
      if (audio.src !== track.src) {
        audio.src = track.src;
      }
      audio.volume = 1;
      await waitForCanPlay(audio);
      await audio.play();
      setPlaying(true);
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
      );
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

  async function crossfadeTo(nextIndex: number) {
    // Continuous mix: fade out current, then start next (reliable across browsers)
    const current = audioRef.current;
    if (!current || fadingRef.current) return;
    fadingRef.current = true;
    try {
      const startVol = current.volume;
      for (let i = 1; i <= 10; i++) {
        current.volume = Math.max(0, startVol * (1 - i / 10));
        await new Promise((r) => setTimeout(r, 80));
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

  function onTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;

    setProgress((audio.currentTime / audio.duration) * 100);

    const remaining = audio.duration - audio.currentTime;
    const next = indexRef.current + 1;
    if (
      remixRef.current &&
      !fadingRef.current &&
      next < tracks.length &&
      remaining > 0 &&
      remaining <= 3.2
    ) {
      void crossfadeTo(next);
    }
  }

  function onEnded() {
    if (fadingRef.current) return;
    const next = indexRef.current + 1;
    if (next < tracks.length) {
      void playIndex(next);
    } else {
      setPlaying(false);
      setProgress(100);
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

    if (!audio.src && tracks[index]) {
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
          REMIX MODE · CONTINUOUS MIX
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

      <PixelWindow title="remix_deck.exe" icon="🎧" liftOnHover={false}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
                NOW MIXING {index + 1}/{tracks.length}
                {loading ? " · LOADING…" : playing ? " · LIVE" : ""}
              </p>
              <p className="truncate font-display text-base text-[var(--ll-ink)]">
                {current?.title}
              </p>
              <p className="truncate text-xs text-[var(--ll-muted)]">
                {current?.artist} · {current?.year}
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-[var(--ll-lavender)] bg-[#fff6df]/70 px-3 py-2 font-pixel text-[8px] text-[var(--ll-pink-deep)]">
              <input
                type="checkbox"
                checked={remixOn}
                onChange={(e) => setRemixOn(e.target.checked)}
                className="accent-[#8b5e34]"
              />
              Auto-remix crossfade
            </label>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#ebe1cd]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8b5e34] via-[#e8b86d] to-[#8b5e34] transition-[width] duration-200"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="flex justify-between font-pixel text-[7px] text-[var(--ll-muted)]">
            <span>
              {formatTime(audioRef.current?.currentTime ?? 0)}
            </span>
            <span>{formatTime(audioRef.current?.duration ?? 0)}</span>
          </div>

          <div className="rounded-xl border-2 border-[var(--ll-lavender)] bg-white/70 p-3 dark:bg-white/5">
            <p className="mb-2 font-pixel text-[8px] text-[var(--ll-muted)]">
              Tape transport
            </p>
            <audio
              ref={audioRef}
              controls
              playsInline
              preload="auto"
              onTimeUpdate={onTimeUpdate}
              onEnded={onEnded}
              onError={() =>
                setError("Audio failed to load. Check your connection and tap Play again.")
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
              ⏮ Prev
            </PixelButton>
            <PixelButton size="lg" onClick={() => void togglePlay()} disabled={loading}>
              {loading ? "⏳ Loading…" : playing ? "⏸ Pause mix" : "▶ Play mixtape"}
            </PixelButton>
            <PixelButton
              variant="ghost"
              onClick={() =>
                void playIndex(Math.min(tracks.length - 1, index + 1))
              }
              disabled={index >= tracks.length - 1 || loading}
            >
              Next ⏭
            </PixelButton>
          </div>

          {error ? (
            <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <p className="text-center font-pixel text-[7px] leading-relaxed text-[var(--ll-muted)]">
            Tracks crossfade into a continuous remix. Titles are 90s favourites —
            audio uses free demo instrumentals (not the original radio versions).
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
                <span className="truncate font-pixel text-[7px] opacity-60">
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
