"use client";

import { motion } from "framer-motion";

const FLYERS = [
  { emoji: "💌", left: "6%", top: "18%", size: "text-lg", duration: 18, x: 10, y: -8 },
  { emoji: "🌈", left: "78%", top: "10%", size: "text-[10px]", duration: 22, x: 6, y: -4 },
  { emoji: "⭐", left: "18%", top: "72%", size: "text-sm", duration: 14, x: 8, y: -10 },
  { emoji: "✨", left: "88%", top: "58%", size: "text-base", duration: 20, x: -8, y: -6 },
  { emoji: "☁️", left: "42%", top: "8%", size: "text-2xl", duration: 32, x: 14, y: 4 },
  { emoji: "🍀", left: "62%", top: "78%", size: "text-base", duration: 17, x: -6, y: -8 },
  { emoji: "📼", left: "10%", top: "44%", size: "text-sm", duration: 20, x: 6, y: -4 },
  { emoji: "🌙", left: "92%", top: "12%", size: "text-lg", duration: 26, x: -6, y: 4 },
  { emoji: "🌈", left: "8%", top: "12%", size: "text-[10px]", duration: 24, x: 4, y: 3 },
  { emoji: "📼", left: "84%", top: "76%", size: "text-xs", duration: 18, x: -4, y: -4 },
  { emoji: "🌈", left: "48%", top: "84%", size: "text-[10px]", duration: 21, x: -3, y: -5 },
  { emoji: "📼", left: "70%", top: "28%", size: "text-sm", duration: 19, x: 4, y: 3 },
  { emoji: "💌", left: "52%", top: "88%", size: "text-sm", duration: 19, x: 6, y: -10 },
] as const;

export function WhimsicalFlyers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {FLYERS.map((item, i) => (
        <motion.span
          key={`${item.emoji}-${i}`}
          className={`absolute ${
            item.emoji === "🌈" ? "opacity-25" : "opacity-50 dark:opacity-40"
          } ${item.size}`}
          style={{ left: item.left, top: item.top }}
          animate={{
            x: [0, item.x, item.x * -0.4, 0],
            y: [0, item.y, item.y * -0.35, 0],
            rotate: [0, 3, -2, 0],
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
