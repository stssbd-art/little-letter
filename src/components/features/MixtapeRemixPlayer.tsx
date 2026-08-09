"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CassetteDeck } from "@/components/features/CassetteDeck";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import type { MixShare } from "@/lib/mixtape-link";
import { resolveShareTracks } from "@/lib/mixtape-link";
import { cn } from "@/lib/utils";

const CROSSFADE_SEC = 4;

type Props = {
  mix: MixShare;
};

export function MixtapeRemixPlayer({ mix }: Props) {
  const tracks = resolveShareTracks(mix);
  const aRef = useRef<HTMLAudioElement | null>(null);
  const bRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<"a" | "b">("a");
  const indexRef = useRef(0);
  const fadingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remixOn, setRemixOn] = useState(true);
  const [error, setError] = useState("");

  const current = tracks[index];

  useEffect(() => {
    const a = new Audio();
    const b = new Audio();
    a.preload = "auto";
    b.preload = "auto";
    aRef.current = a;
    bRef.current = b;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      a.pause();
      b.pause();
      a.src = "";
      b.src = "";
      aRef.current = null;
      bRef.current = null;
    };
  }, []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  function activeAudio() {
    return activeRef.current === "a" ? aRef.current : bRef.current;
  }

  function inactiveAudio() {
    return activeRef.current === "a" ? bRef.current : aRef.current;
  }

  function stopLoop() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function tick() {
    const audio = activeAudio();
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    setProgress((audio.currentTime / audio.duration) * 100);

    const remaining = audio.duration - audio.currentTime;
    const nextIndex = indexRef.current + 1;

    if (
      remixOn &&
      !fadingRef.current &&
      nextIndex < tracks.length &&
      remaining <= CROSSFADE_SEC &&
      remaining > 0
    ) {
      void startCrossfade(nextIndex);
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  async function loadInto(el: HTMLAudioElement, trackIndex: number) {
    const track = tracks[trackIndex];
    if (!track) return;
    el.src = track.src;
    el.currentTime = 0;
    el.volume = 1;
    el.load();
    await new Promise<void>((resolve, reject) => {
      const onReady = () => {
        cleanup();
        resolve();
      };
      const onErr = () => {
        cleanup();
        reject(new Error("Could not load track audio."));
      };
      const cleanup = () => {
        el.removeEventListener("canplay", onReady);
        el.removeEventListener("error", onErr);
      };
      if (el.readyState >= 2) {
        resolve();
        return;
      }
      el.addEventListener("canplay", onReady);
      el.addEventListener("error", onErr);
    });
  }

  async function startCrossfade(nextIndex: number) {
    const from = activeAudio();
    const to = inactiveAudio();
    if (!from || !to) return;

    fadingRef.current = true;
    try {
      await loadInto(to, nextIndex);
      to.volume = 0;
      await to.play();

      const start = performance.now();
      const durationMs = Math.min(CROSSFADE_SEC, Math.max(1, from.duration - from.currentTime)) * 1000;

      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          from.volume = Math.max(0, 1 - t);
          to.volume = Math.min(1, t);
          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(step);
      });

      from.pause();
      from.volume = 1;
      activeRef.current = activeRef.current === "a" ? "b" : "a";
      setIndex(nextIndex);
      indexRef.current = nextIndex;
      to.onended = () => {
        void onTrackEnded();
      };
    } catch {
      setError("Remix crossfade hiccup — skipping to next track.");
      setIndex(nextIndex);
      indexRef.current = nextIndex;
      void playAt(nextIndex, true);
    } finally {
      fadingRef.current = false;
    }
  }

  async function onTrackEnded() {
    if (fadingRef.current) return;
    const next = indexRef.current + 1;
    if (next < tracks.length) {
      await playAt(next, true);
    } else {
      setPlaying(false);
      setProgress(100);
      stopLoop();
    }
  }

  async function playAt(trackIndex: number, autoplay: boolean) {
    const audio = activeAudio();
    const other = inactiveAudio();
    if (!audio || !tracks[trackIndex]) return;

    setError("");
    other?.pause();
    fadingRef.current = false;

    try {
      await loadInto(audio, trackIndex);
      setIndex(trackIndex);
      indexRef.current = trackIndex;
      setProgress(0);
      audio.onended = () => {
        void onTrackEnded();
      };
      if (autoplay) {
        await audio.play();
        setPlaying(true);
        stopLoop();
        rafRef.current = requestAnimationFrame(tick);
      }
    } catch {
      setError("Could not play this track. Try another, or unmute browser audio.");
      setPlaying(false);
    }
  }

  async function togglePlay() {
    const audio = activeAudio();
    if (!audio) return;

    if (playing) {
      audio.pause();
      inactiveAudio()?.pause();
      setPlaying(false);
      stopLoop();
      return;
    }

    if (!audio.src) {
      await playAt(index, true);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
      stopLoop();
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      await playAt(index, true);
    }
  }

  if (!tracks.length) {
    return (
      <PixelWindow title="empty_tape.err" icon="⚠️">
        <p className="text-sm text-[var(--ll-ink)]">This mixtape has no playable tracks.</p>
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
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#8b5e34] via-[#e8b86d] to-[#8b5e34]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <PixelButton
              variant="ghost"
              onClick={() => void playAt(Math.max(0, index - 1), true)}
              disabled={index === 0}
            >
              ⏮
            </PixelButton>
            <PixelButton size="lg" onClick={() => void togglePlay()}>
              {playing ? "⏸ Pause mix" : "▶ Play mixtape"}
            </PixelButton>
            <PixelButton
              variant="ghost"
              onClick={() =>
                void playAt(Math.min(tracks.length - 1, index + 1), true)
              }
              disabled={index >= tracks.length - 1}
            >
              ⏭
            </PixelButton>
          </div>

          {error ? (
            <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <p className="text-center font-pixel text-[7px] leading-relaxed text-[var(--ll-muted)]">
            Tracks blend into each other like a continuous remix. Demo audio streams —
            titles are 90s favourites.
          </p>
        </div>
      </PixelWindow>

      <PixelWindow title="side_a.tracklist" icon="📜" liftOnHover={false}>
        <ul className="space-y-1">
          {tracks.map((t, i) => (
            <li key={`${t.id}-${i}`}>
              <button
                type="button"
                onClick={() => void playAt(i, true)}
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
