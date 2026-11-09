/**
 * A timeline ruler with timecode labels: a quiet editorial divider.
 * Decorative only (aria-hidden).
 */
type TimecodeProps = {
  /** Labels placed at evenly spaced major ticks. */
  marks?: string[];
  className?: string;
};

export function Timecode({
  marks = ["00:00:00:00", "00:00:04:12", "00:00:09:00", "00:00:13:12", "00:00:18:00"],
  className = "",
}: TimecodeProps) {
  const minorPerMajor = 8;
  const majors = marks.length - 1;
  const ticks = majors * minorPerMajor;

  return (
    <div aria-hidden="true" className={`relative select-none ${className}`}>
      <svg className="block h-5 w-full text-ink/35" preserveAspectRatio="none" viewBox={`0 0 ${ticks} 20`}>
        <line x1="0" y1="19.5" x2={ticks} y2="19.5" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const major = i % minorPerMajor === 0;
          return (
            <line
              key={i}
              x1={i}
              x2={i}
              y1={major ? 4 : 13}
              y2={20}
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="relative mt-1.5 h-4 font-mono text-[11px] tracking-wide text-ink-3 tabular-nums">
        {marks.map((m, i) => (
          <span
            key={m}
            className="absolute top-0 -translate-x-1/2 first:translate-x-0 last:-translate-x-full max-sm:[&:nth-child(even)]:hidden"
            style={{ left: `${(i / majors) * 100}%` }}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
