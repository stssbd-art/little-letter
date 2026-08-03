"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface EasterEggContextValue {
  starsBurst: number;
  petalBurst: number;
  butterflyFollow: boolean;
  emojiRain: boolean;
  triggerStars: () => void;
  triggerPetals: () => void;
  toggleButterflyFollow: () => void;
  triggerEmojiRain: () => void;
  clearEmojiRain: () => void;
}

const EasterEggContext = createContext<EasterEggContextValue | null>(null);

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [starsBurst, setStarsBurst] = useState(0);
  const [petalBurst, setPetalBurst] = useState(0);
  const [butterflyFollow, setButterflyFollow] = useState(false);
  const [emojiRain, setEmojiRain] = useState(false);

  const triggerStars = useCallback(() => setStarsBurst((n) => n + 1), []);
  const triggerPetals = useCallback(() => setPetalBurst((n) => n + 1), []);
  const toggleButterflyFollow = useCallback(
    () => setButterflyFollow((v) => !v),
    []
  );
  const triggerEmojiRain = useCallback(() => {
    setEmojiRain(true);
    window.setTimeout(() => setEmojiRain(false), 4000);
  }, []);
  const clearEmojiRain = useCallback(() => setEmojiRain(false), []);

  const value = useMemo(
    () => ({
      starsBurst,
      petalBurst,
      butterflyFollow,
      emojiRain,
      triggerStars,
      triggerPetals,
      toggleButterflyFollow,
      triggerEmojiRain,
      clearEmojiRain,
    }),
    [
      starsBurst,
      petalBurst,
      butterflyFollow,
      emojiRain,
      triggerStars,
      triggerPetals,
      toggleButterflyFollow,
      triggerEmojiRain,
      clearEmojiRain,
    ]
  );

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  );
}

export function useEasterEggs() {
  const ctx = useContext(EasterEggContext);
  if (!ctx) throw new Error("useEasterEggs must be used within EasterEggProvider");
  return ctx;
}
