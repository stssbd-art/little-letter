"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { ShareBar } from "@/components/features/ShareBar";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

export function SuccessCelebration() {
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind");
  const isMixtape = kind === "mixtape";
  const isCard = kind === "card" || Boolean(letter?.form.cardDesign);
  const { letter, resetForm } = useLetter();
  const { play } = useSound();
  const { triggerPetals, triggerStars } = useEasterEggs();
  const [mixMeta, setMixMeta] = useState<{
    title: string;
    to: string;
    from: string;
  } | null>(null);

  useEffect(() => {
    if (!isMixtape) return;
    try {
      const raw = sessionStorage.getItem("little-letter-last-mix");
      if (raw) setMixMeta(JSON.parse(raw) as { title: string; to: string; from: string });
    } catch {
      /* ignore */
    }
  }, [isMixtape]);

  useEffect(() => {
    play("success");
    triggerPetals();
    triggerStars();
    const end = Date.now() + 1800;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#f6d58a", "#cbb892", "#c5d4a0", "#ffe8a3"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#e8b86d", "#8b5e34", "#a3b875", "#d2a35a"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [play, triggerPetals, triggerStars]);

  return (
    <PixelWindow title="success!.wav" icon="🎉" liftOnHover={false}>
      <div className="flex flex-col items-center text-center">
        <motion.div
          className="relative text-7xl"
          initial={{ scale: 0.6, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
        >
          <motion.span
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            {isMixtape ? "📼" : isCard ? "🎴" : "💌"}
          </motion.span>
        </motion.div>

        <motion.div
          className="mt-4 flex gap-3 text-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          aria-hidden
        >
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            🍃
          </motion.span>
          <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.2 }}>
            🌈
          </motion.span>
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.4 }}>
            ⭐
          </motion.span>
          <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.4, delay: 0.1 }}>
            ✨
          </motion.span>
        </motion.div>

        <h1 className="mt-6 font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          ✨ Success!
        </h1>
        <p className="mt-3 font-display text-xl text-[var(--ll-ink)]">
          {isMixtape
            ? "Your mixtape is on its way."
            : isCard
              ? "Your card is on its way."
              : "Your little letter has been sent."}
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--ll-muted)]">
          {isMixtape
            ? "They’ll get an email with a Play link for your cassette mix."
            : isCard
              ? "They’ll get an email with a button to open the animated card on the website."
              : "Your little message is flying through the internet... Hopefully it lands with a smile."}
        </p>
        {isMixtape && mixMeta ? (
          <p className="mt-3 text-xs text-[var(--ll-muted)]">
            “{mixMeta.title}” · for {mixMeta.to}
          </p>
        ) : null}
        {!isMixtape && letter ? (
          <p className="mt-3 text-xs text-[var(--ll-muted)]">
            On its way to {letter.form.recipientName}
          </p>
        ) : null}

        <div className="mt-8 w-full max-w-md rounded-xl border-2 border-[var(--ll-lavender)] bg-[#fffbf2]/60 px-4 py-3 text-left dark:bg-white/5">
          <ShareBar
            url={SITE_URL}
            title={SITE_NAME}
            text={
              isMixtape
                ? `I just sent a mixtape with ${SITE_NAME} — send someone a cassette mix too.`
                : isCard
                  ? `I just sent a digital card with ${SITE_NAME}. ${SITE_TAGLINE}`
                  : `I just sent a little letter with ${SITE_NAME}. ${SITE_TAGLINE}`
            }
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {isMixtape ? (
            <Link href="/mixtape">
              <PixelButton>Burn another tape 📼</PixelButton>
            </Link>
          ) : isCard ? (
            <Link href="/cards">
              <PixelButton
                onClick={() => {
                  resetForm();
                }}
              >
                Send another card 🎴
              </PixelButton>
            </Link>
          ) : (
            <Link href="/create">
              <PixelButton
                onClick={() => {
                  resetForm();
                }}
              >
                Send another 💌
              </PixelButton>
            </Link>
          )}
          <Link href="/">
            <PixelButton variant="ghost">Back home</PixelButton>
          </Link>
        </div>
      </div>
    </PixelWindow>
  );
}
