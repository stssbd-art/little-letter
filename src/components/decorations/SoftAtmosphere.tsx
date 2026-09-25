"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ATMOSPHERE_MS = 2 * 60 * 1000;
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

function FeatherSvg({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 40 54"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <path
        d="M20 2C12 10 6 22 8 34c1.2 7 5.5 12 12 16 6.5-4 10.8-9 12-16 2-12-4-24-12-32Z"
        fill="rgba(255,251,242,0.88)"
        stroke="rgba(203,184,146,0.65)"
        strokeWidth="1.1"
      />
      <path
        d="M20 6v40"
        stroke="rgba(168,140,98,0.45)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function buildFloaters(): Floater[] {
  const feathers: Floater[] = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    kind: "feather" as const,
    left: `${6 + ((i * 12) % 86)}%`,
    top: `${8 + ((i * 14) % 75)}%`,
    size: 12 + (i % 3) * 3,
    duration: 16 + (i % 4) * 2,
    delay: (i % 5) * 0.6,
    driftX: i % 2 === 0 ? 18 : -16,
    driftY: -14 - (i % 3) * 6,
    rotate: i % 2 === 0 ? 14 : -16,
    opacity: 0.4 + (i % 3) * 0.06,
  }));

  const fog: Floater[] = Array.from({ length: 4 }, (_, i) => ({
    id: 100 + i,
    kind: "fog" as const,
    left: `${5 + i * 22}%`,
    top: `${18 + (i % 2) * 35}%`,
    size: 90 + (i % 3) * 30,
    duration: 20 + i * 3,
    delay: i * 1.2,
    driftX: i % 2 === 0 ? 22 : -20,
    driftY: i % 2 === 0 ? -8 : 10,
    rotate: 0,
    opacity: 0.22 + (i % 2) * 0.06,
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
                "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,246,223,0.35) 45%, transparent 72%)",
              filter: "blur(18px)",
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, item.driftX, 0],
                    y: [0, item.driftY, 0],
                    scale: [1, 1.06, 1],
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
