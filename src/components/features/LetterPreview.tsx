"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { TermsAcceptance } from "@/components/features/TermsAcceptance";
import { VoiceNoteRecorder } from "@/components/features/VoiceNoteRecorder";
import { GreetingCard } from "@/components/features/GreetingCard";
import { StationeryPaper } from "@/components/features/StationeryPaper";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { clearVoiceBlob, loadVoicePayloadSafe } from "@/lib/voice-note-client";
import { OCCASIONS } from "@/lib/constants";
import { isCardDesignId } from "@/lib/card-designs";
import { getLetterStationery } from "@/lib/letter-stationery";
import { breakAfterLetterGreeting } from "@/lib/letter-format";
import { PostageStamp } from "@/components/features/PostageStamp";
import { CARD_PRICE_LABEL, LETTER_PRICE_LABEL } from "@/lib/usage-labels";
import { getCheckoutUrl, prefetchCheckout } from "@/lib/checkout-client";
import {
  defaultScheduleValue,
  maxScheduleValue,
  minScheduleValue,
} from "@/lib/schedule-datetime";

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
  const { letter, setLetter, setForm, form } = useLetter();
  const { play } = useSound();
  const [open, setOpen] = useState(true);
  const [sending, setSending] = useState(false);
  const [flying, setFlying] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [shareExample, setShareExample] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [scheduleLater, setScheduleLater] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(defaultScheduleValue);

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
    const isCardUsage =
      Boolean(letter?.form?.cardDesign) &&
      isCardDesignId(letter?.form?.cardDesign ?? "");
    setUsageLoading(true);
    const qs = new URLSearchParams({ t: String(Date.now()) });
    if (email) qs.set("email", email);
    if (isCardUsage) qs.set("kind", "card");
    try {
      const res = await fetch(`/api/usage?${qs.toString()}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as UsageInfo;
      if (res.ok) {
        setUsage(data);
        // Never ask for payment while demo mode is on
        setNeedsPayment(!(data.demo || data.canSend));
      } else if (isCardUsage) {
        setNeedsPayment(true);
      }
    } finally {
      setUsageLoading(false);
    }
  }

  useEffect(() => {
    void refreshUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter?.form?.senderEmail, letter?.form?.cardDesign]);

  /* Cards always require payment until usage confirms a credit. */
  useEffect(() => {
    const card =
      Boolean(letter?.form?.cardDesign) &&
      isCardDesignId(letter?.form?.cardDesign ?? "");
    if (card) setNeedsPayment(true);
  }, [letter?.form?.cardDesign]);

  useEffect(() => {
    if (!needsPayment || !letter?.form?.senderEmail?.trim()) return;
    const isCardUsage =
      Boolean(letter.form.cardDesign) &&
      isCardDesignId(letter.form.cardDesign ?? "");
    prefetchCheckout({
      returnPath: "/preview",
      kind: isCardUsage ? "card" : "letter",
      senderEmail: letter.form.senderEmail.trim(),
    });
  }, [
    needsPayment,
    letter?.form?.senderEmail,
    letter?.form?.cardDesign,
  ]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const paid = searchParams.get("paid");
    const cancelled = searchParams.get("cancelled");

    if (cancelled) {
      const cancelledWasCard =
        Boolean(letter?.form.cardDesign) &&
        isCardDesignId(letter?.form.cardDesign ?? "");
      setError(
        cancelledWasCard
          ? `Payment cancelled. E-cards are ${CARD_PRICE_LABEL} each.`
          : `Payment cancelled. Your first two letters are free; extras are ${LETTER_PRICE_LABEL}.`
      );
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
          if (!hasAcceptedTerms()) {
            setError(
              "Please agree to the Terms, Privacy Policy, and Refund Policy before sending."
            );
            return;
          }
          let wantLater = false;
          try {
            wantLater =
              sessionStorage.getItem("little-letter-schedule-later") === "1";
            sessionStorage.removeItem("little-letter-schedule-later");
          } catch {
            /* ignore */
          }
          if (wantLater) {
            await scheduleLetter();
          } else {
            await sendLetter();
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Payment verify failed");
        } finally {
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
  const stationery = getLetterStationery(
    currentLetter.form.stationery ?? form.stationery
  );
  const isCard =
    Boolean(currentLetter.form.cardDesign) &&
    isCardDesignId(currentLetter.form.cardDesign ?? "");

  async function scheduleLetter() {
    if (!hasAcceptedTerms()) {
      setError("Please agree to the Terms, Privacy Policy, and Refund Policy before scheduling.");
      setPaying(false);
      return;
    }
    if (
      !currentLetter.form.senderEmail?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentLetter.form.senderEmail.trim())
    ) {
      setError("Your email is missing — go back and add it so we can track free sends.");
      setPaying(false);
      return;
    }
    if (!scheduledAt.trim()) {
      setError("Pick a date and time to send later.");
      setPaying(false);
      return;
    }

    setSending(true);
    setError("");
    try {
      const voiceNote = await loadVoicePayloadSafe("letter");
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentLetter,
          shareExample,
          voiceNote,
          scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      });
      const data = await res.json();

      if (res.status === 402) {
        setNeedsPayment(true);
        setError(
          data.error ??
            (isCard
              ? `Payment required — e-cards are ${CARD_PRICE_LABEL} each.`
              : "Payment required for extra letters.")
        );
        setSending(false);
        setPaying(false);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Failed to schedule");

      await clearVoiceBlob("letter");
      play("success");
      const when = data.scheduledAt as string;
      try {
        sessionStorage.setItem("little-letter-last-scheduled-at", when);
      } catch {
        /* ignore */
      }
      const qs = new URLSearchParams({ scheduled: "1", at: when });
      if (isCard) qs.set("kind", "card");
      router.push(`/success?${qs.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule letter");
      setSending(false);
      setPaying(false);
    }
  }

  async function sendLetter() {
    if (!hasAcceptedTerms()) {
      setError("Please agree to the Terms, Privacy Policy, and Refund Policy before sending.");
      setPaying(false);
      return;
    }
    if (
      !currentLetter.form.senderEmail?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentLetter.form.senderEmail.trim())
    ) {
      setError("Your email is missing — go back and add it so we can track free sends.");
      setPaying(false);
      return;
    }
    setSending(true);
    setError("");
    try {
      const voiceNote = await loadVoicePayloadSafe("letter");
      const controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), 35_000);
      let res: Response;
      try {
        res = await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...currentLetter, shareExample, voiceNote }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(abortTimer);
      }
      let data: {
        error?: string;
        demo?: boolean;
        canSend?: boolean;
      } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        throw new Error(
          res.status === 504 || res.status >= 500
            ? "Send timed out. Please try again — any used credit should be restored automatically."
            : "Could not send letter. Please try again."
        );
      }

      if (res.status === 402) {
        const qs = new URLSearchParams({ t: String(Date.now()) });
        if (currentLetter.form.senderEmail?.trim()) {
          qs.set("email", currentLetter.form.senderEmail.trim());
        }
        if (isCard) qs.set("kind", "card");
        const latest = await fetch(`/api/usage?${qs.toString()}`, {
          cache: "no-store",
        }).then((r) => r.json() as Promise<UsageInfo>);
        if (latest?.demo || latest?.canSend) {
          setUsage(latest);
          setNeedsPayment(false);
          setError("Demo mode is on — try Send again (no payment).");
        } else {
          setNeedsPayment(true);
          setError(
            data.error ??
              (isCard
                ? `Payment required — e-cards are ${CARD_PRICE_LABEL} each.`
                : "Payment required for extra letters.")
          );
        }
        setSending(false);
        setPaying(false);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Failed to send");

      await clearVoiceBlob("letter");

      setFlying(true);
      play("whoosh");
      await new Promise((r) => setTimeout(r, 900));

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#f6d58a", "#cbb892", "#c5d4a0", "#e8b86d", "#8b5e34"],
      });
      play("success");
      router.push(isCard ? "/success?kind=card" : "/success");
    } catch (err) {
      setFlying(false);
      const aborted =
        err instanceof Error &&
        (err.name === "AbortError" || /aborted|timed out/i.test(err.message));
      setError(
        aborted
          ? "Send timed out. Please try again — any used credit should be restored automatically."
          : err instanceof Error
            ? err.message
            : "Could not send letter"
      );
      setSending(false);
      setPaying(false);
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
      try {
        sessionStorage.setItem(
          "little-letter-schedule-later",
          scheduleLater ? "1" : "0"
        );
        if (scheduleLater && scheduledAt) {
          sessionStorage.setItem(
            "little-letter-last-scheduled-at",
            new Date(scheduledAt).toISOString()
          );
        }
      } catch {
        /* ignore */
      }
      const url = await getCheckoutUrl({
        returnPath: "/preview",
        kind: isCard ? "card" : "letter",
        senderEmail: currentLetter.form.senderEmail?.trim() ?? "",
      });
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  // Cards: always £0.70, no free allowance. Letters: first 2 free, then £0.70.
  const priceLabel = isCard ? CARD_PRICE_LABEL : LETTER_PRICE_LABEL;
  const demo = usage?.demo ?? false;
  const freeLeft = isCard ? false : (usage?.freeAvailable ?? true);
  const freeRemaining = usage?.freeLeft ?? 2;
  const freeTotal = usage?.freeTotal ?? 2;

  return (
    <div className="relative space-y-6">
      <AnimatePresence>
        {flying ? (
          <motion.div
            key="send-flying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#fff8ee]/90 backdrop-blur-sm dark:bg-[#1a1510]/90"
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
            <p className="font-display text-[var(--ll-ink)]">
              {isCard ? "Your card is on its way..." : "Your letter is on its way..."}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <PixelWindow title="pricing.ini" icon={demo ? "🧪" : "💷"} liftOnHover={false}>
        <p className="font-display text-sm text-[var(--ll-ink)]">
          {demo
            ? isCard
              ? "Demo mode — e-cards are free for testing. No payment asked right now."
              : "Demo mode — sends are free for testing. No payment asked right now."
            : isCard
              ? usage && usage.credits > 0
                ? `You have ${usage.credits} paid card credit${usage.credits === 1 ? "" : "s"} ready.`
                : `E-cards are ${priceLabel} each — there is no free card allowance.`
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
              className="relative mx-auto w-full max-w-sm overflow-visible pt-10"
              style={{ perspective: 1200, transformStyle: "preserve-3d" }}
            >
              <div
                className="relative aspect-[8/5] w-full overflow-visible"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Envelope body */}
                <svg
                  className="absolute inset-0 z-10 h-full w-full"
                  viewBox="0 0 320 200"
                  preserveAspectRatio="none"
                  aria-hidden
                  style={{
                    filter: `drop-shadow(5px 7px 0 ${stationery.envelopeStroke}46)`,
                  }}
                >
                  <defs>
                    <linearGradient id="ll-env-back" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={stationery.envelopeBack[0]}
                      />
                      <stop
                        offset="55%"
                        stopColor={stationery.envelopeBack[1]}
                      />
                      <stop
                        offset="100%"
                        stopColor={stationery.envelopeBack[2]}
                      />
                    </linearGradient>
                  </defs>
                  <rect
                    x="4"
                    y="4"
                    width="312"
                    height="192"
                    rx="14"
                    fill="url(#ll-env-back)"
                    stroke={stationery.envelopeStroke}
                    strokeWidth="4"
                  />
                </svg>

                {/* Letter — fully under the pocket when sealed; slides up when open */}
                <motion.div
                  className="absolute left-1/2 z-[15] w-[72%] -translate-x-1/2 overflow-hidden rounded-sm px-2.5 py-1.5 shadow-[2px_2px_0_rgba(61,47,34,0.1)]"
                  style={{
                    border: `1px solid ${stationery.paperBorder}`,
                    background: stationery.paperBg,
                    color: stationery.ink,
                  }}
                  initial={false}
                  animate={
                    open
                      ? { top: "8%", height: "54%", opacity: 1, scale: 1 }
                      : {
                          top: "64%",
                          height: "28%",
                          opacity: 1,
                          scale: 0.97,
                        }
                  }
                  transition={
                    open
                      ? {
                          delay: 0.4,
                          type: "spring",
                          stiffness: 170,
                          damping: 18,
                        }
                      : { duration: 0.3, ease: "easeIn" }
                  }
                >
                  <p
                    className="truncate font-display text-[9px] leading-snug"
                    style={{ color: stationery.accent }}
                  >
                    {currentLetter.subject}
                  </p>
                  <p
                    className="mt-0.5 truncate text-[10px]"
                    style={{ color: stationery.muted }}
                  >
                    For {currentLetter.form.recipientName}
                  </p>
                  <p
                    className="mt-0.5 line-clamp-2 text-left text-[10px] leading-snug"
                    style={{ color: stationery.ink }}
                  >
                    {currentLetter.message}
                  </p>
                </motion.div>

                {/* Front pocket — clean V, no inner scratch lines */}
                <svg
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                  viewBox="0 0 320 200"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="ll-env-front" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={stationery.envelopeFront[0]}
                      />
                      <stop
                        offset="100%"
                        stopColor={stationery.envelopeFront[1]}
                      />
                    </linearGradient>
                    <linearGradient
                      id="ll-env-pocket-shade"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(61,47,34,0.12)" />
                      <stop offset="100%" stopColor="rgba(61,47,34,0)" />
                    </linearGradient>
                    <clipPath id="ll-env-front-face">
                      <rect x="6" y="6" width="308" height="188" rx="12" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#ll-env-front-face)">
                    <path
                      d="M6 122 L160 102 L314 122 L314 194 L6 194 Z"
                      fill="url(#ll-env-front)"
                    />
                    <path
                      d="M6 122 L160 102 L314 122 L314 138 L160 118 L6 138 Z"
                      fill="url(#ll-env-pocket-shade)"
                    />
                    <path
                      d="M6 122 L160 102 L314 122"
                      fill="none"
                      stroke={stationery.envelopeStroke}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>

                {/* Lip / flap */}
                <motion.div
                  className="absolute inset-0 z-30"
                  style={{
                    transformOrigin: "50% 3%",
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
                        <stop
                          offset="0%"
                          stopColor={stationery.envelopeFlap[0]}
                        />
                        <stop
                          offset="100%"
                          stopColor={stationery.envelopeFlap[1]}
                        />
                      </linearGradient>
                      <clipPath id="ll-env-flap-face">
                        <rect x="6" y="6" width="308" height="188" rx="12" />
                      </clipPath>
                    </defs>
                    <g clipPath={open ? undefined : "url(#ll-env-flap-face)"}>
                      <path
                        d="M6 6 H314 L160 102 Z"
                        fill="url(#ll-env-flap)"
                      />
                      <path
                        d="M6 6 L160 102 L314 6"
                        fill="none"
                        stroke={stationery.envelopeStroke}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                  <div
                    className="absolute left-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
                    style={{ top: "48%" }}
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
                        {stationery.sealEmoji}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>

                {/*
                  Postage stamp — top-right, above the flap (translateZ beats the
                  flap’s preserve-3d stacking). Like a real posted letter.
                */}
                {!isCard ? (
                  <div
                    className="pointer-events-none absolute right-[2.5%] top-[3.5%] z-[60]"
                    style={{
                      transform: "translateZ(48px) rotate(5deg)",
                      transformStyle: "preserve-3d",
                    }}
                    aria-hidden
                  >
                    <PostageStamp
                      emoji={stationery.emoji}
                      label={stationery.stampLabel}
                      colors={stationery.stampColors}
                      postmarkColor={stationery.postmarkColor}
                      className="drop-shadow-[3px_3px_0_rgba(61,47,34,0.28)]"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <p className="mt-3 text-center text-sm text-[var(--ll-muted)]">
              {open
                ? "Your styled letter is open below — click the envelope to tuck it back"
                : `Click the seal — then your ${stationery.title} letter slides out`}
            </p>
            {!isCard ? (
              <p
                className="mt-1 text-center font-pixel text-[8px] tracking-wide"
                style={{ color: stationery.accent }}
              >
                {stationery.emoji} {stationery.title} · {stationery.era}
              </p>
            ) : null}
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
            aria-hidden={!open}
            inert={!open ? true : undefined}
          >
            <article className="mt-6">
              {currentLetter.form.cardDesign &&
              isCardDesignId(currentLetter.form.cardDesign) ? (
                <GreetingCard
                  designId={currentLetter.form.cardDesign}
                  recipientName={currentLetter.form.recipientName}
                  subject={currentLetter.subject}
                  message={currentLetter.message}
                  senderName={currentLetter.form.senderName}
                  occasionLabel={
                    OCCASIONS.find(
                      (o) => o.value === currentLetter.form.occasion
                    )?.label
                  }
                />
              ) : (
                <StationeryPaper
                  stationery={stationery}
                  subject={currentLetter.subject}
                >
                  <p
                    className="text-xs"
                    style={{ color: stationery.muted }}
                  >
                    To: {currentLetter.form.recipientName} &lt;
                    {currentLetter.form.recipientEmail}&gt;
                  </p>
                  <div
                    className="mt-4 whitespace-pre-wrap text-left text-base leading-relaxed"
                    style={{ color: stationery.ink }}
                  >
                    {breakAfterLetterGreeting(currentLetter.message)}
                  </div>
                  <p
                    className="mt-5 text-right font-script text-lg"
                    style={{ color: stationery.accent }}
                  >
                    — {currentLetter.form.senderName}
                  </p>
                </StationeryPaper>
              )}
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
            Share a short preview on The Wall
          </span>
          <span className="mt-0.5 block text-xs text-[var(--ll-muted)]">
            Optional peek for others on The Wall — names, occasion, and a short
            line. Never the email or full letter.
          </span>
        </span>
      </label>

      <TermsAcceptance
        checked={acceptedTerms}
        onChange={updateAcceptedTerms}
        id="letter-accept-terms"
      />

      <div className="rounded-2xl border-[3px] border-[var(--ll-pink-deep)] bg-[#fff6df]/80 px-4 py-4 shadow-[4px_4px_0_rgba(139,94,52,0.18)] dark:bg-[#2a2118]/80">
        <p className="font-pixel text-[9px] tracking-wide text-[var(--ll-pink-deep)] sm:text-[10px]">
          When should it arrive?
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              play("click");
              setScheduleLater(false);
            }}
            className={`rounded-xl border-2 px-3 py-3 text-left transition ${
              !scheduleLater
                ? "border-[var(--ll-pink-deep)] bg-[#f6d58a] shadow-[2px_2px_0_rgba(139,94,52,0.25)]"
                : "border-[var(--ll-lavender)] bg-white/70 dark:bg-white/5"
            }`}
          >
            <span className="block text-lg" aria-hidden>
              ✉️
            </span>
            <span className="mt-1 block font-display text-sm font-semibold text-[var(--ll-ink)]">
              Send now
            </span>
            <span className="mt-0.5 block text-[11px] text-[var(--ll-muted)]">
              Emails right away
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              play("click");
              setScheduleLater(true);
              if (!scheduledAt) setScheduledAt(defaultScheduleValue());
            }}
            className={`rounded-xl border-2 px-3 py-3 text-left transition ${
              scheduleLater
                ? "border-[var(--ll-pink-deep)] bg-[#f6d58a] shadow-[2px_2px_0_rgba(139,94,52,0.25)]"
                : "border-[var(--ll-lavender)] bg-white/70 dark:bg-white/5"
            }`}
          >
            <span className="block text-lg" aria-hidden>
              🕐
            </span>
            <span className="mt-1 block font-display text-sm font-semibold text-[var(--ll-ink)]">
              Send later
            </span>
            <span className="mt-0.5 block text-[11px] text-[var(--ll-muted)]">
              Pick a date &amp; time
            </span>
          </button>
        </div>
        {scheduleLater ? (
          <div className="mt-3">
            <label
              htmlFor="letter-schedule-at"
              className="mb-1.5 block text-xs font-medium text-[var(--ll-muted)]"
            >
              Delivery date &amp; time
            </label>
            <input
              id="letter-schedule-at"
              type="datetime-local"
              value={scheduledAt}
              min={minScheduleValue()}
              max={maxScheduleValue()}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-xl border-2 border-[var(--ll-pink-deep)] bg-white px-3 py-2.5 text-sm text-[var(--ll-ink)] outline-none focus:ring-2 focus:ring-[var(--ll-pink-glow)] dark:bg-[#1a1510]"
            />
            <p className="mt-1.5 text-[11px] text-[var(--ll-muted)]">
              We&apos;ll send it automatically — no need to come back. Up to 30
              days ahead.
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <PixelButton
          variant="ghost"
          onClick={() => {
            const design = currentLetter.form.cardDesign;
            /* Keep the written letter — only jump back to edit names / look. */
            setForm({
              ...currentLetter.form,
              ownSubject:
                currentLetter.form.writeMode === "own"
                  ? currentLetter.subject
                  : form.ownSubject,
              ownMessage:
                currentLetter.form.writeMode === "own"
                  ? currentLetter.message
                  : form.ownMessage,
            });
            if (design && isCardDesignId(design)) {
              router.push(`/cards/${design}`);
            } else {
              router.push("/create?edit=details");
            }
          }}
        >
          ← Edit details
        </PixelButton>
        <PixelButton
          variant="secondary"
          onClick={async () => {
            play("click");
            if (currentLetter.form.writeMode === "own") {
              const design = currentLetter.form.cardDesign;
              if (design && isCardDesignId(design)) {
                router.push(`/cards/${design}`);
              } else {
                router.push("/create");
              }
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
            ? currentLetter.form.cardDesign
              ? "✏️ Edit my card"
              : "✏️ Edit my letter"
            : "✨ Regenerate"}
        </PixelButton>

        {needsPayment && !demo ? (
          <PixelButton
            size="lg"
            onClick={startPayment}
            disabled={paying || !acceptedTerms || usageLoading}
          >
            {paying || usageLoading
              ? paying
                ? "Opening checkout..."
                : "Checking payment…"
              : scheduleLater
                ? isCard
                  ? `💳 Pay ${priceLabel} & schedule card`
                  : `💳 Pay ${priceLabel} & schedule`
                : isCard
                  ? `💳 Pay ${priceLabel} & send card`
                  : `💳 Pay ${priceLabel} & send`}
          </PixelButton>
        ) : (
          <PixelButton
            size="lg"
            onClick={scheduleLater ? scheduleLetter : sendLetter}
            disabled={sending || paying || !acceptedTerms || usageLoading}
          >
            {sending || paying || usageLoading
              ? usageLoading
                ? "Checking…"
                : scheduleLater
                  ? "Scheduling..."
                  : "Sending..."
              : scheduleLater
                ? isCard
                  ? "🕐 Schedule card"
                  : "🕐 Schedule letter"
                : isCard
                  ? demo
                    ? "🎴 Send card (demo)"
                    : "🎴 Send card"
                  : demo
                    ? "✉️ Send letter (demo)"
                    : freeLeft
                      ? `✉️ Send free letter (${freeRemaining} left)`
                      : "✉️ Send Little Letter"}
          </PixelButton>
        )}
      </div>
    </div>
  );
}
