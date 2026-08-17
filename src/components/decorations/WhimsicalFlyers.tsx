"use client";

import { motion } from "framer-motion";

const FLYERS = [
  { emoji: "💌", left: "6%", top: "18%", size: "text-lg", duration: 18, x: 48, y: -36 },
  { emoji: "🦋", left: "78%", top: "22%", size: "text-xl", duration: 16, x: -56, y: 28 },
  { emoji: "⭐", left: "18%", top: "72%", size: "text-sm", duration: 14, x: 32, y: -52 },
  { emoji: "✨", left: "88%", top: "58%", size: "text-base", duration: 20, x: -40, y: -24 },
  { emoji: "☁️", left: "42%", top: "8%", size: "text-2xl", duration: 32, x: 70, y: 12 },
  { emoji: "🍀", left: "62%", top: "78%", size: "text-base", duration: 17, x: -28, y: -40 },
  { emoji: "📼", left: "8%", top: "48%", size: "text-sm", duration: 22, x: 60, y: 20 },
  { emoji: "🌙", left: "92%", top: "12%", size: "text-lg", duration: 26, x: -30, y: 18 },
  { emoji: "💌", left: "52%", top: "88%", size: "text-sm", duration: 19, x: 24, y: -60 },
] as const;

export function WhimsicalFlyers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {FLYERS.map((item, i) => (
        <motion.span
          key={`${item.emoji}-${i}`}
          className={`absolute opacity-45 dark:opacity-35 ${item.size}`}
          style={{ left: item.left, top: item.top }}
          animate={{
            x: [0, item.x, item.x * -0.4, 0],
            y: [0, item.y, item.y * -0.35, 0],
            rotate: [0, 12, -10, 0],
          }}
          transition={{
            duration: item.duration,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </div>
  );
}
