/**
 * Single source of truth for site-wide facts: release, download URL, domain and links.
 * Every download button reads from `siteConfig.release.downloadUrl`.
 *
 * Shipping a new installer? Update `version`, `fileName` and `downloadUrl` here
 * (and `approxSize` if it changed), then test the link.
 */

export type ExternalLink = { label: string; href: string };

const version = "0.1.0";
const fileName = `Stitch-Setup-${version}.exe`;

export const siteConfig = {
  name: "Stitch",
  tagline: "All the creative freedom. None of the tedious work.",
  title: "Stitch — AI-Assisted Video Editing | editorstitch.com",
  description:
    "Stitch is a video editor for Windows with an AI assistant beside your timeline. Describe an edit, review the plan, and stay in control as your ideas become timeline changes.",
  url: "https://editorstitch.com",
  domain: "editorstitch.com",

  release: {
    version,
    platform: "Windows",
    fileName,
    approxSize: "69 MB",
    downloadUrl: `https://github.com/Shireenaliza/stitch-downloads/releases/latest/download/${fileName}`,
  },

  links: {
    releases: {
      label: "Releases on GitHub",
      href: "https://github.com/Shireenaliza/stitch-downloads/releases",
    },
  },

  /**
   * Social profiles shown in the footer. Intentionally empty: add an entry
   * (e.g. LinkedIn) only once the profile actually exists.
   */
  social: [] as ExternalLink[],
} as const;
