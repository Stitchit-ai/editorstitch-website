import manifest from "@/config/images.json";

export type ImageName = keyof typeof manifest.images;

const DIR = "/images/generated";

export function imageInfo(name: ImageName) {
  return manifest.images[name];
}

/** AVIF srcset for a manifest image (used for preloading). */
export function avifSrcSet(name: ImageName) {
  return manifest.images[name].widths.map((w) => `${DIR}/${name}-${w}.avif ${w}w`).join(", ");
}

type PictureProps = {
  name: ImageName;
  alt: string;
  sizes: string;
  /** Above-the-fold images: load eagerly with high priority. */
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean;
};

/**
 * Serves pre-generated static AVIF/WebP variants (scripts/optimize-images.mjs).
 * Nothing is encoded on request, so images appear immediately on a first visit.
 */
export function Picture({ name, alt, sizes, priority = false, className, style, ...rest }: PictureProps) {
  const img = manifest.images[name];
  const set = (fmt: string) => img.widths.map((w) => `${DIR}/${name}-${w}.${fmt} ${w}w`).join(", ");
  const largest = img.widths[img.widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      {/* Plain <img>: the variants are static, pre-optimised files (no runtime encoding). */}
      <img
        src={`${DIR}/${name}-${largest}.webp`}
        width={img.width}
        height={img.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={className}
        style={style}
        {...rest}
      />
    </picture>
  );
}
