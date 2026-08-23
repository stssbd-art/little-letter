/** Realistic perforated postage stamp + circular postmark. */

type StampColors = { bg: string; ink: string; border: string };

type Props = {
  emoji: string;
  label: string;
  colors: StampColors;
  postmarkColor: string;
  className?: string;
};

/** Build a scalloped (perforated) rectangle path. */
function perforatedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  tooth: number
) {
  const pts: string[] = [];
  const push = (px: number, py: number) => pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);

  // Top edge →
  for (let i = 0; i <= w; i += tooth) {
    const cx = x + Math.min(i, w);
    push(cx, y);
    if (i < w) push(cx + tooth / 2, y - tooth * 0.45);
  }
  // Right edge ↓
  for (let i = tooth; i <= h; i += tooth) {
    const cy = y + Math.min(i, h);
    push(x + w, cy);
    if (i < h) push(x + w + tooth * 0.45, cy + tooth / 2);
  }
  // Bottom edge ←
  for (let i = tooth; i <= w; i += tooth) {
    const cx = x + w - Math.min(i, w);
    push(cx, y + h);
    if (i < w) push(cx - tooth / 2, y + h + tooth * 0.45);
  }
  // Left edge ↑
  for (let i = tooth; i < h; i += tooth) {
    const cy = y + h - Math.min(i, h);
    push(x, cy);
    push(x - tooth * 0.45, cy - tooth / 2);
  }

  return `M ${pts[0]} L ${pts.slice(1).join(" L ")} Z`;
}

export function PostageStamp({
  emoji,
  label,
  colors,
  postmarkColor,
  className,
}: Props) {
  const path = perforatedRect(4, 5, 40, 52, 4);

  return (
    <div
      className={className}
      style={{ transform: "rotate(7deg)" }}
      aria-hidden
    >
      <div className="relative">
        <svg
          viewBox="0 0 56 68"
          className="h-[4.25rem] w-[3.5rem] drop-shadow-[2px_2px_0_rgba(61,47,34,0.22)]"
        >
          <path d={path} fill={colors.bg} stroke={colors.border} strokeWidth="1.2" />
          {/* Inner frame like a real stamp vignette */}
          <rect
            x="9"
            y="10"
            width="30"
            height="42"
            fill="none"
            stroke={colors.border}
            strokeWidth="0.9"
            opacity="0.85"
          />
          <text
            x="24"
            y="16.5"
            textAnchor="middle"
            fill={colors.ink}
            fontSize="3.2"
            fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="0.6"
            opacity="0.9"
          >
            LITTLE LETTER
          </text>
          {/* Picture well */}
          <rect
            x="11.5"
            y="19"
            width="25"
            height="22"
            rx="1"
            fill="#fffef8"
            stroke={colors.border}
            strokeWidth="0.6"
            opacity="0.95"
          />
          <text
            x="24"
            y="34"
            textAnchor="middle"
            fontSize="12"
          >
            {emoji}
          </text>
          <text
            x="24"
            y="48.5"
            textAnchor="middle"
            fill={colors.ink}
            fontSize="5.5"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="700"
          >
            {label}
          </text>
        </svg>

        {/* Circular cancellation postmark */}
        <svg
          className="pointer-events-none absolute -left-3 top-4 h-11 w-11 opacity-80"
          viewBox="0 0 44 44"
        >
          <circle
            cx="22"
            cy="22"
            r="16"
            fill="none"
            stroke={postmarkColor}
            strokeWidth="1.4"
          />
          <circle
            cx="22"
            cy="22"
            r="11.5"
            fill="none"
            stroke={postmarkColor}
            strokeWidth="0.9"
          />
          <text
            x="22"
            y="18"
            textAnchor="middle"
            fill={postmarkColor}
            fontSize="4"
            fontFamily="monospace"
            letterSpacing="0.4"
          >
            POSTED
          </text>
          <text
            x="22"
            y="26"
            textAnchor="middle"
            fill={postmarkColor}
            fontSize="3.5"
            fontFamily="monospace"
          >
            MAIL
          </text>
          {/* wavy killer bars */}
          <path
            d="M2 30 Q8 28 14 30 T26 30 T38 30"
            fill="none"
            stroke={postmarkColor}
            strokeWidth="1.1"
          />
          <path
            d="M2 34 Q8 32 14 34 T26 34 T38 34"
            fill="none"
            stroke={postmarkColor}
            strokeWidth="1.1"
          />
        </svg>
      </div>
    </div>
  );
}
