"use client";

import { useEffect, useRef } from "react";
import { playWelcomeAmbience } from "@/lib/sounds";
import { STORAGE_KEYS } from "@/lib/constants";

/**
 * Soft welcome chime once per visit on the first tap/key.
 * Browsers block autoplay until a gesture. Skipped if sound was
 * explicitly muted in a previous visit.
 */
export function WelcomeAmbience() {
  const armedRef = useRef(false);

  useEffect(() => {
    if (armedRef.current) return;
    armedRef.current = true;

    const onGesture = () => {
      let explicitlyMuted = false;
      try {
        explicitlyMuted =
          localStorage.getItem(STORAGE_KEYS.soundMuted) === "true";
      } catch {
        explicitlyMuted = false;
      }
      if (!explicitlyMuted) {
        playWelcomeAmbience(false);
      }
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };

    window.addEventListener("pointerdown", onGesture, { once: true });
    window.addEventListener("keydown", onGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, []);

  return null;
}
