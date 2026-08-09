"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { Field, PixelInput, PixelTextarea } from "@/components/ui/PixelInput";
import type { GuestbookEntry } from "@/types";
import { formatDate } from "@/lib/utils";
import { useSound } from "@/components/providers/SoundProvider";

const EMOJI_OPTIONS = ["💌", "⭐", "🦋", "☁️", "🍀", "🌈", "🎮", "✨"];

export function Guestbook() {
  const { play } = useSound();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("💌");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/guestbook");
    const data = (await res.json()) as { entries: GuestbookEntry[] };
    setEntries(data.entries);
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    play("click");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, emoji }),
      });
      const data = (await res.json()) as { error?: string; entries?: GuestbookEntry[] };
      if (!res.ok) {
        setError(data.error ?? "Could not sign guestbook");
        return;
      }
      setEntries(data.entries ?? []);
      setName("");
      setMessage("");
      play("success");
    } catch {
      setError("Something went sideways — try again?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PixelWindow title="guestbook.html" icon="📝">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Your name" htmlFor="gb-name">
          <PixelInput
            id="gb-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            required
            placeholder="Pip"
          />
        </Field>
        <Field label="Your message" htmlFor="gb-message">
          <PixelTextarea
            id="gb-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            required
            placeholder="This site made me smile..."
          />
        </Field>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pick an emoji">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              role="radio"
              aria-checked={emoji === e}
              className={`rounded-lg border-2 px-2 py-1 text-lg ${
                emoji === e
                  ? "border-[var(--ll-pink-deep)] bg-[var(--ll-pink-soft)]"
                  : "border-transparent bg-white/50 dark:bg-white/5"
              }`}
              onClick={() => {
                play("click");
                setEmoji(e);
              }}
            >
              {e}
            </button>
          ))}
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <PixelButton type="submit" disabled={loading}>
          {loading ? "Signing..." : "Sign guestbook ✍️"}
        </PixelButton>
      </form>

      <ul className="mt-6 max-h-72 space-y-3 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border-2 border-[var(--ll-lavender)] bg-white/70 p-3 dark:bg-white/5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-sm text-[var(--ll-ink)]">
                  {entry.emoji} {entry.name}
                </p>
                <time className="text-[10px] text-[var(--ll-muted)]">
                  {formatDate(entry.createdAt)}
                </time>
              </div>
              <p className="mt-1 text-sm text-[var(--ll-muted)]">{entry.message}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </PixelWindow>
  );
}
