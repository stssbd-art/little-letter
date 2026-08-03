"use client";

import { motion } from "framer-motion";

const ENVELOPES = [
  { left: "8%", top: "70%", delay: 0 },
  { left: "35%", top: "78%", delay: 1.5 },
  { left: "72%", top: "68%", delay: 0.8 },
  { left: "90%", top: "82%", delay: 2.2 },
];

export function FloatingEnvelopes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {ENVELOPES.map((item, i) => (
        <motion.span
          key={i}
          className="absolute text-xl opacity-60"
          style={{ left: item.left, top: item.top }}
          animate={{ y: [0, -24, 0], rotate: [-8, 8, -8] }}
          transition={{
            duration: 5 + i,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          💌
        </motion.span>
      ))}
    </div>
  );
}
