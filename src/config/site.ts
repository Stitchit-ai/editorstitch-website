/**
 * Single source of truth for site-wide facts: release, installer downloads, domain and links.
 * Every download button reads its options from `siteConfig.downloads`.
 *
 * Shipping a new release? Update `version` below and each installer's `url`, then test both links.
 */

export type ExternalLink = { label: string; href: string };

export type Installer = {
  /** Platform name shown in the download menu. */
  label: string;
  /** Short qualifier shown under the platform name. */
  description: string;
  version: string;
  /** Direct installer download (never the releases page). */
  url: string;
};

const version = "0.1.0";

export const siteConfig = {
  name: "Stitch",
  tagline: "All the creative freedom. None of the tedious work.",
  /** Browser-tab and share title, used for every route (set once in the root layout). */
  title: "Stitch | AI-Native Editor",
  description:
    "Stitch is a video editor for Windows with an AI assistant beside your timeline. Describe an edit, review the plan, and stay in control as your ideas become timeline changes.",
  url: "https://editorstitch.com",
  domain: "editorstitch.com",

  release: { version },

  /** Installers offered by the "Download Stitch" menu, in display order. */
  downloads: {
    windows: {
      label: "Windows",
      description: "Windows installer",
      version,
      url: `https://github.com/Shireenaliza/stitch-downloads/releases/latest/download/Stitch-Setup-${version}.exe`,
    },
    macos: {
      label: "macOS",
      description: "Apple Silicon (M1 and later)",
      version,
      url: `https://github.com/Shireenaliza/stitch-downloads/releases/latest/download/stitch_${version}_macos_arm64.dmg`,
    },
  } satisfies Record<string, Installer>,

  /**
   * Social profiles shown in the footer. Intentionally empty: add an entry
   * (e.g. LinkedIn) only once the profile actually exists.
   */
  social: [] as ExternalLink[],
} as const;
