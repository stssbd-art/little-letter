"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelInput } from "@/components/ui/PixelInput";
import { MIX_TRACKS, youtubeTrackId, type MixTrack } from "@/lib/tracks";
import { cn } from "@/lib/utils";

type Hit = {
  youtubeId: string;
  title: string;
  artist: string;
  catalogId?: string;
};

type Props = {
  selectedIds: string[];
  full: boolean;
  onAdd: (track: MixTrack) => void;
  /** Button / status labels for different pages */
  addLabel?: string;
  selectedLabel?: string;
  fullLabel?: string;
  inputId?: string;
  className?: string;
};

export function YouTubeSongSearch({
  selectedIds,
  full,
  onAdd,
  addLabel = "add",
  selectedLabel = "on tape",
  fullLabel = "full",
  inputId = "yt-search",
  className,
}: Props) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  async function search() {
    const q = query.trim();
    if (q.length < 2) {
      setError("Type a song name or paste a YouTube link.");
      return;
    }

    setSearching(true);
    setError("");
    setHint("");

    const catalogHits: Hit[] = MIX_TRACKS.filter((t) => {
      const blob = `${t.title} ${t.artist}`.toLowerCase();
      return blob.includes(q.toLowerCase());
    }).map((t) => ({
      youtubeId: t.youtubeId,
      title: t.title,
      artist: t.artist,
      catalogId: t.id,
    }));

    try {
      const res = await fetch(`/api/youtube-search?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as {
        results?: Hit[];
        hint?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Search failed");

      const seen = new Set(catalogHits.map((h) => h.youtubeId));
      const youtubeHits = (data.results ?? []).filter((h) => {
        if (seen.has(h.youtubeId)) return false;
        seen.add(h.youtubeId);
        return true;
      });

      const next = [...catalogHits, ...youtubeHits].slice(0, 10);
      setHits(next);
      if (!next.length) {
        setHint(
          data.hint ||
            "No songs found. Try another name, or paste a YouTube link."
        );
      }
    } catch (err) {
      setHits(catalogHits);
      if (!catalogHits.length) {
        setError(err instanceof Error ? err.message : "Search failed");
      }
    } finally {
      setSearching(false);
    }
  }

  function addHit(hit: Hit) {
    if (full) return;
    if (hit.catalogId) {
      onAdd(MIX_TRACKS.find((t) => t.id === hit.catalogId)!);
      return;
    }
    const id = youtubeTrackId(hit.youtubeId);
    onAdd({
      id,
      title: hit.title,
      artist: hit.artist,
      year: "",
      youtubeId: hit.youtubeId,
    });
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={inputId} className="sr-only">
        Search YouTube or paste a link
      </label>
      <div className="flex flex-wrap gap-2">
        <PixelInput
          id={inputId}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search YouTube or paste a link"
          maxLength={80}
          className="min-w-0 flex-1"
          aria-label="Search YouTube or paste a link"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void search();
            }
          }}
        />
        <PixelButton
          type="button"
          variant="secondary"
          size="sm"
          disabled={searching}
          onClick={() => void search()}
        >
          {searching ? "Searching…" : "Search YouTube"}
        </PixelButton>
      </div>

      {error ? (
        <p className="text-xs text-rose-700" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-[var(--ll-muted)]">{hint}</p>
      ) : null}

      <AnimatePresence>
        {hits.length ? (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-h-48 space-y-1 overflow-y-auto rounded-xl border-2 border-[var(--ll-lavender)] bg-white/70 p-2 dark:bg-white/5"
          >
            {hits.map((hit) => {
              const id = hit.catalogId ?? youtubeTrackId(hit.youtubeId);
              const on = selectedIds.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    disabled={on || full}
                    onClick={() => addHit(hit)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left",
                      on
                        ? "bg-[#fff6df] text-[var(--ll-ink)]"
                        : "hover:bg-white/80 dark:hover:bg-white/10"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-sm text-[var(--ll-ink)]">
                        {hit.title}
                      </span>
                      <span className="block truncate font-pixel text-[7px] text-[var(--ll-muted)]">
                        {hit.artist}
                        {hit.catalogId ? " · crate" : " · YouTube"}
                      </span>
                    </span>
                    <span className="shrink-0 font-pixel text-[8px] text-[var(--ll-muted)]">
                      {on ? selectedLabel : full ? fullLabel : addLabel}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
