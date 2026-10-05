"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { playSound } from "@/lib/sounds";

type SoundName = "click" | "sparkle" | "success" | "whoosh";

interface SoundContextValue {
  muted: boolean;
  toggleMute: () => void;
  play: (name: SoundName) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.soundMuted);
    setMuted(stored === null ? true : stored === "true");
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.soundMuted, String(next));
      return next;
    });
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      playSound(name, muted);
    },
    [muted]
  );

  return (
    <SoundContext.Provider value={{ muted, toggleMute, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
