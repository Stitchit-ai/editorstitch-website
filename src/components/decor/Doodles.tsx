/** Small hand-drawn accents from the Stitch Artifact's visual language. All decorative. */

type DoodleProps = { className?: string; style?: React.CSSProperties };
type Tone = "lavender" | "orange" | "ink";

const toneStroke = (tone: Tone) =>
  tone === "orange" ? "var(--color-orange-ink)" : tone === "ink" ? "var(--color-ink-2)" : "var(--color-lavender-ink)";

/** Dashed, hand-drawn arrow. `variant` picks the path shape. */
export function Arrow({
  variant = "down-right",
  tone = "lavender",
  className = "",
  style,
}: DoodleProps & {
  variant?: "down-right" | "down-left" | "up-left" | "right" | "arc-down";
  tone?: Tone;
}) {
  const stroke = toneStroke(tone);
  const shapes = {
    "down-right": { vb: "0 0 90 90", st: "M8 6C14 44 34 70 78 80", hd: "M62 70l17 10-14 13", dir: "down" },
    "down-left": { vb: "0 0 90 90", st: "M82 6C76 44 56 70 12 80", hd: "M28 70L11 80l14 13", dir: "down" },
    "up-left": { vb: "0 0 70 90", st: "M52 84C20 76 8 52 18 10", hd: "M8 22L18 8l9 15", dir: "up" },
    // Arches over to the right, then drops: the hollow of the curve faces what it points at below.
    "arc-down": { vb: "0 0 100 90", st: "M6 22C30 2 70 2 84 74", hd: "M71 64l13 13 9-16", dir: "down" },
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

/** A star: four sharp points by default, or a classic five-point one. */
export function Star({
  points = 4,
  tone = "orange",
  className = "",
  style,
}: DoodleProps & { points?: 4 | 5; tone?: "orange" | "lavender" | "coral" }) {
  const fill = tone === "orange" ? "var(--color-orange)" : tone === "lavender" ? "var(--color-lavender)" : "var(--color-coral)";
  const d =
    points === 4
      ? "M12 1C12.6 7.4 16.6 11.4 23 12C16.6 12.6 12.6 16.6 12 23C11.4 16.6 7.4 12.6 1 12C7.4 11.4 11.4 7.4 12 1Z"
      : "M12 1.4L14.7 8.3L22.4 8.6L16.4 13.4L18.5 20.9L12 16.6L5.5 20.9L7.6 13.4L1.6 8.6L9.3 8.3Z";
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} style={style}>
      <path d={d} fill={fill} stroke={fill} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function Squiggle({ tone = "lavender", className = "", style }: DoodleProps & { tone?: Tone }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 90 26" className={className} style={style}>
      <path
        d="M3 18c10-14 18-14 24 0s16 14 24 0 18-14 36-4"
        fill="none"
        stroke={tone === "lavender" ? "var(--color-lavender)" : toneStroke(tone)}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A stitched thread: the brand's dashed-line motif, used to connect steps. */
export function Thread({
  d,
  width = 3,
  viewBox = "0 0 400 120",
  className = "",
  style,
}: DoodleProps & { d: string; width?: number; viewBox?: string }) {
  return (
    <svg aria-hidden="true" viewBox={viewBox} preserveAspectRatio="none" className={className} style={style}>
      <path
        d={d}
        fill="none"
        stroke="var(--color-orange)"
        strokeWidth={width}
        strokeDasharray="12 10"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
