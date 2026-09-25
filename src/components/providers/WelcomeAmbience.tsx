"use client";

import { useEffect, useRef } from "react";
import { playWelcomeAmbience } from "@/lib/sounds";
import { STORAGE_KEYS } from "@/lib/constants";

/**
 * Soft welcome music once per visit.
 * Browsers block autoplay — plays on first tap/key (and keeps listening
 * until AudioContext actually starts, so a blocked attempt can retry).
 */
export function WelcomeAmbience() {
  const doneRef = useRef(false);

  useEffect(() => {
    const tryPlay = () => {
      if (doneRef.current) return;

      let explicitlyMuted = false;
      try {
        explicitlyMuted =
          localStorage.getItem(STORAGE_KEYS.soundMuted) === "true";
      } catch {
        explicitlyMuted = false;
      }
      if (explicitlyMuted) {
        doneRef.current = true;
        cleanup();
        return;
      }

      void playWelcomeAmbience(false).then((played) => {
        if (played) {
          doneRef.current = true;
          cleanup();
        }
      });
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
    };

    window.addEventListener("pointerdown", tryPlay);
    window.addEventListener("keydown", tryPlay);
    window.addEventListener("touchstart", tryPlay, { passive: true });

    return cleanup;
  }, []);

  return null;
}
