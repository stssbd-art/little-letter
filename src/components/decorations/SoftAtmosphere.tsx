"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ATMOSPHERE_MS = 2 * 60 * 1000; // a couple of minutes
const FADE_MS = 4000;

type Floater = {
  id: number;
  kind: "feather" | "fog";
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  rotate: number;
  opacity: number;
};

function buildFloaters(): Floater[] {
  const feathers: Floater[] = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    kind: "feather" as const,
    left: `${4 + ((i * 9.5) % 90)}%`,
    top: `${6 + ((i * 13) % 78)}%`,
    size: 14 + (i % 4) * 4,
    duration: 14 + (i % 5) * 2.2,
    delay: (i % 6) * 0.7,
    driftX: i % 2 === 0 ? 28 : -24,
    driftY: -18 - (i % 3) * 8,
    rotate: i % 2 === 0 ? 18 : -22,
    opacity: 0.18 + (i % 4) * 0.04,
  }));

  const fog: Floater[] = Array.from({ length: 6 }, (_, i) => ({
    id: 100 + i,
    kind: "fog" as const,
    left: `${-5 + i * 18}%`,
    top: `${12 + (i % 3) * 28}%`,
    size: 160 + (i % 3) * 80,
    duration: 22 + i * 3,
    delay: i * 1.1,
    driftX: i % 2 === 0 ? 40 : -36,
    driftY: i % 2 === 0 ? -12 : 14,
    rotate: 0,
    opacity: 0.12 + (i % 3) * 0.03,
  }));

  return [...feathers, ...fog];
}

export function SoftAtmosphere() {
  const reduceMotion = useReducedMotion();
  const floaters = useMemo(() => buildFloaters(), []);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(false);
      return;
    }
    const fadeAt = window.setTimeout(() => setFading(true), ATMOSPHERE_MS);
    const hideAt = window.setTimeout(
      () => setVisible(false),
      ATMOSPHERE_MS + FADE_MS
    );
    return () => {
      window.clearTimeout(fadeAt);
      window.clearTimeout(hideAt);
    };
  }, [reduceMotion]);

  if (!visible || reduceMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[15] overflow-hidden transition-opacity ease-out"
      style={{
        opacity: fading ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
      }}
      aria-hidden
    >
      {floaters.map((item) =>
        item.kind === "fog" ? (
          <motion.div
            key={item.id}
            className="absolute rounded-full blur-3xl"
            style={{
              left: item.left,
              top: item.top,
              width: item.size,
              height: item.size * 0.55,
              opacity: item.opacity,
              background:
                "radial-gradient(ellipse at center, rgba(255,251,242,0.85) 0%, rgba(246,213,138,0.18) 45%, transparent 72%)",
            }}
            animate={{
              x: [0, item.driftX, 0],
              y: [0, item.driftY, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : (
          <motion.span
            key={item.id}
            className="absolute select-none"
            style={{
              left: item.left,
              top: item.top,
              fontSize: item.size,
              opacity: item.opacity,
              filter: "blur(0.2px)",
            }}
            animate={{
              x: [0, item.driftX, item.driftX * 0.4, 0],
              y: [0, item.driftY, item.driftY * 0.5, 0],
              rotate: [0, item.rotate, -item.rotate * 0.6, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🪶
          </motion.span>
        )
      )}
    </div>
  );
}
