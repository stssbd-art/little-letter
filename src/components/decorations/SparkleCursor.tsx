"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/components/providers/SoundProvider";

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

export function SparkleCursor() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const { play } = useSound();

  useEffect(() => {
    let id = 0;
    let last = 0;

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < 60) return;
      last = now;
      const next = { id: id++, x: e.clientX, y: e.clientY };
      setSparkles((prev) => [...prev.slice(-18), next]);
      if (id % 12 === 0) play("sparkle");
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [play]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          initial={{ opacity: 0.9, scale: 0.4 }}
          animate={{ opacity: 0, scale: 1.4, y: -18 }}
          transition={{ duration: 0.7 }}
          className="absolute text-[10px]"
          style={{ left: s.x, top: s.y }}
        >
          ✨
        </motion.span>
      ))}
    </div>
  );
}
