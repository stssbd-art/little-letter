"use client";

import { useEffect, useState } from "react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { STORAGE_KEYS, VISITOR_BASELINE } from "@/lib/constants";

const SESSION_FLAG = "little-letter-visit-counted";

function parseVisitorCount(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < VISITOR_BASELINE) return VISITOR_BASELINE;
  return n;
}

export function VisitorCounter() {
  const [count, setCount] = useState(VISITOR_BASELINE);

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
        const data = (await res.json()) as { count?: unknown };
        const next = parseVisitorCount(data.count);
        if (!cancelled) {
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
            setCount(parseVisitorCount(raw));
          } catch {
            setCount(VISITOR_BASELINE);
          }
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const display = count.toString().padStart(8, "0");

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
              {digit}
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
