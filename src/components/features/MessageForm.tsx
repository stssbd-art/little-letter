"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { Field, PixelInput, PixelSelect, PixelTextarea } from "@/components/ui/PixelInput";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { OCCASIONS, RELATIONSHIPS, STYLES } from "@/lib/constants";
import type { LetterWriteMode, MessageStyle, Occasion } from "@/types";
import { cn } from "@/lib/utils";

export function MessageForm() {
  const router = useRouter();
  const { form, setForm, setLetter } = useLetter();
  const { play } = useSound();
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"form" | "closing" | "flying">("form");
  const [error, setError] = useState("");

  const writeMode: LetterWriteMode = form.writeMode === "own" ? "own" : "ai";

  function setWriteMode(mode: LetterWriteMode) {
    play("click");
    setForm({ writeMode: mode });
    setError("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    play("click");
    setPhase("closing");

    try {
      await new Promise((r) => setTimeout(r, 700));
      setPhase("flying");
      play("whoosh");

      if (writeMode === "own") {
        const message = form.ownMessage.trim();
        if (message.length < 8) {
          throw new Error("Write a little more — at least a short note.");
        }
        if (message.length > 4000) {
          throw new Error("Letter is a bit long — keep it under 4000 characters.");
        }
        const subject =
          form.ownSubject.trim() ||
          `Hi ${form.recipientName.trim() || "there"}`;

        setLetter({
          subject,
          message,
          form: { ...form, writeMode: "own" },
          createdAt: new Date().toISOString(),
        });
      } else {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, writeMode: "ai" }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Could not generate letter");
        }

        setLetter({
          subject: data.subject,
          message: data.message,
          form: { ...form, writeMode: "ai" },
          createdAt: new Date().toISOString(),
        });
      }

      await new Promise((r) => setTimeout(r, 900));
      play("sparkle");
      router.push("/preview");
    } catch (err) {
      setPhase("form");
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <PixelWindow title="create_message.exe" icon="✍️" liftOnHover={false}>
      <AnimatePresence mode="wait">
        {phase === "form" ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onSubmit={onSubmit}
            className="space-y-5"
          >
            <div>
              <p className="mb-2 font-display text-sm text-[var(--ll-ink)]">
                How do you want to write it?
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setWriteMode("ai")}
                  className={cn(
                    "rounded-xl border-2 px-3 py-3 text-left transition",
                    writeMode === "ai"
                      ? "border-[var(--ll-pink-deep)] bg-[#fff6df] shadow-[3px_3px_0_var(--ll-lavender-shadow)]"
                      : "border-[var(--ll-lavender)] bg-white/60 hover:border-[var(--ll-pink-deep)] dark:bg-white/5"
                  )}
                >
                  <p className="font-display text-sm text-[var(--ll-ink)]">
                    ✨ Help me write it
                  </p>
                  <p className="mt-1 text-xs text-[var(--ll-muted)]">
                    Pick a style — we draft a warm letter you can send.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setWriteMode("own")}
                  className={cn(
                    "rounded-xl border-2 px-3 py-3 text-left transition",
                    writeMode === "own"
                      ? "border-[var(--ll-pink-deep)] bg-[#fff6df] shadow-[3px_3px_0_var(--ll-lavender-shadow)]"
                      : "border-[var(--ll-lavender)] bg-white/60 hover:border-[var(--ll-pink-deep)] dark:bg-white/5"
                  )}
                >
                  <p className="font-display text-sm text-[var(--ll-ink)]">
                    ✍️ I&apos;ll write it myself
                  </p>
                  <p className="mt-1 text-xs text-[var(--ll-muted)]">
                    Simple subject + your own words — no AI.
                  </p>
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Recipient name" htmlFor="recipientName">
                <PixelInput
                  id="recipientName"
                  required
                  value={form.recipientName}
                  onChange={(e) => setForm({ recipientName: e.target.value })}
                  placeholder="Sam"
                />
              </Field>
              <Field label="Recipient email" htmlFor="recipientEmail">
                <PixelInput
                  id="recipientEmail"
                  type="email"
                  required
                  value={form.recipientEmail}
                  onChange={(e) => setForm({ recipientEmail: e.target.value })}
                  placeholder="sam@example.com"
                />
              </Field>
              <Field label="Your name" htmlFor="senderName">
                <PixelInput
                  id="senderName"
                  required
                  value={form.senderName}
                  onChange={(e) => setForm({ senderName: e.target.value })}
                  placeholder="Alex"
                />
              </Field>
              <Field
                label="Your email"
                htmlFor="senderEmail"
                hint="Tracks your free sends — not shown to the recipient"
              >
                <PixelInput
                  id="senderEmail"
                  type="email"
                  required
                  value={form.senderEmail}
                  onChange={(e) => setForm({ senderEmail: e.target.value })}
                  placeholder="you@email.com"
                />
              </Field>
              <Field label="Relationship" htmlFor="relationship">
                <PixelSelect
                  id="relationship"
                  value={form.relationship}
                  onChange={(e) =>
                    setForm({
                      relationship: e.target.value as typeof form.relationship,
                    })
                  }
                >
                  {RELATIONSHIPS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </PixelSelect>
              </Field>
            </div>

            <div>
              <p className="mb-2 font-display text-sm text-[var(--ll-ink)]">
                Occasion
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {OCCASIONS.map((o) => (
                  <PixelCard
                    key={o.value}
                    as="button"
                    selected={form.occasion === o.value}
                    onClick={() => {
                      play("click");
                      setForm({ occasion: o.value as Occasion });
                    }}
                    className="flex flex-col items-center gap-1 py-3"
                  >
                    <span className="text-xl">{o.emoji}</span>
                    <span className="text-center font-display text-xs">
                      {o.label}
                    </span>
                  </PixelCard>
                ))}
              </div>
            </div>

            {writeMode === "ai" ? (
              <>
                <div>
                  <p className="mb-2 font-display text-sm text-[var(--ll-ink)]">
                    Style
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {STYLES.map((s) => (
                      <PixelCard
                        key={s.value}
                        as="button"
                        selected={form.style === s.value}
                        onClick={() => {
                          play("click");
                          setForm({ style: s.value as MessageStyle });
                        }}
                      >
                        <p className="font-display text-sm text-[var(--ll-ink)]">
                          {s.label}
                        </p>
                        <p className="mt-1 text-xs text-[var(--ll-muted)]">
                          {s.description}
                        </p>
                      </PixelCard>
                    ))}
                  </div>
                </div>

                <Field
                  label="Custom notes (optional)"
                  htmlFor="customNote"
                  hint="Little details make the magic personal."
                >
                  <PixelTextarea
                    id="customNote"
                    value={form.customNote}
                    onChange={(e) => setForm({ customNote: e.target.value })}
                    placeholder="Mention their new kitten, the rainy walk, the joke only you two get..."
                    maxLength={500}
                  />
                </Field>
              </>
            ) : (
              <>
                <Field
                  label="Subject"
                  htmlFor="ownSubject"
                  hint="Optional — defaults to “Hi [their name]”."
                >
                  <PixelInput
                    id="ownSubject"
                    value={form.ownSubject}
                    onChange={(e) => setForm({ ownSubject: e.target.value })}
                    placeholder={`Hi ${form.recipientName.trim() || "there"}`}
                    maxLength={120}
                  />
                </Field>
                <Field
                  label="Your letter"
                  htmlFor="ownMessage"
                  hint="Write naturally — this is what they’ll read."
                >
                  <PixelTextarea
                    id="ownMessage"
                    required
                    value={form.ownMessage}
                    onChange={(e) => setForm({ ownMessage: e.target.value })}
                    placeholder={`Dear ${form.recipientName.trim() || "friend"},\n\nI just wanted to say…\n\nLove,\n${form.senderName.trim() || "me"}`}
                    maxLength={4000}
                    className="min-h-[220px]"
                  />
                </Field>
              </>
            )}

            {error ? (
              <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">
                {error}
              </p>
            ) : null}

            <PixelButton
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {writeMode === "own"
                ? "💌 Preview my letter"
                : "✨ Generate Little Letter"}
            </PixelButton>
          </motion.form>
        ) : (
          <motion.div
            key="anim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[280px] flex-col items-center justify-center gap-4 py-8"
          >
            <motion.div
              animate={
                phase === "closing"
                  ? { scaleY: [1, 0.2, 0.2], rotate: [0, 0, -8] }
                  : {
                      x: [0, 40, 180],
                      y: [0, -30, -120],
                      rotate: [0, -20, -45],
                      opacity: [1, 1, 0],
                      scale: [1, 0.9, 0.5],
                    }
              }
              transition={{ duration: phase === "closing" ? 0.7 : 0.9 }}
              className="text-6xl"
              aria-hidden
            >
              💌
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 text-xl"
              aria-hidden
            >
              ✨ ⭐ ✨
            </motion.div>
            <p className="font-display text-[var(--ll-ink)]">
              {phase === "closing"
                ? "Sealing your envelope..."
                : "Your letter is flying to the preview desk..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </PixelWindow>
  );
}
