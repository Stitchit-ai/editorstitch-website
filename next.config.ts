import type { NextConfig } from "next";

// Images are pre-generated as static AVIF/WebP by scripts/optimize-images.mjs (runs
// before dev and build), so the page never waits on on-demand image optimisation.
const nextConfig: NextConfig = {
  // The dev server only serves its client scripts and HMR socket to `localhost` by default. Opening
  // the "Network" URL (a 192.168.x.x address, e.g. from a phone or another machine) without this
  // leaves the page un-hydrated: every button is dead and the HMR client reloads the page on a loop.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
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
