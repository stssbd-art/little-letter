"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { Field, PixelInput, PixelSelect, PixelTextarea } from "@/components/ui/PixelInput";
import { VoiceNoteRecorder } from "@/components/features/VoiceNoteRecorder";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { OCCASIONS, RELATIONSHIPS } from "@/lib/constants";
import { isOccasionSlug } from "@/lib/occasion-seo";
import {
  getLetterStationery,
  stationeryForOccasion,
  type LetterStationeryId,
} from "@/lib/letter-stationery";
import type { LetterWriteMode, Occasion } from "@/types";
import { cn } from "@/lib/utils";
import { StationeryPaper, StationerySwatch } from "@/components/features/StationeryPaper";

type Phase = "form" | "draft" | "flying";

export function MessageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { form, setForm, setLetter, letter } = useLetter();
  const { play } = useSound();
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState("");
  const restoredDraft = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const editingDetails = searchParams.get("edit") === "details";

  function scrollLetterIntoView() {
    const el = rootRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  useEffect(() => {
    const fromUrl = searchParams.get("occasion");
    if (fromUrl && isOccasionSlug(fromUrl) && form.occasion !== fromUrl) {
      setForm({ occasion: fromUrl });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefill once from landing page link
  }, [searchParams]);

  // If a draft letter already exists (e.g. browser back), show the letter box again.
  // Coming from Preview "Edit details" stays on the form so names/emails can change.
  useEffect(() => {
    if (editingDetails) {
      restoredDraft.current = true;
      return;
    }
    if (letter && !restoredDraft.current && phase === "form") {
      restoredDraft.current = true;
      setPhase("draft");
    }
  }, [letter, phase, editingDetails]);

  useEffect(() => {
    if (phase === "draft" || phase === "flying") {
      scrollLetterIntoView();
    }
  }, [phase]);

  const writeMode: LetterWriteMode = form.writeMode === "own" ? "own" : "ai";
  const selectedStationery = getLetterStationery(form.stationery);

  /* Keep AI voice in sync with the chosen look (old drafts may diverge). */
  useEffect(() => {
    if (form.style !== selectedStationery.writingStyle) {
      setForm({ style: selectedStationery.writingStyle });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when stationery id changes
  }, [form.stationery, selectedStationery.writingStyle]);

  function setWriteMode(mode: LetterWriteMode) {
    play("click");
    setForm({ writeMode: mode });
    setError("");
  }

  function formWithLookVoice() {
    return {
      ...form,
      stationery: selectedStationery.id,
      style: selectedStationery.writingStyle,
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    play("click");

    try {
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
          form: { ...formWithLookVoice(), writeMode: "own" },
          createdAt: letter?.createdAt || new Date().toISOString(),
        });
      } else if (letter) {
        setLetter({
          ...letter,
          form: { ...formWithLookVoice(), writeMode: "ai" },
        });
      } else {
        const payload = { ...formWithLookVoice(), writeMode: "ai" as const };
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Could not generate letter");
        }

        setLetter({
          subject: data.subject,
          message: data.message,
          form: payload,
          createdAt: new Date().toISOString(),
        });
      }

      play("sparkle");
      restoredDraft.current = true;
      setPhase("draft");
      setLoading(false);
      if (editingDetails) {
        router.replace("/create");
      }
    } catch (err) {
      setPhase("form");
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function regenerate() {
    if (!letter || writeMode === "own") return;
    setError("");
    setRegenerating(true);
    play("click");
    try {
      const payload = { ...formWithLookVoice(), writeMode: "ai" as const };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not regenerate");
      setLetter({
        ...letter,
        subject: data.subject,
        message: data.message,
        form: payload,
        createdAt: new Date().toISOString(),
      });
      play("sparkle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not regenerate");
    } finally {
      setRegenerating(false);
    }
  }

  async function goToPreview(fromLetter?: typeof letter) {
    const current = fromLetter ?? letter;
    if (!current) return;
    const subject = current.subject.trim();
    const message = current.message.trim();
    if (message.length < 8) {
      setError("Write a little more — at least a short note.");
      return;
    }
    if (!subject) {
      setError("Add a short subject for the letter.");
      return;
    }
    setError("");
    /* Keep the latest stationery choice on the letter before preview. */
    setLetter({
      ...current,
      subject,
      message,
      form: {
        ...current.form,
        ...formWithLookVoice(),
      },
    });
    play("click");
    setPhase("flying");
    play("whoosh");
    await new Promise((r) => setTimeout(r, 900));
    router.push("/preview");
  }

  return (
    <div ref={rootRef} className="scroll-mt-24 space-y-5">
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

              <div>
                <p className="mb-2 font-display text-sm text-[var(--ll-ink)]">
                  Look &amp; voice
                </p>
                <p className="mb-2 text-xs text-[var(--ll-muted)]">
                  {writeMode === "ai"
                    ? "One pick for paper look and writing tone."
                    : "Pick the paper look for your letter."}
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {stationeryForOccasion(form.occasion).map((s) => {
                    const selected =
                      (form.stationery ?? "classic-honey") === s.id;
                    return (
                      <StationerySwatch
                        key={s.id}
                        stationery={s}
                        selected={selected}
                        onSelect={() => {
                          play("click");
                          setForm({
                            stationery: s.id as LetterStationeryId,
                            style: s.writingStyle,
                          });
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-display text-sm text-[var(--ll-ink)]">
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
                      AI drafts a warm letter from your notes on the paper.
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
                      Your own words on the paper — no AI.
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 font-display text-sm text-[var(--ll-ink)]">
                  {writeMode === "ai" ? "Notes on your paper" : "Write on your paper"}
                </p>
                <p className="mb-2 text-xs text-[var(--ll-muted)]">
                  {writeMode === "ai" ? (
                    <>
                      Type details here — they show on the{" "}
                      <span className="capitalize text-[var(--ll-pink-deep)]">
                        {selectedStationery.writingStyle}
                      </span>{" "}
                      stationery and guide the letter.
                    </>
                  ) : (
                    "This is exactly what they’ll see on the letter."
                  )}
                </p>
                <StationeryPaper
                  stationery={selectedStationery}
                  compact
                  subject={
                    writeMode === "own"
                      ? undefined
                      : `For ${form.recipientName.trim() || "…"}`
                  }
                >
                  {writeMode === "ai" ? (
                    <>
                      <label htmlFor="customNote" className="sr-only">
                        Custom notes for the letter
                      </label>
                      <textarea
                        id="customNote"
                        value={form.customNote}
                        onChange={(e) => setForm({ customNote: e.target.value })}
                        placeholder="Mention their new kitten, the rainy walk, the joke only you two get…"
                        maxLength={500}
                        rows={5}
                        className={cn(
                          "w-full resize-y bg-transparent text-sm leading-relaxed outline-none",
                          "placeholder:opacity-55",
                          selectedStationery.fontClass
                        )}
                        style={{ color: selectedStationery.ink }}
                      />
                      <p
                        className="mt-3 text-right font-script text-base"
                        style={{ color: selectedStationery.accent }}
                      >
                        — {form.senderName.trim() || "with love"}
                      </p>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="ownSubject"
                          className="mb-1 block font-pixel text-[8px] tracking-wide"
                          style={{ color: selectedStationery.accent }}
                        >
                          Subject
                        </label>
                        <input
                          id="ownSubject"
                          value={form.ownSubject}
                          onChange={(e) =>
                            setForm({ ownSubject: e.target.value })
                          }
                          placeholder={`Hi ${form.recipientName.trim() || "there"}`}
                          maxLength={120}
                          className="w-full bg-transparent font-display text-sm font-semibold outline-none placeholder:opacity-50"
                          style={{ color: selectedStationery.accent }}
                        />
                      </div>
                      <div>
                        <label htmlFor="ownMessage" className="sr-only">
                          Your letter
                        </label>
                        <textarea
                          id="ownMessage"
                          required
                          value={form.ownMessage}
                          onChange={(e) =>
                            setForm({ ownMessage: e.target.value })
                          }
                          placeholder={`Dear ${form.recipientName.trim() || "friend"},\n\nI just wanted to say…\n\nLove,\n${form.senderName.trim() || "me"}`}
                          maxLength={4000}
                          rows={8}
                          className={cn(
                            "min-h-[180px] w-full resize-y bg-transparent text-sm leading-relaxed outline-none",
                            "placeholder:opacity-55",
                            selectedStationery.fontClass
                          )}
                          style={{ color: selectedStationery.ink }}
                        />
                      </div>
                      <p
                        className="text-right font-script text-base"
                        style={{ color: selectedStationery.accent }}
                      >
                        — {form.senderName.trim() || "you"}
                      </p>
                    </div>
                  )}
                </StationeryPaper>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 border-t-2 border-[var(--ll-lavender)]/60 pt-4">
                <PixelButton
                  type="button"
                  size="lg"
                  disabled={!letter || loading}
                  onClick={() => {
                    if (!letter) return;
                    play("click");
                    void goToPreview(letter);
                  }}
                >
                  Next →
                </PixelButton>
                <PixelButton
                  type="submit"
                  size="lg"
                  disabled={loading}
                >
                  {loading
                    ? writeMode === "own"
                      ? "Preparing…"
                      : letter
                        ? "Saving…"
                        : "Writing…"
                    : writeMode === "own"
                      ? "✉️ Put in letter box"
                      : letter
                        ? "💾 Keep letter & save details"
                        : "✨ Generate Little Letter"}
                </PixelButton>
              </div>
            </motion.form>
          ) : phase === "flying" ? (
            <motion.div
              key="flying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-[280px] flex-col items-center justify-center gap-4 py-8"
            >
              <motion.div
                animate={{
                  x: [0, 40, 180],
                  y: [0, -30, -120],
                  rotate: [0, -20, -45],
                  opacity: [1, 1, 0],
                  scale: [1, 0.9, 0.5],
                }}
                transition={{ duration: 0.9 }}
                className="text-6xl"
                aria-hidden
              >
                ✉️
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
                Your letter is flying to the preview desk...
              </p>
            </motion.div>
          ) : letter ? (
            <motion.div
              key="draft"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div>
                <p className="font-display text-sm text-[var(--ll-ink)]">
                  Your letter
                </p>
                <p className="mt-1 text-xs text-[var(--ll-muted)]">
                  Edit anything you like — shown on your chosen stationery.
                  Then continue to the envelope.
                </p>
              </div>

              <StationeryPaper
                stationery={getLetterStationery(
                  letter.form.stationery ?? form.stationery
                )}
                compact
              >
                <Field label="Subject" htmlFor="draftSubject">
                  <PixelInput
                    id="draftSubject"
                    value={letter.subject}
                    onChange={(e) =>
                      setLetter({ ...letter, subject: e.target.value })
                    }
                    maxLength={120}
                    className="border-black/10 bg-white/70 font-display text-sm leading-snug dark:bg-black/20"
                  />
                </Field>
                <Field
                  label="Letter"
                  htmlFor="draftMessage"
                  className="mt-3"
                  hint="This is what they’ll read."
                >
                  <PixelTextarea
                    id="draftMessage"
                    value={letter.message}
                    onChange={(e) =>
                      setLetter({ ...letter, message: e.target.value })
                    }
                    maxLength={4000}
                    className="min-h-[240px] border-black/10 bg-white/70 font-display text-base leading-relaxed dark:bg-black/20"
                  />
                </Field>
              </StationeryPaper>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <PixelButton
                  size="lg"
                  type="button"
                  onClick={() => void goToPreview()}
                >
                  Next →
                </PixelButton>
                <PixelButton
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    play("click");
                    setError("");
                    setPhase("form");
                  }}
                >
                  ← Change details
                </PixelButton>
                {writeMode === "ai" ? (
                  <PixelButton
                    variant="secondary"
                    type="button"
                    disabled={regenerating}
                    onClick={() => void regenerate()}
                  >
                    {regenerating ? "Rewriting…" : "✨ Regenerate"}
                  </PixelButton>
                ) : null}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 py-6 text-center"
            >
              <p className="font-display text-[var(--ll-ink)]">
                Your letter draft isn&apos;t ready yet.
              </p>
              <PixelButton
                type="button"
                onClick={() => {
                  play("click");
                  setPhase("form");
                }}
              >
                ← Back to write
              </PixelButton>
            </motion.div>
          )}
        </AnimatePresence>
      </PixelWindow>

      {phase === "form" || phase === "draft" ? (
        <VoiceNoteRecorder kind="letter" />
      ) : null}
    </div>
  );
}
