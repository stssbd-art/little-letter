"use client";

import { useEffect, useState } from "react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { STORAGE_KEYS } from "@/lib/constants";

const SESSION_FLAG = "little-letter-visit-counted";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const alreadyCounted = sessionStorage.getItem(SESSION_FLAG) === "1";
        if (!alreadyCounted) {
          // Mark first so React Strict Mode remounts don't double-count
          sessionStorage.setItem(SESSION_FLAG, "1");
        }
        const res = await fetch("/api/visitors", {
          method: alreadyCounted ? "GET" : "POST",
          cache: "no-store",
        });
        const data = (await res.json()) as { count?: number };
        const next =
          typeof data.count === "number" && Number.isFinite(data.count)
            ? Math.max(1, Math.floor(data.count))
            : null;
        if (!cancelled && next !== null) {
          setCount(next);
          try {
            localStorage.setItem(STORAGE_KEYS.visitorCount, String(next));
          } catch {
            /* ignore */
          }
        }
      } catch {
        if (!cancelled) {
          try {
            const raw = localStorage.getItem(STORAGE_KEYS.visitorCount);
            const fallback = raw ? Number(raw) : 12847;
            setCount(
              Number.isFinite(fallback) && fallback > 0 ? fallback : 12847
            );
          } catch {
            setCount(12847);
          }
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
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
          Live count · updates when someone visits
        </p>
      </div>
    </PixelWindow>
  );
}
