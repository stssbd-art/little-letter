"use client";

import { motion } from "framer-motion";
import type { CardDesignId } from "@/lib/card-designs";

type SceneProps = {
  compact?: boolean;
  accent: string;
  border: string;
  gid: string;
};

/** Full-bleed illustrated artwork for each e-card design */
export function CardSceneArt({
  designId,
  compact,
  accent,
  border,
  gid = "c",
}: {
  designId: CardDesignId;
  compact?: boolean;
  accent: string;
  border: string;
  gid?: string;
}) {
  const props = { compact, accent, border, gid };
  switch (designId) {
    case "balloon-bash":
      return <BalloonsScene {...props} />;
    case "cake-candles":
      return <CakeScene {...props} />;
    case "confetti-pop":
      return <ConfettiScene {...props} />;
    case "blush-hearts":
      return <HeartsScene {...props} />;
    case "rose-garden":
      return <RosesScene {...props} />;
    case "starlit-love":
      return <NightLoveScene {...props} />;
    case "buddy-highfive":
      return <MeadowScene {...props} />;
    case "rainbow-note":
      return <RainbowScene {...props} />;
    case "clover-luck":
      return <CloverScene {...props} />;
    case "sunflower-thanks":
      return <SunflowerScene {...props} />;
    case "sparkler-congrats":
      return <SparksScene {...props} />;
    case "soft-sorry":
      return <SoftCloudsScene {...props} />;
    case "wedding-rings":
      return <WeddingScene {...props} />;
    case "cap-toss":
      return <GradScene {...props} />;
    case "promo-rocket":
      return <RocketScene {...props} />;
    case "valentine-box":
      return <ValentineScene {...props} />;
    case "tulip-mum":
      return <TulipsScene {...props} />;
    case "tie-dad":
      return <DadScene {...props} />;
    case "honey-classic":
      return <HoneyScene {...props} />;
    case "moon-whisper":
      return <MoonScene {...props} />;
    case "pearl-locket":
      return <PearlLocketScene {...props} />;
    case "daisy-duo":
      return <DaisyDuoScene {...props} />;
    case "ivory-veil":
      return <IvoryVeilScene {...props} />;
    default:
      return <HoneyScene {...props} />;
  }
}

function BalloonsScene({ accent, gid }: SceneProps) {
  const balloons = [
    { cx: 55, cy: 70, r: 28, fill: "#ff6b8a", delay: 0 },
    { cx: 120, cy: 55, r: 32, fill: "#6bcBff", delay: 0.2 },
    { cx: 185, cy: 78, r: 26, fill: "#ffd166", delay: 0.4 },
    { cx: 90, cy: 100, r: 22, fill: "#c084fc", delay: 0.15 },
    { cx: 155, cy: 105, r: 20, fill: "#7ed957", delay: 0.35 },
  ];
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-bbSky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fd4ff" />
          <stop offset="55%" stopColor="#ffe8f0" />
          <stop offset="100%" stopColor="#fff6df" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-bbSky)`} />
      <ellipse cx="40" cy="40" rx="28" ry="14" fill="#fff" opacity="0.7" />
      <ellipse cx="200" cy="30" rx="34" ry="16" fill="#fff" opacity="0.65" />
      {balloons.map((b, i) => (
        <motion.g
          key={i}
          animate={{ y: [0, -6 - (i % 3) * 2, 0] }}
          transition={{
            duration: 2.4 + i * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        >
          <line
            x1={b.cx}
            y1={b.cy + b.r}
            x2={b.cx + (i % 2 === 0 ? 4 : -3)}
            y2={155}
            stroke={accent}
            strokeWidth="1.2"
            opacity="0.45"
          />
          <ellipse cx={b.cx} cy={b.cy} rx={b.r * 0.82} ry={b.r} fill={b.fill} />
          <ellipse
            cx={b.cx - b.r * 0.25}
            cy={b.cy - b.r * 0.3}
            rx={b.r * 0.22}
            ry={b.r * 0.3}
            fill="#fff"
            opacity="0.35"
          />
          <polygon
            points={`${b.cx - 4},${b.cy + b.r - 2} ${b.cx + 4},${b.cy + b.r - 2} ${b.cx},${b.cy + b.r + 6}`}
            fill={b.fill}
          />
        </motion.g>
      ))}
      <ellipse cx="120" cy="158" rx="110" ry="14" fill="#ffe0a8" opacity="0.9" />
    </svg>
  );
}

function CakeScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-cakeBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff0d4" />
          <stop offset="100%" stopColor="#f5c98a" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-cakeBg)`} />
      {[30, 70, 120, 170, 210].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={28 + (i % 3) * 8}
          r={2 + (i % 2)}
          fill={accent}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <ellipse cx="120" cy="148" rx="70" ry="10" fill={border} opacity="0.35" />
      <rect x="55" y="95" width="130" height="45" rx="6" fill="#fff8ee" stroke={border} strokeWidth="2" />
      <path
        d="M55 105 Q70 95 85 105 Q100 115 115 105 Q130 95 145 105 Q160 115 175 105 Q185 98 185 105 L185 115 L55 115 Z"
        fill="#ffb4c8"
      />
      <rect x="75" y="70" width="90" height="30" rx="5" fill="#fffaf0" stroke={border} strokeWidth="2" />
      <path
        d="M75 80 Q88 72 100 80 Q112 88 124 80 Q136 72 148 80 Q158 86 165 80 L165 88 L75 88 Z"
        fill="#ffd6e8"
      />
      {[95, 120, 145].map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y="48" width="4" height="22" rx="1" fill="#f6d58a" />
          <motion.ellipse
            cx={x}
            cy="44"
            rx="5"
            ry="7"
            fill="#ff9f43"
            animate={{ scaleY: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
            style={{ transformOrigin: `${x}px 48px` }}
          />
        </g>
      ))}
    </svg>
  );
}

function ConfettiScene({ accent, gid }: SceneProps) {
  const bits = Array.from({ length: 18 }, (_, i) => ({
    x: 20 + ((i * 37) % 200),
    y: 10 + ((i * 29) % 120),
    w: 6 + (i % 4),
    h: 4 + (i % 3),
    rot: (i * 40) % 360,
    fill: ["#ff6b8a", "#ffd166", "#6bcBff", "#9b7bff", "#7ed957", accent][i % 6],
  }));
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-confBg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe0f0" />
          <stop offset="50%" stopColor="#fff6df" />
          <stop offset="100%" stopColor="#d4f0ff" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-confBg)`} />
      <motion.circle
        cx="120"
        cy="80"
        r="36"
        fill="#fff"
        opacity="0.55"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ transformOrigin: "120px 80px" }}
      />
      <text x="120" y="92" textAnchor="middle" fontSize="42">
        🎊
      </text>
      {bits.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="1"
          fill={b.fill}
          animate={{
            y: [b.y, b.y + 18, b.y],
            rotate: [b.rot, b.rot + 60, b.rot],
          }}
          transition={{
            duration: 2 + (i % 5) * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
          style={{ transformOrigin: `${b.x}px ${b.y}px` }}
        />
      ))}
    </svg>
  );
}

function HeartsScene({ accent, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-heartBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe4ec" />
          <stop offset="100%" stopColor="#fde8d8" />
        </linearGradient>
        <radialGradient id={`${gid}-heartGlow`} cx="50%" cy="45%" r="40%">
          <stop offset="0%" stopColor="#ffb4c8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffb4c8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-heartBg)`} />
      <ellipse cx="120" cy="75" rx="90" ry="60" fill={`url(#${gid}-heartGlow)`} />
      {[
        { x: 70, y: 55, s: 1.1, d: 0 },
        { x: 130, y: 45, s: 1.4, d: 0.2 },
        { x: 160, y: 85, s: 0.9, d: 0.4 },
        { x: 95, y: 95, s: 0.75, d: 0.1 },
      ].map((h, i) => (
        <motion.path
          key={i}
          d={`M ${h.x} ${h.y + 8 * h.s}
             C ${h.x} ${h.y - 4 * h.s}, ${h.x - 16 * h.s} ${h.y - 4 * h.s}, ${h.x - 16 * h.s} ${h.y + 6 * h.s}
             C ${h.x - 16 * h.s} ${h.y + 18 * h.s}, ${h.x} ${h.y + 28 * h.s}, ${h.x} ${h.y + 28 * h.s}
             C ${h.x} ${h.y + 28 * h.s}, ${h.x + 16 * h.s} ${h.y + 18 * h.s}, ${h.x + 16 * h.s} ${h.y + 6 * h.s}
             C ${h.x + 16 * h.s} ${h.y - 4 * h.s}, ${h.x} ${h.y - 4 * h.s}, ${h.x} ${h.y + 8 * h.s} Z`}
          fill={i === 1 ? accent : ["#ff8fab", "#ffb4c8", "#ff6b8a", "#f472b6"][i]}
          opacity={0.85}
          animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
          transition={{
            duration: 2.8 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: h.d,
          }}
          style={{ transformOrigin: `${h.x}px ${h.y}px` }}
        />
      ))}
    </svg>
  );
}

function RosesScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-roseBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8e0e8" />
          <stop offset="60%" stopColor="#fff5f0" />
          <stop offset="100%" stopColor="#e8f0d8" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-roseBg)`} />
      <ellipse cx="120" cy="150" rx="100" ry="18" fill="#c5d4a0" opacity="0.7" />
      {[40, 85, 130, 175, 210].map((x, i) => (
        <g key={x}>
          <motion.line
            x1={x}
            y1={150}
            x2={x}
            y2={95 - (i % 3) * 8}
            stroke="#6f8a45"
            strokeWidth="3"
            animate={{ rotate: [i % 2 === 0 ? -2 : 2, i % 2 === 0 ? 2 : -2, i % 2 === 0 ? -2 : 2] }}
            transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${x}px 150px` }}
          />
          <ellipse cx={x - 8} cy={120} rx="7" ry="4" fill="#7aab6a" transform={`rotate(-25 ${x - 8} 120)`} />
          <circle cx={x} cy={88 - (i % 3) * 8} r="14" fill={i % 2 === 0 ? "#c97888" : accent} />
          <circle cx={x - 5} cy={85 - (i % 3) * 8} r="7" fill="#fff" opacity="0.25" />
          <circle cx={x} cy={88 - (i % 3) * 8} r="5" fill={border} opacity="0.5" />
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <motion.ellipse
          key={i}
          cx={50 + i * 45}
          cy={40}
          rx="5"
          ry="3"
          fill={accent}
          opacity="0.45"
          animate={{ y: [0, 70], x: [0, i % 2 === 0 ? 10 : -8], opacity: [0, 0.6, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}
    </svg>
  );
}

function NightLoveScene({ gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-nightBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2238" />
          <stop offset="70%" stopColor="#2a3550" />
          <stop offset="100%" stopColor="#3d2f4a" />
        </linearGradient>
        <radialGradient id={`${gid}-moonGlow`} cx="70%" cy="30%" r="30%">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-nightBg)`} />
      <ellipse cx="170" cy="45" rx="55" ry="45" fill={`url(#${gid}-moonGlow)`} />
      <motion.circle
        cx="170"
        cy="45"
        r="22"
        fill="#f7ecd4"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="178" cy="40" r="6" fill="#2a3550" opacity="0.25" />
      {Array.from({ length: 20 }, (_, i) => (
        <motion.circle
          key={i}
          cx={12 + ((i * 47) % 220)}
          cy={12 + ((i * 31) % 100)}
          r={i % 4 === 0 ? 1.8 : 1}
          fill="#ffe9a8"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.4 + (i % 5) * 0.3, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      <path
        d="M95 115 C95 100 75 100 75 112 C75 128 95 140 95 140 C95 140 115 128 115 112 C115 100 95 100 95 115 Z"
        fill="#ff8fab"
        opacity="0.85"
      />
    </svg>
  );
}

function MeadowScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-meadowBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dfead0" />
          <stop offset="50%" stopColor="#f5f7ec" />
          <stop offset="100%" stopColor="#a3b875" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-meadowBg)`} />
      <ellipse cx="50" cy="40" rx="30" ry="12" fill="#fff" opacity="0.7" />
      <ellipse cx="190" cy="35" rx="36" ry="14" fill="#fff" opacity="0.65" />
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="95" cy="95" r="22" fill="#ffe0b8" stroke={border} strokeWidth="2" />
        <circle cx="145" cy="95" r="22" fill="#ffe0b8" stroke={border} strokeWidth="2" />
        <path
          d="M115 100 Q120 108 125 100"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="88" cy="90" r="3" fill={accent} />
        <circle cx="102" cy="90" r="3" fill={accent} />
        <circle cx="138" cy="90" r="3" fill={accent} />
        <circle cx="152" cy="90" r="3" fill={accent} />
        <path
          d="M117 78 L120 55 L123 78 Z"
          fill="#7ed957"
          stroke={border}
          strokeWidth="1"
        />
      </motion.g>
      {[20, 55, 180, 215].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={130}
          r="6"
          fill={["#ffb4c8", "#ffd166", "#c084fc", "#7ed957"][i]}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function RainbowScene({ gid }: SceneProps) {
  const colors = ["#ff6b8a", "#ff9f68", "#ffd166", "#7ed957", "#6bcBff", "#9b7bff"];
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-rainBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f0ff" />
          <stop offset="100%" stopColor="#fff6df" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-rainBg)`} />
      {colors.map((c, i) => (
        <motion.path
          key={c}
          d={`M 20 ${130 - i * 7} Q 120 ${20 - i * 5} 220 ${130 - i * 7}`}
          fill="none"
          stroke={c}
          strokeWidth="7"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 1.4, delay: i * 0.08, ease: "easeOut" }}
        />
      ))}
      <ellipse cx="55" cy="125" rx="28" ry="14" fill="#fff" opacity="0.85" />
      <ellipse cx="185" cy="128" rx="32" ry="15" fill="#fff" opacity="0.85" />
      <motion.ellipse
        cx="120"
        cy="100"
        rx="18"
        ry="8"
        fill="#fff"
        opacity="0.7"
        animate={{ x: [-8, 8, -8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function CloverScene({ accent, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-cloverBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4f0d8" />
          <stop offset="100%" stopColor="#d8ead0" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-cloverBg)`} />
      {[50, 100, 150, 190].map((x, i) => (
        <motion.g
          key={x}
          animate={{ rotate: [i % 2 === 0 ? -4 : 4, i % 2 === 0 ? 4 : -4, i % 2 === 0 ? -4 : 4] }}
          transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${x}px 130px` }}
        >
          <line x1={x} y1={140} x2={x} y2={95} stroke="#4a7a3a" strokeWidth="3" />
          {[0, 90, 180, 270].map((ang) => {
            const rad = (ang * Math.PI) / 180;
            const cx = x + Math.cos(rad) * 12;
            const cy = 88 + Math.sin(rad) * 12;
            return <circle key={ang} cx={cx} cy={cy} r="10" fill={i === 1 ? accent : "#7aab6a"} />;
          })}
          <circle cx={x} cy={88} r="4" fill="#4a7a3a" />
        </motion.g>
      ))}
      <motion.circle
        cx="120"
        cy="40"
        r="3"
        fill="#ffd166"
        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "120px 40px" }}
      />
    </svg>
  );
}

function SunflowerScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-sunBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="100%" stopColor="#e8f0d4" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-sunBg)`} />
      <motion.circle
        cx="200"
        cy="30"
        r="22"
        fill="#ffd166"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "200px 30px" }}
      />
      {[60, 120, 175].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={150} x2={x} y2={100} stroke="#6f8a45" strokeWidth="4" />
          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${x}px 95px` }}
          >
            {Array.from({ length: 12 }, (_, p) => {
              const a = (p * 30 * Math.PI) / 180;
              return (
                <ellipse
                  key={p}
                  cx={x + Math.cos(a) * 18}
                  cy={95 + Math.sin(a) * 18}
                  rx="7"
                  ry="12"
                  fill="#ffd166"
                  transform={`rotate(${p * 30} ${x + Math.cos(a) * 18} ${95 + Math.sin(a) * 18})`}
                />
              );
            })}
            <circle cx={x} cy={95} r="12" fill={accent} stroke={border} strokeWidth="2" />
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

function SparksScene({ accent, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-sparkBg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe8a3" />
          <stop offset="50%" stopColor="#ffd6e8" />
          <stop offset="100%" stopColor="#d4e8ff" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-sparkBg)`} />
      {[60, 120, 180].map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y="90" width="4" height="50" rx="1" fill="#c4a574" />
          {Array.from({ length: 8 }, (_, s) => {
            const ang = (s * 45 * Math.PI) / 180;
            return (
              <motion.line
                key={s}
                x1={x}
                y1={85}
                x2={x + Math.cos(ang) * 28}
                y2={85 + Math.sin(ang) * 28}
                stroke={["#ff6b8a", "#ffd166", "#6bcBff", accent][s % 4]}
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{ opacity: [0.3, 1, 0.3], pathLength: [0.6, 1, 0.6] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1 + s * 0.05 }}
              />
            );
          })}
          <circle cx={x} cy={85} r="5" fill="#fff6df" stroke={accent} strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

function SoftCloudsScene({ accent, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-softBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0ecf8" />
          <stop offset="100%" stopColor="#e8e4f0" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-softBg)`} />
      {[
        { x: 50, y: 70, s: 1 },
        { x: 130, y: 55, s: 1.3 },
        { x: 190, y: 85, s: 0.9 },
      ].map((c, i) => (
        <motion.g
          key={i}
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse cx={c.x} cy={c.y} rx={28 * c.s} ry={16 * c.s} fill="#fff" opacity="0.9" />
          <ellipse
            cx={c.x - 18 * c.s}
            cy={c.y + 4}
            rx={18 * c.s}
            ry={12 * c.s}
            fill="#fff"
            opacity="0.85"
          />
          <ellipse
            cx={c.x + 16 * c.s}
            cy={c.y + 2}
            rx={16 * c.s}
            ry={11 * c.s}
            fill="#fff"
            opacity="0.85"
          />
        </motion.g>
      ))}
      <motion.path
        d="M120 115 C120 102 105 102 105 112 C105 126 120 136 120 136 C120 136 135 126 135 112 C135 102 120 102 120 115 Z"
        fill={accent}
        opacity="0.55"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "120px 120px" }}
      />
    </svg>
  );
}

function WeddingScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-wedBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8f0e4" />
          <stop offset="100%" stopColor="#f0e4d4" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-wedBg)`} />
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="105" cy="80" r="28" fill="none" stroke={border} strokeWidth="6" />
        <circle cx="135" cy="80" r="28" fill="none" stroke={accent} strokeWidth="6" />
        <circle cx="105" cy="80" r="22" fill="#fffcf7" />
        <circle cx="135" cy="80" r="22" fill="#fffcf7" />
      </motion.g>
      {[40, 70, 170, 200].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={40 + (i % 2) * 20}
          r="3"
          fill="#ffd166"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
      <path d="M60 140 Q120 120 180 140" fill="none" stroke="#e8c98a" strokeWidth="3" />
    </svg>
  );
}

function GradScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-gradBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0e8f8" />
          <stop offset="100%" stopColor="#e8f0d4" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-gradBg)`} />
      <motion.g
        animate={{ y: [0, -40], rotate: [0, -15], opacity: [1, 0.2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", repeatDelay: 0.8 }}
        style={{ transformOrigin: "120px 70px" }}
      >
        <rect x="95" y="55" width="50" height="12" rx="2" fill={accent} />
        <polygon points="120,40 145,55 95,55" fill={accent} />
        <rect x="140" y="55" width="4" height="28" fill="#ffd166" />
        <circle cx="142" cy="86" r="5" fill="#ff6b8a" />
      </motion.g>
      <rect x="70" y="100" width="100" height="40" rx="4" fill="#fff" stroke={border} strokeWidth="2" />
      <text x="120" y="125" textAnchor="middle" fontSize="11" fill={accent} fontFamily="Georgia, serif">
        GRAD
      </text>
    </svg>
  );
}

function RocketScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-rockBg`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ffe8d4" />
          <stop offset="100%" stopColor="#e0f0ff" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-rockBg)`} />
      {Array.from({ length: 12 }, (_, i) => (
        <circle
          key={i}
          cx={20 + ((i * 53) % 200)}
          cy={20 + ((i * 41) % 80)}
          r={1.5}
          fill={accent}
          opacity="0.4"
        />
      ))}
      <motion.g
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <polygon points="120,35 145,95 120,85 95,95" fill="#fff8ee" stroke={border} strokeWidth="2" />
        <circle cx="120" cy="65" r="8" fill="#6bcBff" stroke={accent} strokeWidth="2" />
        <polygon points="95,95 110,95 100,115" fill="#ff6b8a" />
        <polygon points="145,95 130,95 140,115" fill="#ff6b8a" />
        <motion.polygon
          points="112,95 120,125 128,95"
          fill="#ffd166"
          animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.8, 1.2, 0.8] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          style={{ transformOrigin: "120px 95px" }}
        />
      </motion.g>
    </svg>
  );
}

function ValentineScene({ accent, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-valBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd0dc" />
          <stop offset="100%" stopColor="#ffe4ec" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-valBg)`} />
      <motion.g
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        style={{ transformOrigin: "120px 85px" }}
      >
        <rect x="70" y="70" width="100" height="70" rx="8" fill="#fff8fa" stroke={accent} strokeWidth="3" />
        <path d="M70 78 L120 110 L170 78" fill="none" stroke={accent} strokeWidth="3" />
        <path
          d="M120 55 C120 42 100 42 100 55 C100 72 120 85 120 85 C120 85 140 72 140 55 C140 42 120 42 120 55 Z"
          fill="#ff6b8a"
        />
      </motion.g>
      {[45, 195].map((x, i) => (
        <motion.path
          key={x}
          d={`M${x} 50 C${x} 40 ${x - 12} 40 ${x - 12} 50 C${x - 12} 62 ${x} 70 ${x} 70 C${x} 70 ${x + 12} 62 ${x + 12} 50 C${x + 12} 40 ${x} 40 ${x} 50 Z`}
          fill="#ff8fab"
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </svg>
  );
}

function TulipsScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-tulipBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe4ec" />
          <stop offset="100%" stopColor="#e8f0d4" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-tulipBg)`} />
      <ellipse cx="120" cy="150" rx="100" ry="16" fill="#c5d4a0" opacity="0.75" />
      {[55, 95, 135, 175].map((x, i) => {
        const colors = ["#ff8fab", accent, "#f472b6", "#ffb4c8"];
        return (
          <motion.g
            key={x}
            animate={{ rotate: [i % 2 ? -4 : 4, i % 2 ? 4 : -4, i % 2 ? -4 : 4] }}
            transition={{ duration: 2.8 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${x}px 145px` }}
          >
            <line x1={x} y1={145} x2={x} y2={90} stroke="#6f8a45" strokeWidth="3" />
            <ellipse cx={x - 10} cy={115} rx="8" ry="4" fill="#7aab6a" />
            <path
              d={`M${x} 55 Q${x - 16} 75 ${x - 10} 90 Q${x} 82 ${x + 10} 90 Q${x + 16} 75 ${x} 55 Z`}
              fill={colors[i]}
              stroke={border}
              strokeWidth="1"
            />
          </motion.g>
        );
      })}
    </svg>
  );
}

function DadScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-dadBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8e4f0" />
          <stop offset="100%" stopColor="#e8e0d0" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-dadBg)`} />
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <rect x="95" y="40" width="50" height="18" rx="3" fill={accent} />
        <polygon points="105,58 120,100 135,58" fill={accent} />
        <polygon points="112,58 120,88 128,58" fill="#ffd166" opacity="0.5" />
        <rect x="100" y="100" width="40" height="8" rx="2" fill={border} />
      </motion.g>
      <rect x="55" y="120" width="130" height="22" rx="4" fill="#fff" stroke={border} strokeWidth="2" />
      <text x="120" y="135" textAnchor="middle" fontSize="10" fill={accent} fontFamily="Georgia, serif">
        for dad
      </text>
    </svg>
  );
}

function HoneyScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-honeyBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6df" />
          <stop offset="100%" stopColor="#f0e4c8" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-honeyBg)`} />
      <motion.g
        animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "120px 85px" }}
      >
        <rect x="55" y="55" width="130" height="80" rx="8" fill="#fffbf2" stroke={border} strokeWidth="3" />
        <path d="M55 70 L120 105 L185 70" fill="none" stroke={accent} strokeWidth="3" />
        <circle cx="120" cy="95" r="14" fill="#f6d58a" stroke={accent} strokeWidth="2" />
        <path d="M114 95 L118 99 L128 88" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      {[40, 200].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={40}
          r="4"
          fill="#ffd166"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </svg>
  );
}

function MoonScene({ gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-moonWhisperBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2840" />
          <stop offset="100%" stopColor="#3a2e48" />
        </linearGradient>
        <radialGradient id={`${gid}-mwGlow`} cx="30%" cy="35%" r="35%">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-moonWhisperBg)`} />
      <ellipse cx="70" cy="50" rx="50" ry="45" fill={`url(#${gid}-mwGlow)`} />
      <motion.path
        d="M70 30 A22 22 0 1 0 70 74 A16 16 0 1 1 70 30"
        fill="#f5ecd8"
        animate={{ rotate: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "70px 52px" }}
      />
      {Array.from({ length: 16 }, (_, i) => (
        <motion.circle
          key={i}
          cx={100 + ((i * 43) % 120)}
          cy={20 + ((i * 27) % 90)}
          r={i % 3 === 0 ? 1.6 : 1}
          fill="#ffe9a8"
          animate={{ opacity: [0.15, 0.95, 0.15] }}
          transition={{ duration: 1.8 + (i % 4) * 0.3, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
      <motion.ellipse
        cx="170"
        cy="120"
        rx="40"
        ry="10"
        fill="#2a3550"
        opacity="0.5"
        animate={{ x: [-6, 6, -6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function PearlLocketScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-pearlBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e8f4" />
          <stop offset="100%" stopColor="#efe4f0" />
        </linearGradient>
        <radialGradient id={`${gid}-pearlShine`} cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-pearlBg)`} />
      {[30, 55, 185, 210].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={28 + (i % 2) * 18}
          r={2 + (i % 2)}
          fill="#fff"
          opacity="0.85"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <line x1="120" y1="18" x2="120" y2="48" stroke={border} strokeWidth="2" />
      <circle cx="120" cy="16" r="4" fill="#e8d0e0" stroke={accent} strokeWidth="1.5" />
      <motion.g
        animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "120px 95px" }}
      >
        <circle cx="120" cy="95" r="42" fill="#fff8fb" stroke={border} strokeWidth="3" />
        <circle cx="120" cy="95" r="34" fill={`url(#${gid}-pearlShine)`} />
        <path
          d="M120 78 C120 68 105 68 105 78 C105 90 120 100 120 100 C120 100 135 90 135 78 C135 68 120 68 120 78 Z"
          fill={accent}
        />
        <circle cx="108" cy="82" r="3" fill="#fff" opacity="0.55" />
      </motion.g>
    </svg>
  );
}

function DaisyDuoScene({ accent, border, gid }: SceneProps) {
  const daisy = (cx: number, cy: number, scale: number, delay: number) => (
    <motion.g
      key={`${cx}-${cy}`}
      animate={{ rotate: [-4, 4, -4], y: [0, -3, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        const px = cx + Math.cos(a) * 18 * scale;
        const py = cy + Math.sin(a) * 18 * scale;
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={7 * scale}
            ry={12 * scale}
            fill="#fffdf5"
            stroke={border}
            strokeWidth="1"
            transform={`rotate(${(i * 45).toFixed(0)} ${px} ${py})`}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={10 * scale} fill="#ffd166" stroke={accent} strokeWidth="2" />
    </motion.g>
  );

  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-daisyBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6d8" />
          <stop offset="100%" stopColor="#e4f0d4" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-daisyBg)`} />
      <ellipse cx="120" cy="150" rx="110" ry="16" fill="#c5d4a0" opacity="0.75" />
      <line x1="85" y1="145" x2="85" y2="95" stroke="#6f8a45" strokeWidth="3" />
      <line x1="155" y1="145" x2="155" y2="88" stroke="#6f8a45" strokeWidth="3" />
      <ellipse cx="75" cy="120" rx="8" ry="4" fill="#7aab6a" />
      <ellipse cx="165" cy="115" rx="8" ry="4" fill="#7aab6a" />
      {daisy(85, 78, 1, 0)}
      {daisy(155, 70, 1.1, 0.25)}
      <motion.circle
        cx="120"
        cy="40"
        r="3"
        fill="#ffd166"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

function IvoryVeilScene({ accent, border, gid }: SceneProps) {
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${gid}-veilBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7f1e8" />
          <stop offset="100%" stopColor="#efe6d8" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#${gid}-veilBg)`} />
      {[35, 60, 180, 205].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={30 + (i % 2) * 14}
          r="2.5"
          fill="#fff"
          animate={{ opacity: [0.25, 0.95, 0.25], y: [0, -7, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <motion.path
        d="M70 55 Q120 30 170 55 Q155 110 120 130 Q85 110 70 55 Z"
        fill="#fffcf8"
        stroke={border}
        strokeWidth="2"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <path
        d="M95 70 C95 58 110 58 120 70 C130 58 145 58 145 70 C145 88 120 105 120 105 C120 105 95 88 95 70 Z"
        fill="#e8d8c8"
        opacity="0.55"
      />
      <circle cx="100" cy="78" r="7" fill="#f0e4d4" stroke={accent} strokeWidth="1.5" />
      <circle cx="120" cy="72" r="8" fill="#fff8ee" stroke={accent} strokeWidth="1.5" />
      <circle cx="140" cy="78" r="7" fill="#f0e4d4" stroke={accent} strokeWidth="1.5" />
      <circle cx="120" cy="88" r="5" fill="#d4c0a0" />
      <path d="M55 135 Q120 115 185 135" fill="none" stroke="#e8c98a" strokeWidth="2.5" />
    </svg>
  );
}
