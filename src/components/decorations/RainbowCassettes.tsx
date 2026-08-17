"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const RAINBOWS = [
  { className: "left-3 top-24 sm:left-6", width: 28, duration: 22, x: 4, y: -3 },
  { className: "right-3 top-28 sm:right-8", width: 32, duration: 26, x: -4, y: 3 },
  { className: "left-5 bottom-16 sm:left-10", width: 24, duration: 24, x: 3, y: 2 },
  { className: "right-6 bottom-20 sm:right-12", width: 26, duration: 28, x: -3, y: -2 },
];

function RainbowArch({ width }: { width: number }) {
  return (
    <svg
      width={width}
      height={Math.round(width * 0.58)}
      viewBox="0 0 200 116"
      aria-hidden
      className="opacity-30 drop-shadow-none"
    >
      <path d="M12 108 A88 88 0 0 1 188 108" fill="none" stroke="#e85d4c" strokeWidth="10" strokeLinecap="round" />
      <path d="M24 108 A76 76 0 0 1 176 108" fill="none" stroke="#f4a261" strokeWidth="10" strokeLinecap="round" />
      <path d="M36 108 A64 64 0 0 1 164 108" fill="none" stroke="#f6e05e" strokeWidth="10" strokeLinecap="round" />
      <path d="M48 108 A52 52 0 0 1 152 108" fill="none" stroke="#68c17c" strokeWidth="10" strokeLinecap="round" />
      <path d="M60 108 A40 40 0 0 1 140 108" fill="none" stroke="#5b8def" strokeWidth="10" strokeLinecap="round" />
      <path d="M72 108 A28 28 0 0 1 128 108" fill="none" stroke="#9b6bdb" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

export function RainbowCassettes({ reduceMotion = false }: { reduceMotion?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[2]" aria-hidden>
      {RAINBOWS.map((r, i) => (
        <motion.div
          key={i}
          className={`absolute ${r.className}`}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, r.x, r.x * -0.4, 0],
                  y: [0, r.y, r.y * -0.35, 0],
                }
          }
          transition={{
            duration: r.duration,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <RainbowArch width={r.width} />
        </motion.div>
      ))}
    </div>,
    document.body
  );
}
