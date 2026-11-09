import { Download } from "lucide-react";
import { siteConfig } from "@/config/site";

type DownloadButtonProps = {
  variant?: "primary" | "compact";
  className?: string;
};

const { release } = siteConfig;
const accessibleName = `Download ${siteConfig.name} ${release.version} for ${release.platform} (${release.fileName}, about ${release.approxSize})`;

/**
 * The one place the installer link is rendered. Reads the URL from src/config/site.ts.
 * A plain link: the browser handles the download (GitHub serves it as an attachment).
 */
export function DownloadButton({ variant = "primary", className = "" }: DownloadButtonProps) {
  if (variant === "compact") {
    return (
      <a href={release.downloadUrl} className={`btn btn-ink ${className}`} aria-label={accessibleName}>
        <Download aria-hidden="true" size={16} strokeWidth={2.4} />
        <span>
          Download<span className="hidden sm:inline md:hidden lg:inline"> for {release.platform}</span>
        </span>
      </a>
    );
  }

  return (
    <a href={release.downloadUrl} className={`btn btn-primary ${className}`} aria-label={accessibleName}>
      <Download aria-hidden="true" size={20} strokeWidth={2.6} />
      Download for {release.platform}
    </a>
  );
}

/** Small factual line shown under primary download buttons. */
export function ReleaseMeta({ className = "" }: { className?: string }) {
  return (
    <p className={`font-display text-[13px] font-medium text-ink-3 ${className}`}>
      v{release.version} · {release.platform} installer (.exe) · ~{release.approxSize}
    </p>
  );
}
