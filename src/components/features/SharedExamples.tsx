"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelWindow } from "@/components/ui/PixelWindow";
import type { SharedExample } from "@/types";
import { formatDate } from "@/lib/utils";

export function SharedExamples() {
  const [entries, setEntries] = useState<SharedExample[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/shared-examples");
        const data = (await res.json()) as { entries?: SharedExample[] };
        if (res.ok) setEntries(data.entries ?? []);
      } catch {
        /* leave empty */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PixelWindow title="the_wall.txt" icon="🧱">
      <p className="font-display text-sm text-[var(--ll-ink)]">
        Short peeks from letters and mixtapes people chose to share — never
        emails or the full private message.
      </p>
      <p className="mt-1 text-xs text-[var(--ll-muted)]">
        When you send, tick “Share a short preview on The Wall.”
      </p>

      {loading ? (
        <p className="mt-4 font-pixel text-[8px] text-[var(--ll-muted)]">
          Opening the scrapbook…
        </p>
      ) : entries.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--ll-muted)]">
          No examples yet — yours could be the first.
        </p>
      ) : (
        <ul className="mt-5 max-h-96 space-y-3 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border-2 border-[var(--ll-lavender)] bg-white/70 p-3 dark:bg-white/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-sm border border-[#8b5e34]/40 bg-[#fff6df] px-1.5 py-0.5 font-pixel text-[7px] text-[#8b5e34] dark:bg-[#3d2f22] dark:text-[#e6c98a]">
                      {entry.kind === "mixtape" ? "📼 MIX" : "💌 LETTER"}
                    </span>
                    <p className="font-display text-sm text-[var(--ll-ink)]">
                      {entry.fromName} → {entry.toName}
                    </p>
                  </div>
                  <time className="text-[10px] text-[var(--ll-muted)]">
                    {formatDate(entry.createdAt)}
                  </time>
                </div>
                <p className="mt-1.5 font-pixel text-[8px] tracking-wide text-[var(--ll-pink-deep)]">
                  {entry.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--ll-muted)]">
                  “{entry.snippet}”
                </p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </PixelWindow>
  );
}
