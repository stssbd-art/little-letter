import type { YtPlayer } from "@/lib/youtube";

/** Seconds before track end to start fading out (Apple Music–style soft mix). */
export const MIX_FADE_LEAD_SECONDS = 3.5;
/** Outro fade length */
export const MIX_FADE_OUT_MS = 2800;
/** Intro fade length after the next track loads */
export const MIX_FADE_IN_MS = 1800;

/**
 * Ramp YouTube player volume from → to over durationMs.
 * Returns a cancel function.
 */
export function fadeVolume(
  player: YtPlayer,
  from: number,
  to: number,
  durationMs: number
): () => void {
  const start = performance.now();
  const clampedFrom = Math.max(0, Math.min(100, from));
  const clampedTo = Math.max(0, Math.min(100, to));
  let raf = 0;
  let cancelled = false;

  try {
    player.unMute();
    player.setVolume(clampedFrom);
  } catch {
    /* player may not be ready */
  }

  const tick = (now: number) => {
    if (cancelled) return;
    const t = durationMs <= 0 ? 1 : Math.min(1, (now - start) / durationMs);
    // Ease in-out for a softer Apple Music–like blend
    const eased = t * t * (3 - 2 * t);
    const vol = Math.round(clampedFrom + (clampedTo - clampedFrom) * eased);
    try {
      player.setVolume(vol);
    } catch {
      cancelled = true;
      return;
    }
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    }
  };

  raf = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    if (raf) cancelAnimationFrame(raf);
  };
}

export function safeSetVolume(player: YtPlayer | null | undefined, volume: number) {
  if (!player) return;
  try {
    player.unMute();
    player.setVolume(Math.max(0, Math.min(100, Math.round(volume))));
  } catch {
    /* ignore */
  }
}

/**
 * Soft-mix into the next YouTube video: fade out → load → fade in.
 * Closest practical match to Apple Music crossfade on embedded YouTube.
 */
export async function softMixToVideo(
  player: YtPlayer,
  videoId: string,
  opts?: {
    fadeOutMs?: number;
    fadeInMs?: number;
    /** Skip fade-out (e.g. user hit Next mid-track) and use a shorter dip */
    quick?: boolean;
  }
): Promise<void> {
  const fadeOutMs = opts?.quick ? 500 : (opts?.fadeOutMs ?? MIX_FADE_OUT_MS);
  const fadeInMs = opts?.fadeInMs ?? MIX_FADE_IN_MS;

  let currentVol = 100;
  try {
    currentVol = player.getVolume();
    if (!Number.isFinite(currentVol)) currentVol = 100;
  } catch {
    currentVol = 100;
  }

  await new Promise<void>((resolve) => {
    const cancel = fadeVolume(player, currentVol, 0, fadeOutMs);
    window.setTimeout(() => {
      cancel();
      resolve();
    }, fadeOutMs + 40);
  });

  try {
    player.loadVideoById({ videoId, startSeconds: 0 });
    player.setVolume(0);
    player.unMute();
    player.playVideo();
  } catch {
    try {
      player.loadVideoById(videoId);
      player.playVideo();
    } catch {
      /* give up gracefully */
    }
    return;
  }

  // Brief beat so play starts before we ramp volume
  await new Promise((r) => window.setTimeout(r, 120));
  await new Promise<void>((resolve) => {
    const cancel = fadeVolume(player, 0, 100, fadeInMs);
    window.setTimeout(() => {
      cancel();
      safeSetVolume(player, 100);
      resolve();
    }, fadeInMs + 40);
  });
}
