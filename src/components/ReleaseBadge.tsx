"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * Platforms the badge cycles through. The visible copy is just "macOS"; the build itself (and the
 * download menu) remain Apple Silicon only, which the screen-reader sentence below also states.
 */
const PLATFORMS = ["Windows", "macOS"] as const;
/** How long each label stays up; the crossfade itself is CSS (.badge-slot in globals.css). */
const HOLD_MS = 2800;

/**
 * Hero badge: "Stitch v0.1.0 · now on …", alternating between the supported platforms every few seconds.
 * Both lines are stacked in one grid cell and centred, so the badge is always as wide as the longer
 * line and never resizes or nudges the headline. The server and the first client render show
 * Windows, and the timer only starts after hydration, so there is no mismatch. Screen readers get one
 * static sentence instead of the rotating text.
 */
export function ReleaseBadge({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % PLATFORMS.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, []);

  const version = siteConfig.release.version;
  return (
    <p className={className} style={style}>
      <span className="sr-only">Stitch v{version} is now available on Windows and on macOS for Apple Silicon.</span>
      <span aria-hidden="true" className="grid">
        {PLATFORMS.map((p, i) => (
          <span key={p} className="badge-slot inline-flex items-center justify-center gap-2 whitespace-nowrap" data-on={i === active}>
            <span className="h-2 w-2 shrink-0 rounded-full bg-orange" />
            Stitch v{version} · now on {p}
          </span>
        ))}
      </span>
    </p>
  );
}
