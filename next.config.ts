import type { NextConfig } from "next";

// Images are pre-generated as static AVIF/WebP by scripts/optimize-images.mjs (runs
// before dev and build), so the page never waits on on-demand image optimisation.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
