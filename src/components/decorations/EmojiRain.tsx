"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";

const EMOJIS = ["💌", "⭐", "🦋", "☁️", "🍀", "✨", "🌙", "🌈", "🐸", "🎮"];

export function EmojiRain() {
  const { emojiRain } = useEasterEggs();
  const [drops, setDrops] = useState<
    { id: number; x: number; emoji: string; delay: number }[]
  >([]);

  useEffect(() => {
    if (!emojiRain) {
      setDrops([]);
      return;
    }
    setDrops(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        emoji: EMOJIS[i % EMOJIS.length]!,
        delay: Math.random() * 1.5,
      }))
    );
  }, [emojiRain]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]" aria-hidden>
      <AnimatePresence>
        {drops.map((d) => (
          <motion.span
            key={`${d.id}-${emojiRain}`}
            className="absolute text-2xl"
            style={{ left: `${d.x}%`, top: "-5%" }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.2, delay: d.delay, ease: "easeIn" }}
          >
            {d.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
