/** Small hand-drawn accents from the Stitch Artifact's visual language. All decorative. */

type DoodleProps = { className?: string; style?: React.CSSProperties };

/** Dashed, hand-drawn arrow. `variant` picks the path shape. */
export function Arrow({
  variant = "down-right",
  tone = "lavender",
  className = "",
  style,
}: DoodleProps & {
  variant?: "down-right" | "down-left" | "up-left" | "right";
  tone?: "lavender" | "orange" | "ink";
}) {
  const stroke =
    tone === "orange" ? "var(--color-orange-ink)" : tone === "ink" ? "var(--color-ink-2)" : "var(--color-lavender-ink)";
  const shapes = {
    "down-right": { vb: "0 0 90 90", st: "M8 6C14 44 34 70 78 80", hd: "M62 70l17 10-14 13", dir: "down" },
    "down-left": { vb: "0 0 90 90", st: "M82 6C76 44 56 70 12 80", hd: "M28 70L11 80l14 13", dir: "down" },
    "up-left": { vb: "0 0 70 90", st: "M52 84C20 76 8 52 18 10", hd: "M8 22L18 8l9 15", dir: "up" },
    right: { vb: "0 0 110 60", st: "M6 44C34 50 70 44 98 16", hd: "M82 14l17 1-4 16", dir: undefined },
  } as const;
  const s = shapes[variant];
  return (
    <svg
      aria-hidden="true"
      viewBox={s.vb}
      className={`arrow draw ${className}`}
      data-dir={s.dir}
      style={{ stroke, ...style }}
    >
      <path className="st" d={s.st} />
      <path className="hd" d={s.hd} />
    </svg>
  );
}

export function Sparkle({ className = "", style }: DoodleProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style}>
      <path
        d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"
        stroke="var(--color-orange)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Squiggle({ className = "", style }: DoodleProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 90 26" className={className} style={style}>
      <path
        d="M3 18c10-14 18-14 24 0s16 14 24 0 18-14 36-4"
        fill="none"
        stroke="var(--color-lavender)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A stitched thread: the brand's dashed-line motif, used to connect steps. */
export function Thread({ d, className = "", style }: DoodleProps & { d: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 120" preserveAspectRatio="none" className={className} style={style}>
      <path
        d={d}
        fill="none"
        stroke="var(--color-orange)"
        strokeWidth="3"
        strokeDasharray="12 10"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
