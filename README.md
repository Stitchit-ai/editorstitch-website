# stitch-website

Official landing page for Stitch, an AI-powered video editing application.
Production domain: https://editorstitch.com

## Tech Stack

- Next.js (App Router, fully static)
- TypeScript
- Tailwind CSS v4
- CSS-only animations (respecting `prefers-reduced-motion`)
- Lucide icons

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm start   # production build, http://localhost:3000
```

The page has three sections: Hero, Product / Features, and Thank-you / Footer.

## Updating the installer

The download URL, version, platform and external links live in one place:
`src/config/site.ts`. Every download button reads from it. For a new release, update
`version` (the file name and URL are derived from it) and `approxSize`, then test the link.

Social links go in `siteConfig.social`, and the footer renders them automatically. Leave it
empty until a profile (e.g. LinkedIn) actually exists.

## Replacing images

Production images are generated from the local design package
(`STITCH-WEBSITE-PACKAGE/`, git-ignored) by:

```bash
node scripts/prepare-assets.mjs
```

It aligns the genuine dark and light Stitch screenshots pixel for pixel (needed for the theme
switch), cuts the matching crops in both themes, copies the mascot and favicons, and renders
the dithered illustrations. To use new screenshots, replace the files in the package and
re-run the script. Outputs go to `public/images/`, `src/app/` (icons) and `src/assets/og/`.

### Responsive image variants

Every screenshot and the mascot are served as static, pre-generated AVIF/WebP files (no
on-demand image optimisation, so images appear immediately on a first visit). The widths are
listed in `src/config/images.json`; `scripts/optimize-images.mjs` writes them to
`public/images/generated/` (git-ignored). It runs automatically before `npm run dev` and
`npm run build`, skips files that are up to date, and can be run by hand with `npm run images`.

## Deployment

Hosted on Vercel. No environment variables are required.
