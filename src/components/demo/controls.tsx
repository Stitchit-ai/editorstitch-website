"use client";

import { useState } from "react";

/** On/off switch (`.tg`), as in the Artifact. */
export function Toggle({ on = false, label }: { on?: boolean; label: string }) {
  const [v, setV] = useState(on);
  return <button type="button" className={`tg${v ? " on" : ""}`} aria-pressed={v} aria-label={label} onClick={() => setV(!v)} />;
}

/** Compact segmented control (`.segc`): one option selected at a time. */
export function SegC({
  options,
  initial = 0,
  className = "",
  style,
  onChange,
}: {
  options: string[];
  initial?: number;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (i: number) => void;
}) {
  const [v, setV] = useState(initial);
  return (
    <span className={`segc ${className}`} style={style}>
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          className={i === v ? "on" : ""}
          aria-pressed={i === v}
          onClick={() => {
            setV(i);
            onChange?.(i);
          }}
        >
          {o}
        </button>
      ))}
    </span>
  );
}

/** Labelled slider with a live value read-out (`.sl`). */
export function Slider({ label, value, min, max, unit }: { label: string; value: number; min: number; max: number; unit: string }) {
  const [v, setV] = useState(value);
  const step = Math.abs(max - min) <= 5 ? 0.1 : 1;
  return (
    <div className="sl">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={v} aria-label={label} onChange={(e) => setV(Number(e.target.value))} />
      <output>
        {Number.isInteger(v) ? v : v.toFixed(1)}
        {unit}
      </output>
    </div>
  );
}
