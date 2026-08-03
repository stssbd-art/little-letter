"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { OCCASIONS } from "@/lib/constants";

export function LetterPreview() {
  const router = useRouter();
  const { letter, setLetter } = useLetter();
  const { play } = useSound();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!letter) {
    return (
      <PixelWindow title="preview.error" icon="⚠️">
        <p className="text-[var(--ll-ink)]">
          No letter found yet. Create one first!
        </p>
        <PixelButton className="mt-4" onClick={() => router.push("/create")}>
          Create a letter
        </PixelButton>
      </PixelWindow>
    );
  }

  const occasion = OCCASIONS.find((o) => o.value === letter.form.occasion);

  async function send() {
    setSending(true);
    setError("");
    play("whoosh");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(letter),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#fda4af", "#c4b5fd", "#86efac", "#93c5fd", "#fde68a"],
      });
      play("success");
      router.push("/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send letter");
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <PixelWindow title="letter_preview.rtf" icon="📬" liftOnHover={false}>
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="relative w-full max-w-md cursor-pointer border-0 bg-transparent"
            onClick={() => {
              play("click");
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-label={open ? "Close letter" : "Open letter"}
          >
            <motion.div
              className="mx-auto flex h-40 w-full max-w-sm items-end justify-center rounded-2xl border-4 border-[var(--ll-pink-deep)] bg-gradient-to-b from-[#ffd6e8] to-[#ffc1d8] shadow-[6px_6px_0_var(--ll-pink-shadow)]"
              animate={{ rotateX: open ? -18 : 0 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-l-[140px] border-r-[140px] border-t-[70px] border-l-transparent border-r-transparent border-t-[var(--ll-pink)] origin-top"
                animate={{ rotateX: open ? 160 : 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
              />
              <span className="relative z-10 mb-6 text-4xl">
                {occasion?.emoji ?? "💌"}
              </span>
            </motion.div>
            <p className="mt-3 text-center text-sm text-[var(--ll-muted)]">
              {open ? "Tap to fold closed" : "Tap the envelope to open"}
            </p>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: open ? "auto" : 0,
              opacity: open ? 1 : 0,
              y: open ? 0 : -12,
            }}
            className="w-full overflow-hidden"
          >
            <article className="mt-6 rounded-2xl border-2 border-[var(--ll-lavender)] bg-white/90 p-5 dark:bg-white/10">
              <p className="font-pixel text-[10px] text-[var(--ll-pink-deep)]">
                {letter.subject}
              </p>
              <p className="mt-1 text-xs text-[var(--ll-muted)]">
                To: {letter.form.recipientName} &lt;{letter.form.recipientEmail}
                &gt;
              </p>
              <div className="mt-4 whitespace-pre-wrap font-display text-base leading-relaxed text-[var(--ll-ink)]">
                {letter.message}
              </div>
            </article>
          </motion.div>
        </div>
      </PixelWindow>

      {error ? (
        <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <PixelButton
          variant="ghost"
          onClick={() => {
            setLetter(null);
            router.push("/create");
          }}
        >
          ← Edit details
        </PixelButton>
        <PixelButton
          variant="secondary"
          onClick={async () => {
            play("click");
            setSending(true);
            try {
              const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(letter.form),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error);
              setLetter({
                ...letter,
                subject: data.subject,
                message: data.message,
                createdAt: new Date().toISOString(),
              });
              setOpen(true);
              play("sparkle");
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Could not regenerate"
              );
            } finally {
              setSending(false);
            }
          }}
          disabled={sending}
        >
          ✨ Regenerate
        </PixelButton>
        <PixelButton size="lg" onClick={send} disabled={sending || !open}>
          {sending ? "Sending..." : "💌 Send Little Letter"}
        </PixelButton>
      </div>
      {!open ? (
        <p className="text-xs text-[var(--ll-muted)]">
          Open the envelope to read before sending.
        </p>
      ) : null}
    </div>
  );
}
