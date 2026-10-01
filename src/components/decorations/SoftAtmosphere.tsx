"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

type Feather = {
  id: number;
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
      height={size * 1.45}
      viewBox="0 0 40 58"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <path
        d="M20 3C11 12 5 24 8 36c1.4 7 6 12.5 12 17 6-4.5 10.6-10 12-17 3-12-3-24-12-33Z"
        fill="rgba(255,252,246,0.72)"
        stroke="rgba(176,154,122,0.55)"
        strokeWidth="1"
      />
      <path
        d="M20 8c-2.2 6-3.2 12-2.4 18"
        stroke="rgba(196,176,146,0.45)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <path
        d="M20 8c2.4 6 3.4 12 2.5 18"
        stroke="rgba(196,176,146,0.45)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <path
        d="M20 7v42"
        stroke="rgba(168,140,98,0.5)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function buildFeathers(): Feather[] {
  return Array.from({ length: 7 }, (_, i) => ({
    id: i,
    left: `${6 + ((i * 13) % 84)}%`,
    top: `${8 + ((i * 15) % 74)}%`,
    size: 16 + (i % 3) * 4,
    duration: 22 + (i % 4) * 4,
    delay: (i % 5) * 0.7,
    driftX: i % 2 === 0 ? 36 + (i % 3) * 10 : -(32 + (i % 3) * 8),
    driftY: -16 - (i % 3) * 6,
    rotate: i % 2 === 0 ? 12 : -14,
    opacity: 0.55 + (i % 3) * 0.08,
  }));
}

export function SoftAtmosphere() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const reduceMotion = useReducedMotion();
  const feathers = useMemo(() => buildFeathers(), []);

  if (!onHome) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[35] overflow-hidden"
      aria-hidden
    >
      {feathers.map((feather) => (
        <motion.div
          key={feather.id}
          className="absolute"
          style={{
            left: feather.left,
            top: feather.top,
            opacity: feather.opacity,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, feather.driftX, feather.driftX * 0.3, 0],
                  y: [0, feather.driftY, feather.driftY * 0.45, 0],
                  rotate: [0, feather.rotate, -feather.rotate * 0.5, 0],
                }
          }
          transition={{
            duration: feather.duration,
            delay: feather.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FeatherSvg size={feather.size} />
        </motion.div>
      ))}
    </div>
  );
}
