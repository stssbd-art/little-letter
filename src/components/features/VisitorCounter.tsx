"use client";

import { useEffect, useState } from "react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { STORAGE_KEYS } from "@/lib/constants";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.visitorCount);
    let next = raw ? Number(raw) : 12847 + Math.floor(Math.random() * 400);
    if (!Number.isFinite(next) || next < 1000) next = 12847;
    next += 1;
    localStorage.setItem(STORAGE_KEYS.visitorCount, String(next));
    setCount(next);
  }, []);

  const display = (count ?? 0).toString().padStart(8, "0");

  return (
    <PixelWindow title="visitor_counter.gif" icon="👁️" liftOnHover={false}>
      <div className="flex flex-col items-center gap-2">
        <p className="font-pixel text-[10px] text-[var(--ll-muted)]">
          You are visitor number
        </p>
        <div
          className="flex gap-1 rounded-lg border-2 border-[var(--ll-ink)] bg-[#111827] px-2 py-2 font-pixel text-sm tracking-[0.2em] text-[#86efac] shadow-inner"
          aria-live="polite"
        >
          {display.split("").map((digit, i) => (
            <span
              key={i}
              className="inline-flex h-7 w-5 items-center justify-center rounded-sm bg-[#1f2937]"
            >
              {count === null ? "–" : digit}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-[var(--ll-muted)]">
          (slightly magical counting · GeoCities approved)
        </p>
      </div>
    </PixelWindow>
  );
}
