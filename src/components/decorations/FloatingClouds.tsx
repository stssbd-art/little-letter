"use client";

import { motion } from "framer-motion";

const CLOUDS = [
  { left: "6%", top: "12%", size: "text-3xl", duration: 28, delay: 0 },
  { left: "22%", top: "28%", size: "text-2xl", duration: 34, delay: 2 },
  { left: "48%", top: "8%", size: "text-4xl", duration: 40, delay: 1 },
  { left: "70%", top: "22%", size: "text-2xl", duration: 32, delay: 4 },
  { left: "85%", top: "14%", size: "text-3xl", duration: 36, delay: 3 },
];

export function FloatingClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {CLOUDS.map((cloud, i) => (
        <motion.span
          key={i}
          className={`absolute opacity-70 ${cloud.size}`}
          style={{ left: cloud.left, top: cloud.top }}
          animate={{ x: [0, 10, -6, 0], y: [0, -4, 3, 0] }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: "easeInOut",
          }}
        >
          ☁️
        </motion.span>
      ))}
    </div>
  );
}
