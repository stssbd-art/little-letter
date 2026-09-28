"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

type Cloud = {
  id: number;
  left: string;
  top: string;
  width: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  opacity: number;
};

function CloudSvg({ width }: { width: number }) {
  return (
    <svg
      width={width}
      height={width * 0.62}
      viewBox="0 0 64 40"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <ellipse cx="32" cy="30" rx="22" ry="7" fill="rgba(186, 198, 214, 0.28)" />
      <ellipse cx="22" cy="24" rx="12" ry="9" fill="#fff" />
      <ellipse cx="36" cy="20" rx="14" ry="11" fill="#fff" />
      <ellipse cx="48" cy="25" rx="10" ry="8" fill="#fff" />
      <ellipse cx="33" cy="27" rx="20" ry="8" fill="#fffefb" />
    </svg>
  );
}

function buildClouds(): Cloud[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: i,
    left: `${4 + ((i * 11) % 88)}%`,
    top: `${6 + ((i * 13) % 78)}%`,
    width: 28 + (i % 4) * 8,
    duration: 26 + (i % 5) * 4,
    delay: (i % 6) * 0.8,
    driftX: i % 2 === 0 ? 70 + (i % 3) * 18 : -(64 + (i % 3) * 16),
    driftY: i % 2 === 0 ? -18 - (i % 3) * 6 : 14 + (i % 3) * 5,
    opacity: 0.72 + (i % 3) * 0.08,
  }));
}

export function SoftAtmosphere() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const reduceMotion = useReducedMotion();
  const clouds = useMemo(() => buildClouds(), []);

  if (!onHome) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[35] overflow-hidden"
      aria-hidden
    >
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute"
          style={{
            left: cloud.left,
            top: cloud.top,
            opacity: cloud.opacity,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, cloud.driftX, cloud.driftX * 0.35, 0],
                  y: [0, cloud.driftY, cloud.driftY * 0.4, 0],
                }
          }
          transition={{
            duration: cloud.duration,
            delay: cloud.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <CloudSvg width={cloud.width} />
        </motion.div>
      ))}
    </div>
  );
}
