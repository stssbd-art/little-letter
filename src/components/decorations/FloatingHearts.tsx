"use client";

import { motion } from "framer-motion";

const HEARTS = ["⭐", "✨", "💌", "🦋"];

export function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-base opacity-50"
          style={{ left: `${10 + i * 15}%`, bottom: "-5%" }}
          animate={{ y: ["0vh", "-110vh"], opacity: [0, 0.7, 0] }}
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
