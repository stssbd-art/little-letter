"use client";

import { motion } from "framer-motion";

const HEARTS = ["⭐", "✨", "💌", "📼"];

export function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-base opacity-50"
          style={{ left: `${10 + i * 15}%`, bottom: `${12 + (i % 3) * 18}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.35, 0.7, 0.35] }}
          transition={{
            duration: 12 + i * 2,
            delay: i * 1.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          {HEARTS[i % HEARTS.length]}
        </motion.span>
      ))}
    </div>
  );
}
