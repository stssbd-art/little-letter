"use client";

import { useMemo } from "react";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { DAILY_QUOTES } from "@/lib/quotes";

export function DailyQuote() {
  const quote = useMemo(() => {
    const day = Math.floor(Date.now() / 86_400_000);
    return DAILY_QUOTES[day % DAILY_QUOTES.length]!;
  }, []);

  return (
    <PixelWindow title="daily_quote.txt" icon="✨" liftOnHover>
      <p className="font-display text-lg leading-relaxed text-[var(--ll-ink)]">
        “{quote}”
      </p>
      <p className="mt-3 text-xs text-[var(--ll-muted)]">Today’s little inspiration</p>
    </PixelWindow>
  );
}
