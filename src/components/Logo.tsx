import { Picture } from "./Picture";

type MascotProps = { className?: string; style?: React.CSSProperties; priority?: boolean };

/** Mascot artwork (trimmed, 256×201). Shown small only: the source is low resolution. */
export function Mascot({ className = "", style, priority = false }: MascotProps) {
  return (
    <Picture
      name="stitch-mascot"
      alt=""
      aria-hidden
      sizes="96px"
      priority={priority}
      className={`block h-auto ${className}`}
      style={style}
    />
  );
}

type LogoProps = {
  /** Mascot width in px; the wordmark scales with it. */
  size?: number;
  className?: string;
};

/** Stitch wordmark: the supplied mascot next to "Stitch" set in Poppins. */
export function Logo({ size = 34, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mascot priority style={{ width: size }} />
      <span
        className="font-display font-bold tracking-[-0.03em] text-ink"
        style={{ fontSize: Math.round(size * 0.68) }}
      >
        Stitch
      </span>
    </span>
  );
}
