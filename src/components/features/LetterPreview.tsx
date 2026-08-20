"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { TermsAcceptance } from "@/components/features/TermsAcceptance";
import { VoiceNoteRecorder } from "@/components/features/VoiceNoteRecorder";
import { GreetingCard } from "@/components/features/GreetingCard";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { clearVoiceBlob, loadVoicePayload } from "@/lib/voice-note-client";
import { OCCASIONS } from "@/lib/constants";
import { getCardDesign, type CardDesignId } from "@/lib/card-designs";

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
      const voiceNote = await loadVoicePayload("letter");
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentLetter, shareExample, voiceNote }),
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

      await clearVoiceBlob("letter");

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

      <VoiceNoteRecorder kind="letter" />

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
              className="relative mx-auto w-full max-w-sm overflow-visible pt-14"
              style={{ perspective: 1100 }}
            >
              {/*
                Shared 320×200 viewBox on every layer.
                Lip tip + pocket peak both sit at (160, 100).
                Shadow only on the flat back layer (keeps 3D flap unfiltered).
              */}
              <div className="relative aspect-[8/5] w-full overflow-visible">
                {/* Back + outer silhouette */}
                <svg
                  className="absolute inset-0 z-10 h-full w-full"
                  viewBox="0 0 320 200"
                  preserveAspectRatio="none"
                  aria-hidden
                  style={{ filter: "drop-shadow(6px 6px 0 var(--ll-pink-shadow))" }}
                >
                  <defs>
                    <linearGradient id="ll-env-back" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fff0c2" />
                      <stop offset="45%" stopColor="#f6d58a" />
                      <stop offset="100%" stopColor="#e8b86d" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="2.5"
                    y="2.5"
                    width="315"
                    height="195"
                    rx="18"
                    fill="url(#ll-env-back)"
                    stroke="var(--ll-pink-deep)"
                    strokeWidth="5"
                  />
                </svg>

                {/* Letter sliding out (between back and front) */}
                <motion.div
                  className="absolute left-1/2 z-[15] w-[82%] -translate-x-1/2 overflow-hidden rounded-md border-2 border-[#d4b896] bg-[#fffdf6] px-3 py-2 shadow-[3px_3px_0_rgba(61,47,34,0.12)]"
                  initial={false}
                  animate={
                    open
                      ? { top: "8%", opacity: 1, scale: 1 }
                      : { top: "38%", opacity: 0.95, scale: 0.98 }
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
                  style={{ height: "54%" }}
                >
                  <p className="truncate font-pixel text-[8px] text-[#8b5e34]">
                    {currentLetter.subject}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-[#7a654f]">
                    For {currentLetter.form.recipientName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-left text-[11px] leading-snug text-[#3d2f22]">
                    {currentLetter.message}
                  </p>
                </motion.div>

                {/* Front pocket — V peak at (160, 100) */}
                <svg
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                  viewBox="0 0 320 200"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="ll-env-front" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f0c96a" />
                      <stop offset="100%" stopColor="#d9a45a" />
                    </linearGradient>
                    <clipPath id="ll-env-front-face">
                      <rect x="5" y="5" width="310" height="190" rx="16" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#ll-env-front-face)">
                    <path
                      d="M5 118 L160 100 L315 118 L315 195 L5 195 Z"
                      fill="url(#ll-env-front)"
                    />
                    <path
                      d="M18 120 L160 155 L302 120"
                      fill="none"
                      stroke="rgba(120,70,20,0.2)"
                      strokeWidth="1.25"
                    />
                  </g>
                </svg>

                {/* Lip — same tip (160,100); clipped to face when closed */}
                <motion.div
                  className="absolute inset-0 z-30"
                  style={{
                    transformOrigin: "50% 2.5%",
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
                  <svg
                    className="h-full w-full"
                    viewBox="0 0 320 200"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient id="ll-env-flap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fff0c2" />
                        <stop offset="100%" stopColor="#f0c96a" />
                      </linearGradient>
                      <clipPath id="ll-env-flap-face">
                        <rect x="5" y="5" width="310" height="190" rx="16" />
                      </clipPath>
                    </defs>
                    <g clipPath={open ? undefined : "url(#ll-env-flap-face)"}>
                      <path d="M5 5 H315 L160 100 Z" fill="url(#ll-env-flap)" />
                      <path
                        d="M5 5 L160 100 L315 5"
                        fill="none"
                        stroke="var(--ll-pink-deep)"
                        strokeWidth="5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                  <div
                    className="absolute left-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
                    style={{ top: "50%" }}
                  >
                    <motion.div
                      className="flex items-center justify-center"
                      animate={{
                        scale: open ? 0.35 : 1,
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
                  </div>
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
            <article className="mt-6">
              <GreetingCard
                designId={
                  (getCardDesign(currentLetter.form.cardDesign).id as CardDesignId)
                }
                recipientName={currentLetter.form.recipientName}
                subject={currentLetter.subject}
                message={currentLetter.message}
                senderName={currentLetter.form.senderName}
                occasionLabel={
                  OCCASIONS.find((o) => o.value === currentLetter.form.occasion)
                    ?.label
                }
              />
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
            if (currentLetter.form.writeMode === "own") {
              router.push("/create");
              return;
            }
            setSending(true);
            try {
              const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentLetter.form),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error);
              setLetter({
                ...currentLetter,
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
          {currentLetter.form.writeMode === "own"
            ? "✏️ Edit my letter"
            : "✨ Regenerate"}
        </PixelButton>

        {needsPayment && !demo ? (
          <PixelButton
            size="lg"
            onClick={startPayment}
            disabled={paying || !acceptedTerms}
          >
            {paying ? "Opening checkout..." : `💳 Pay ${priceLabel} & send`}
          </PixelButton>
        ) : (
          <PixelButton
            size="lg"
            onClick={sendLetter}
            disabled={sending || paying || !acceptedTerms}
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
    </div>
  );
}
