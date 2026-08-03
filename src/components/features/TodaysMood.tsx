"use client";

import { useEffect, useState } from "react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelCard } from "@/components/ui/PixelCard";
import { MOODS, STORAGE_KEYS } from "@/lib/constants";
import { useSound } from "@/components/providers/SoundProvider";

export function TodaysMood() {
  const { play } = useSound();
  const [mood, setMood] = useState<(typeof MOODS)[number] | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.mood);
    if (!raw) return;
    try {
      setMood(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  return (
    <PixelWindow title="todays_mood.ini" icon="🌈">
      <p className="mb-3 text-sm text-[var(--ll-muted)]">
        How is your heart feeling today?
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MOODS.map((m) => (
          <PixelCard
            key={m.label}
            as="button"
            selected={mood?.label === m.label}
            onClick={() => {
              play("click");
              setMood(m);
              localStorage.setItem(STORAGE_KEYS.mood, JSON.stringify(m));
            }}
            className="flex flex-col items-center gap-1 py-3"
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="font-display text-xs">{m.label}</span>
          </PixelCard>
        ))}
      </div>
      {mood ? (
        <p className="mt-3 text-center text-sm text-[var(--ll-ink)]">
          Today’s mood: {mood.emoji} {mood.label}
        </p>
      ) : null}
    </PixelWindow>
  );
}
