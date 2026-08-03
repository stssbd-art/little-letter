"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";

export function SuccessCelebration() {
  const { letter, resetForm } = useLetter();
  const { play } = useSound();
  const { triggerPetals, triggerStars } = useEasterEggs();

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
        colors: ["#fda4af", "#c4b5fd", "#86efac", "#fde68a"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#fda4af", "#93c5fd", "#86efac", "#f9a8d4"],
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
            💌
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
            🌸
          </motion.span>
          <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.2 }}>
            🦋
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
          Your little letter has been sent.
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--ll-muted)]">
          💌 Your little message is flying through the internet...
          <br />
          Hopefully it lands with a smile.
        </p>
        {letter ? (
          <p className="mt-3 text-xs text-[var(--ll-muted)]">
            On its way to {letter.form.recipientName}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/create">
            <PixelButton
              onClick={() => {
                resetForm();
              }}
            >
              Send another 💌
            </PixelButton>
          </Link>
          <Link href="/">
            <PixelButton variant="ghost">Back home</PixelButton>
          </Link>
        </div>
      </div>
    </PixelWindow>
  );
}
