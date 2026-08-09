"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";

interface Petal {
  id: number;
  x: number;
  delay: number;
  emoji: string;
}

export function FallingPetals() {
  const { petalBurst } = useEasterEggs();
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const ambient = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      emoji: Math.random() > 0.5 ? "🍃" : "✨",
    }));
    setPetals(ambient);
  }, []);

  useEffect(() => {
    if (petalBurst === 0) return;
    const burst = Array.from({ length: 16 }, (_, i) => ({
      id: 1000 + petalBurst * 100 + i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      emoji: ["🍃", "🌿", "✨", "⭐"][i % 4]!,
    }));
    setPetals((prev) => [...prev, ...burst]);
    const t = window.setTimeout(() => {
      setPetals((prev) => prev.filter((p) => p.id < 1000 + petalBurst * 100));
    }, 5000);
    return () => window.clearTimeout(t);
  }, [petalBurst]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <AnimatePresence>
        {petals.map((petal) => (
          <motion.span
            key={petal.id}
            className="absolute text-lg"
            style={{ left: `${petal.x}%`, top: "-5%" }}
            initial={{ y: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              rotate: [0, 120, 240],
              x: [0, 30, -20, 10],
            }}
            transition={{
              duration: petal.id >= 1000 ? 4 : 14,
              delay: petal.delay,
              repeat: petal.id >= 1000 ? 0 : Infinity,
              ease: "linear",
            }}
          >
            {petal.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
