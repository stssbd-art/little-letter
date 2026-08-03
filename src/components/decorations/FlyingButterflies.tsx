"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { useSound } from "@/components/providers/SoundProvider";

const BUTTERFLIES = [
  { left: "12%", top: "55%", duration: 12 },
  { left: "60%", top: "40%", duration: 15 },
  { left: "80%", top: "65%", duration: 18 },
];

export function FlyingButterflies() {
  const { butterflyFollow, toggleButterflyFollow } = useEasterEggs();
  const { play } = useSound();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!butterflyFollow) return;
    const onMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [butterflyFollow]);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {BUTTERFLIES.map((b, i) => (
          <motion.button
            key={i}
            type="button"
            className="absolute cursor-pointer border-0 bg-transparent text-2xl"
            style={{ left: b.left, top: b.top }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 20, 0],
              rotate: [0, 15, -10, 0],
            }}
            transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => {
              play("sparkle");
              toggleButterflyFollow();
            }}
            aria-label="Click butterfly to follow cursor"
          >
            🦋
          </motion.button>
        ))}
      </div>

      {butterflyFollow ? (
        <motion.div
          className="pointer-events-none fixed z-[70] text-2xl"
          animate={{ x: cursor.x + 18, y: cursor.y + 18 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          aria-hidden
        >
          🦋
        </motion.div>
      ) : null}
    </>
  );
}
