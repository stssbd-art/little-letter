"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ATMOSPHERE_MS = 2 * 60 * 1000;
const FADE_MS = 5000;

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

function FeatherSvg({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 40 54"
      fill="none"
      aria-hidden
      style={{ display: "block", filter: "drop-shadow(0 1px 2px rgba(139,94,52,0.12))" }}
    >
      <path
        d="M20 2C12 10 6 22 8 34c1.2 7 5.5 12 12 16 6.5-4 10.8-9 12-16 2-12-4-24-12-32Z"
        fill="rgba(255,251,242,0.92)"
        stroke="rgba(203,184,146,0.75)"
        strokeWidth="1.2"
      />
      <path
        d="M20 6v40"
        stroke="rgba(168,140,98,0.55)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M20 14c-4 2-7 5-8 9M20 22c4 2 7 5 8 9M20 30c-3.5 2-6 4.5-7 7"
        stroke="rgba(168,140,98,0.4)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function buildFloaters(): Floater[] {
  const feathers: Floater[] = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    kind: "feather" as const,
    left: `${3 + ((i * 7.1) % 92)}%`,
    top: `${4 + ((i * 11.3) % 82)}%`,
    size: 22 + (i % 5) * 6,
    duration: 12 + (i % 5) * 2,
    delay: (i % 7) * 0.45,
    driftX: i % 2 === 0 ? 36 : -32,
    driftY: -28 - (i % 4) * 10,
    rotate: i % 2 === 0 ? 26 : -30,
    opacity: 0.55 + (i % 4) * 0.08,
  }));

  const fog: Floater[] = Array.from({ length: 8 }, (_, i) => ({
    id: 100 + i,
    kind: "fog" as const,
    left: `${-8 + i * 14}%`,
    top: `${8 + (i % 4) * 22}%`,
    size: 220 + (i % 4) * 90,
    duration: 18 + i * 2.5,
    delay: i * 0.8,
    driftX: i % 2 === 0 ? 50 : -44,
    driftY: i % 2 === 0 ? -16 : 18,
    rotate: 0,
    opacity: 0.35 + (i % 3) * 0.08,
  }));

  return [...fog, ...feathers];
}

export function SoftAtmosphere() {
  const reduceMotion = useReducedMotion();
  const floaters = useMemo(() => buildFloaters(), []);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeAt = window.setTimeout(() => setFading(true), ATMOSPHERE_MS);
    const hideAt = window.setTimeout(
      () => setVisible(false),
      ATMOSPHERE_MS + FADE_MS
    );
    return () => {
      window.clearTimeout(fadeAt);
      window.clearTimeout(hideAt);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[35] overflow-hidden transition-opacity ease-out"
      style={{
        opacity: fading ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
      }}
      aria-hidden
    >
      {/* Soft full-screen mist wash so the effect is obvious on cream bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 15%, rgba(255,255,255,0.45) 0%, transparent 55%), radial-gradient(ellipse 70% 45% at 85% 25%, rgba(246,213,138,0.28) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 50% 90%, rgba(255,251,242,0.4) 0%, transparent 55%)",
        }}
      />

      {floaters.map((item) =>
        item.kind === "fog" ? (
          <motion.div
            key={item.id}
            className="absolute rounded-full"
            style={{
              left: item.left,
              top: item.top,
              width: item.size,
              height: item.size * 0.5,
              opacity: item.opacity,
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, rgba(255,246,223,0.45) 40%, transparent 70%)",
              filter: "blur(28px)",
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, item.driftX, 0],
                    y: [0, item.driftY, 0],
                    scale: [1, 1.12, 1],
                  }
            }
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : (
          <motion.div
            key={item.id}
            className="absolute"
            style={{
              left: item.left,
              top: item.top,
              opacity: item.opacity,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, item.driftX, item.driftX * 0.35, 0],
                    y: [0, item.driftY, item.driftY * 0.45, 0],
                    rotate: [0, item.rotate, -item.rotate * 0.55, 0],
                  }
            }
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FeatherSvg size={item.size} />
          </motion.div>
        )
      )}
    </div>
  );
}
