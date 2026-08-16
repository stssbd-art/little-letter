"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { TermsAcceptance } from "@/components/features/TermsAcceptance";

const TERMS_STORAGE_KEY = "little-letter-accepted-terms";

type UsageInfo = {
  demo?: boolean;
  freeAvailable: boolean;
  freeLeft?: number;
  freeTotal?: number;
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
  const [shareExample, setShareExample] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(TERMS_STORAGE_KEY) === "1") {
        setAcceptedTerms(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function updateAcceptedTerms(next: boolean) {
    setAcceptedTerms(next);
    try {
      sessionStorage.setItem(TERMS_STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function hasAcceptedTerms() {
    if (acceptedTerms) return true;
    try {
      return sessionStorage.getItem(TERMS_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  }

  async function refreshUsage() {
    const email = letter?.form?.senderEmail?.trim() ?? "";
    const qs = new URLSearchParams({ t: String(Date.now()) });
    if (email) qs.set("email", email);
    const res = await fetch(`/api/usage?${qs.toString()}`, {
      cache: "no-store",
    });
    const data = (await res.json()) as UsageInfo;
    if (res.ok) {
      setUsage(data);
      // Never ask for payment while demo mode is on
      setNeedsPayment(!(data.demo || data.canSend));
    }
  }

  useEffect(() => {
    void refreshUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter?.form?.senderEmail]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const paid = searchParams.get("paid");
    const cancelled = searchParams.get("cancelled");

    if (cancelled) {
      setError("Payment cancelled. Your first two letters are free; extras are £0.99.");
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
            body: JSON.stringify({
              sessionId,
              senderEmail: letter.form.senderEmail?.trim(),
            }),
          });
          const verifyData = await verify.json();
          if (!verify.ok) {
            throw new Error(verifyData.error ?? "Could not verify payment");
          }
          await refreshUsage();
          // sendLetter navigates to /success — stay there
          await sendLetter();
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

  const currentLetter = letter;

  async function sendLetter() {
    if (!hasAcceptedTerms()) {
      setError("Please agree to the Terms, Privacy Policy, and Refund Policy before sending.");
      return;
    }
    if (
      !currentLetter.form.senderEmail?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentLetter.form.senderEmail.trim())
    ) {
      setError("Your email is missing — go back and add it so we can track free sends.");
      return;
    }
    setSending(true);
    setError("");
    play("whoosh");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentLetter, shareExample }),
      });
      const data = await res.json();

      if (res.status === 402) {
        const qs = new URLSearchParams({ t: String(Date.now()) });
        if (currentLetter.form.senderEmail?.trim()) {
          qs.set("email", currentLetter.form.senderEmail.trim());
        }
        const latest = await fetch(`/api/usage?${qs.toString()}`, {
          cache: "no-store",
        }).then((r) => r.json() as Promise<UsageInfo>);
        if (latest?.demo || latest?.canSend) {
          setUsage(latest);
          setNeedsPayment(false);
          setError("Demo mode is on — try Send again (no payment).");
        } else {
          setNeedsPayment(true);
          setError(data.error ?? "Payment required for extra letters.");
        }
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
    if (!hasAcceptedTerms()) {
      setError("Please agree to the Terms, Privacy Policy, and Refund Policy before paying.");
      return;
    }
    setPaying(true);
    setError("");
    play("click");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnPath: "/preview",
          kind: "letter",
          senderEmail: currentLetter.form.senderEmail?.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start payment");
      window.location.href = data.url as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  const priceLabel = usage?.price ?? "£0.99";
  const demo = usage?.demo ?? false;
  const freeLeft = usage?.freeAvailable ?? true;
  const freeRemaining = usage?.freeLeft ?? 2;
  const freeTotal = usage?.freeTotal ?? 2;

  return (
    <div className="space-y-6">
      <PixelWindow title="pricing.ini" icon={demo ? "🧪" : "💷"} liftOnHover={false}>
        <p className="font-display text-sm text-[var(--ll-ink)]">
          {demo
            ? "Demo mode — sends are free for testing. No payment asked right now."
            : freeLeft
              ? `Your first ${freeTotal} letters are free (${freeRemaining} left). Extra letters are ${priceLabel} each.`
              : usage && usage.credits > 0
                ? `You have ${usage.credits} paid letter credit${usage.credits === 1 ? "" : "s"} ready.`
                : `Your free letters are used. Next letter costs ${priceLabel}.`}
        </p>
      </PixelWindow>

      <PixelWindow title="letter_preview.rtf" icon="📬" liftOnHover={false}>
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="relative w-full max-w-md cursor-pointer border-0 bg-transparent"
            onClick={() => {
              play("click");
              setOpen((v) => {
                const next = !v;
                if (next) {
                  window.setTimeout(() => play("sparkle"), 380);
                }
                return next;
              });
            }}
            aria-expanded={open}
            aria-label={open ? "Close letter" : "Open letter"}
          >
            <div
              className="relative mx-auto w-full max-w-sm pt-10"
              style={{ perspective: 1000 }}
            >
              <div className="relative h-48 w-full">
                {/* Envelope back */}
                <div className="absolute inset-x-0 bottom-0 h-40 rounded-2xl border-4 border-[var(--ll-pink-deep)] bg-gradient-to-b from-[#ffe8b0] to-[#f0c96a] shadow-[6px_6px_0_var(--ll-pink-shadow)]" />

                {/* Letter sliding out of the envelope */}
                <motion.div
                  className="absolute left-1/2 z-[15] w-[86%] -translate-x-1/2 overflow-hidden rounded-md border-2 border-[#d4b896] bg-[#fffdf6] px-3 py-2 shadow-[3px_3px_0_rgba(61,47,34,0.12)]"
                  initial={false}
                  animate={
                    open
                      ? { y: -8, opacity: 1, scale: 1 }
                      : { y: 78, opacity: 0.92, scale: 0.98 }
                  }
                  transition={
                    open
                      ? {
                          delay: 0.38,
                          type: "spring",
                          stiffness: 160,
                          damping: 16,
                        }
                      : { duration: 0.28, ease: "easeIn" }
                  }
                  style={{ bottom: "3.25rem" }}
                >
                  <p className="truncate font-pixel text-[8px] text-[var(--ll-pink-deep)]">
                    {currentLetter.subject}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-[var(--ll-muted)]">
                    For {currentLetter.form.recipientName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-left text-[11px] leading-snug text-[var(--ll-ink)]">
                    {currentLetter.message}
                  </p>
                </motion.div>

                {/* Envelope front pocket (covers the tucked letter) */}
                <div
                  className="absolute inset-x-0 bottom-0 z-20 h-[5.75rem] overflow-hidden rounded-b-2xl border-4 border-t-0 border-[var(--ll-pink-deep)]"
                  style={{
                    background:
                      "linear-gradient(180deg, #f6d58a 0%, #e8b86d 55%, #d9a45a 100%)",
                    clipPath: "polygon(0 38%, 50% 0, 100% 38%, 100% 100%, 0 100%)",
                  }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 rounded-b-2xl border-x-4 border-b-4 border-[var(--ll-pink-deep)] bg-[#e8b86d]" />

                {/* Opening lip / flap */}
                <motion.div
                  className="absolute left-0 right-0 top-[0.35rem] z-30 h-[4.6rem] origin-top"
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                  initial={false}
                  animate={{ rotateX: open ? -158 : 0 }}
                  transition={
                    open
                      ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                      : { duration: 0.35, ease: "easeIn" }
                  }
                >
                  <div
                    className="h-full w-full border-x-4 border-t-4 border-[var(--ll-pink-deep)]"
                    style={{
                      background:
                        "linear-gradient(180deg, #ffe6a8 0%, #f6c97a 70%, #e8b05a 100%)",
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      boxShadow: "0 4px 0 rgba(120, 60, 20, 0.12)",
                    }}
                  />
                  {/* Heart seal rides on the flap tip */}
                  <motion.div
                    className="absolute left-1/2 top-[58%] z-40 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                    animate={{
                      scale: open ? 0.4 : 1,
                      opacity: open ? 0 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <span
                      className="select-none text-4xl leading-none drop-shadow-[0_3px_0_rgba(120,20,40,0.35)] sm:text-5xl"
                      aria-hidden
                    >
                      ❤️
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            <p className="mt-3 text-center text-sm text-[var(--ll-muted)]">
              {open
                ? "Tap to tuck the letter back & seal with love"
                : "Tap the red heart — the lip opens, then your letter pops out"}
            </p>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: open ? "auto" : 0,
              opacity: open ? 1 : 0,
              y: open ? 0 : 16,
            }}
            transition={
              open
                ? { delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.2 }
            }
            className="w-full overflow-hidden"
          >
            <article className="mt-6 rounded-2xl border-2 border-[var(--ll-lavender)] bg-white/90 p-5 dark:bg-white/10">
              <p className="font-pixel text-[10px] text-[var(--ll-pink-deep)]">
                {currentLetter.subject}
              </p>
              <p className="mt-1 text-xs text-[var(--ll-muted)]">
                To: {currentLetter.form.recipientName} &lt;
                {currentLetter.form.recipientEmail}&gt;
              </p>
              <div className="mt-4 whitespace-pre-wrap font-display text-base leading-relaxed text-[var(--ll-ink)]">
                {currentLetter.message}
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

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[var(--ll-lavender)] bg-white/50 px-3 py-3 dark:bg-white/5">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[#8b5e34]"
          checked={shareExample}
          onChange={(e) => setShareExample(e.target.checked)}
        />
        <span>
          <span className="block font-display text-sm text-[var(--ll-ink)]">
            Share a short preview on the homepage
          </span>
          <span className="mt-0.5 block text-xs text-[var(--ll-muted)]">
            Optional example for others — names, occasion, and a short line.
            Never the email or full letter.
          </span>
        </span>
      </label>

      <TermsAcceptance
        checked={acceptedTerms}
        onChange={updateAcceptedTerms}
        id="letter-accept-terms"
      />

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

        {needsPayment && !demo ? (
          <PixelButton
            size="lg"
            onClick={startPayment}
            disabled={paying || !open || !acceptedTerms}
          >
            {paying ? "Opening checkout..." : `💳 Pay ${priceLabel} & send`}
          </PixelButton>
        ) : (
          <PixelButton
            size="lg"
            onClick={sendLetter}
            disabled={sending || paying || !open || !acceptedTerms}
          >
            {sending || paying
              ? "Sending..."
              : demo
                ? "💌 Send letter (demo)"
                : freeLeft
                  ? `💌 Send free letter (${freeRemaining} left)`
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
