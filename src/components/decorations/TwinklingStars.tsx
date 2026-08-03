"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";

interface Star {
  id: number;
  x: number;
  y: number;
}

export function TwinklingStars() {
  const { starsBurst } = useEasterEggs();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 60,
      }))
    );
  }, []);

  useEffect(() => {
    if (starsBurst === 0) return;
    const burst = Array.from({ length: 20 }, (_, i) => ({
      id: 500 + starsBurst * 50 + i,
      x: Math.random() * 100,
      y: Math.random() * 80,
    }));
    setStars((prev) => [...prev, ...burst]);
    const t = window.setTimeout(() => {
      setStars((prev) => prev.filter((s) => s.id < 500));
    }, 3500);
    return () => window.clearTimeout(t);
  }, [starsBurst]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <AnimatePresence>
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="absolute text-sm"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: star.id >= 500 ? [0, 1, 0] : [0.2, 1, 0.2],
              scale: star.id >= 500 ? [0.4, 1.4, 0.2] : [0.8, 1.2, 0.8],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: star.id >= 500 ? 2 : 2.8,
              repeat: star.id >= 500 ? 0 : Infinity,
              delay: (star.id % 7) * 0.2,
            }}
          >
            ⭐
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
