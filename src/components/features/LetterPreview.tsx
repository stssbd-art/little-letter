"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { OCCASIONS } from "@/lib/constants";

type UsageInfo = {
  freeAvailable: boolean;
  credits: number;
  canSend: boolean;
  price: string;
};

export function LetterPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { letter, setLetter } = useLetter();
  const { play } = useSound();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [needsPayment, setNeedsPayment] = useState(false);

  async function refreshUsage() {
    const res = await fetch("/api/usage");
    const data = (await res.json()) as UsageInfo;
    if (res.ok) {
      setUsage(data);
      setNeedsPayment(!data.canSend);
    }
  }

  useEffect(() => {
    void refreshUsage();
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const paid = searchParams.get("paid");
    const cancelled = searchParams.get("cancelled");

    if (cancelled) {
      setError("Payment cancelled. Your first letter is free; extras are £0.50.");
      return;
    }

    if (paid && sessionId && letter) {
      void (async () => {
        setPaying(true);
        setError("");
        try {
          const verify = await fetch("/api/usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const verifyData = await verify.json();
          if (!verify.ok) {
            throw new Error(verifyData.error ?? "Could not verify payment");
          }
          await refreshUsage();
          await sendLetter();
          router.replace("/preview");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Payment verify failed");
          setPaying(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run on Stripe return
  }, [searchParams, letter]);

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

  async function sendLetter() {
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

      if (res.status === 402) {
        setNeedsPayment(true);
        setError(data.error ?? "Payment required for extra letters.");
        setSending(false);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Failed to send");

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#f6d58a", "#cbb892", "#c5d4a0", "#e8b86d", "#8b5e34"],
      });
      play("success");
      router.push("/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send letter");
      setSending(false);
    }
  }

  async function startPayment() {
    setPaying(true);
    setError("");
    play("click");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnPath: "/preview" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start payment");
      window.location.href = data.url as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  const priceLabel = usage?.price ?? "£0.50";
  const freeLeft = usage?.freeAvailable ?? true;

  return (
    <div className="space-y-6">
      <PixelWindow title="pricing.ini" icon="💷" liftOnHover={false}>
        <p className="font-display text-sm text-[var(--ll-ink)]">
          {freeLeft
            ? "Your first letter is free. Extra letters are £0.50 each."
            : usage && usage.credits > 0
              ? `You have ${usage.credits} paid send${usage.credits === 1 ? "" : "s"} ready.`
              : `Your free letter is used. Next send costs ${priceLabel}.`}
        </p>
      </PixelWindow>

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
              className="mx-auto flex h-40 w-full max-w-sm items-end justify-center rounded-2xl border-4 border-[var(--ll-pink-deep)] bg-gradient-to-b from-[#fff6df] to-[#f0c96a] shadow-[6px_6px_0_var(--ll-pink-shadow)]"
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
          disabled={sending || paying}
        >
          ✨ Regenerate
        </PixelButton>

        {needsPayment ? (
          <PixelButton size="lg" onClick={startPayment} disabled={paying || !open}>
            {paying ? "Opening checkout..." : `💳 Pay ${priceLabel} & send`}
          </PixelButton>
        ) : (
          <PixelButton
            size="lg"
            onClick={sendLetter}
            disabled={sending || paying || !open}
          >
            {sending || paying
              ? "Sending..."
              : freeLeft
                ? "💌 Send free letter"
                : "💌 Send Little Letter"}
          </PixelButton>
        )}
      </div>
      {!open ? (
        <p className="text-xs text-[var(--ll-muted)]">
          Open the envelope to read before sending.
        </p>
      ) : null}
    </div>
  );
}
