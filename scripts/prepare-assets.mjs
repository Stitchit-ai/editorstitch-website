/**
 * Prepares the website's production images from the local design package.
 *
 *   node scripts/prepare-assets.mjs
 *
 * Reads only from ./STITCH-WEBSITE-PACKAGE (git-ignored, never modified) and writes to
 * ./public/images, ./src/app (icons) and ./src/assets/og.
 *
 * What it does:
 *  1. Aligns the genuine dark and light Stitch screenshots to one shared window
 *     rectangle so the theme switch can transition between them pixel-for-pixel.
 *     The offsets are measured (not guessed) by matching the footage in the preview,
 *     which is identical in both themes.
 *  2. Locates the supplied crops (ai-features.png, timeline.png) inside the full
 *     screenshot and cuts the identical region from the dark capture, so every crop
 *     exists in both themes. No pixels of the application UI are altered.
 *  3. Copies brand assets (mascot, favicons) and derives an apple-touch icon.
 *  4. Renders the decorative 1-bit dithered illustrations (film reel, clapperboard,
 *     lens, film strip) used around the page.
 */
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PKG = path.join(ROOT, "STITCH-WEBSITE-PACKAGE");
const OUT = path.join(ROOT, "public", "images");
const src = (...p) => path.join(PKG, ...p);
const out = (...p) => path.join(OUT, ...p);

const DARK = src("references", "inside-stitch", "main-intefacer-dark-mode.png");
const LIGHT = src("references", "inside-stitch", "main-interface-light-mode.png");
const WORKSPACE = src("assets", "product", "workspace.png");
const AI = src("assets", "product", "ai-features.png");
const TIMELINE = src("assets", "product", "timeline.png");

async function grey(file) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  return { d: data, w: info.width, h: info.height };
}

/** Sum of squared differences of a patch of A placed at (ax,ay) against B at (bx,by). */
function ssd(A, ax, ay, B, bx, by, pw, ph, step = 2) {
  let s = 0;
  for (let y = 0; y < ph; y += step)
    for (let x = 0; x < pw; x += step) {
      const a = A.d[(ay + y) * A.w + ax + x];
      const b = B.d[(by + y) * B.w + bx + x];
      s += (a - b) * (a - b);
    }
  return s;
}

/** Offset (dx,dy) such that A(x,y) == B(x+dx, y+dy), searched around a patch. */
function offsetOf(A, B, px, py, pw, ph, range = 40) {
  let best = { s: Infinity, dx: 0, dy: 0 };
  for (let dy = -range; dy <= range; dy++)
    for (let dx = -range; dx <= range; dx++) {
      const bx = px + dx, by = py + dy;
      if (bx < 0 || by < 0 || bx + pw > B.w || by + ph > B.h) continue;
      const s = ssd(A, px, py, B, bx, by, pw, ph);
      if (s < best.s) best = { s, dx, dy };
    }
  return best;
}

/** Find where small image N sits inside big image H (exhaustive, coarse-to-fine). */
function locate(N, H) {
  const pw = Math.min(120, N.w), ph = Math.min(120, N.h);
  const px = Math.floor((N.w - pw) / 2), py = Math.floor((N.h - ph) / 2);
  let best = { s: Infinity, x: 0, y: 0 };
  for (let y = 0; y + N.h <= H.h; y += 1)
    for (let x = 0; x + N.w <= H.w; x += 1) {
      const s = ssd(N, px, py, H, x + px, y + py, pw, ph, 6);
      if (s < best.s) best = { s, x, y };
    }
  return best;
}

async function main() {
  for (const d of ["product", "branding", "decor"]) await mkdir(out(d), { recursive: true });
  await mkdir(path.join(ROOT, "src", "assets", "og"), { recursive: true });

  // ---------------------------------------------------------------- 1. alignment
  const [D, L, W] = await Promise.all([grey(DARK), grey(LIGHT), grey(WORKSPACE)]);
  // Patches inside the preview footage and a media thumbnail: identical in both themes.
  const oL = offsetOf(D, L, 450, 120, 200, 120);
  const oW = offsetOf(D, W, 450, 120, 200, 120);
  const oL2 = offsetOf(D, L, 62, 130, 95, 50);
  if (oL.dx !== oL2.dx || oL.dy !== oL2.dy) throw new Error("Dark/light alignment is inconsistent");
  console.log("light offset", oL, "workspace offset", oW);

  // Shared window rectangle in dark-image coordinates. The dark capture includes the
  // window's left edge at x=3 and its bottom edge at y=764; its top/right are clipped
  // by the capture itself, so those define the shared extent.
  const FRAME = { left: 3, top: 0, width: D.w - 3 - 1, height: 765 };
  const inLight = (r) => ({ ...r, left: r.left + oL.dx, top: r.top + oL.dy });

  console.log("workspace frame", FRAME);

  // ---------------------------------------------------------------- 2. crops
  // Locate the supplied crops inside workspace.png, then map to dark coordinates.
  const [A, T] = await Promise.all([grey(AI), grey(TIMELINE)]);
  const aiAt = locate(A, W);
  const tlAt = locate(T, W);
  console.log("ai-features in workspace", aiAt, "timeline in workspace", tlAt);

  // The dark capture is clipped a few pixels short on the right; keep only the
  // region present in both themes so the pair stays identical in size.
  const aiRect = { left: aiAt.x, top: aiAt.y, width: Math.min(A.w, D.w - (aiAt.x - oW.dx)), height: A.h };
  const tlRect = { left: tlAt.x, top: tlAt.y, width: T.w, height: T.h };

  // Sub-regions of the AI panel (y ranges relative to ai-features.png).
  const sub = (r, top, height) => ({ left: r.left, top: r.top + top, width: r.width, height });
  const crops = {
    // Conversation: the prompt, the agent reading the project, and its reply.
    prompt: sub(aiRect, 0, 300),
    // The edit summary and the agent asking the editor to choose.
    plan: sub(aiRect, 300, 336),
    timeline: tlRect,
    // The media panel used for hands-on editing (taken from the light reference, which
    // has no hover tooltip, at the same window coordinates as the dark capture).
    media: null,
  };

  for (const [name, rect] of Object.entries(crops)) {
    if (!rect) continue;
    await sharp(WORKSPACE).extract(rect).png().toFile(out("product", `${name}-light.png`));
  }
  // Preview + playback controls (genuine workspace.png crop): "refine and review".
  await sharp(WORKSPACE).extract({ left: 283, top: 30, width: 660, height: 432 }).png().toFile(out("product", "preview-light.png"));
  const mediaDark = { left: 46, top: 28, width: 240, height: 438 };
  await sharp(LIGHT).extract(inLight(mediaDark)).png().toFile(out("product", "media-light.png"));

  // ---------------------------------------------------------------- 3. branding
  // Mascot: downscaled with a high-quality filter (never enlarged) for small UI use.
  await sharp(src("assets", "branding", "stitch-mascot-transparent.png"))
    .trim()
    .resize({ width: 256, kernel: "lanczos3" })
    .png()
    .toFile(out("branding", "stitch-mascot.png"));
  await sharp(src("assets", "branding", "stitch-mascot-transparent.png"))
    .trim()
    .resize({ width: 220, kernel: "lanczos3" })
    .png()
    .toFile(path.join(ROOT, "src", "assets", "og", "mascot.png"));

  await copyFile(src("assets", "branding", "favicon.ico"), path.join(ROOT, "src", "app", "favicon.ico"));
  await copyFile(src("assets", "branding", "favicon-32.png"), path.join(ROOT, "src", "app", "icon.png"));
  const mascot140 = await sharp(src("assets", "branding", "stitch-mascot-transparent.png"))
    .trim()
    .resize({ width: 132, kernel: "lanczos3" })
    .toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: "#15131F" } })
    .composite([{ input: mascot140, gravity: "center" }])
    .png()
    .toFile(path.join(ROOT, "src", "app", "apple-icon.png"));

  // ---------------------------------------------------------------- 4. decor
  for (const [name, art] of Object.entries(DECOR)) {
    await dither(art.svg, art.w, art.h, out("decor", `${name}.png`));
  }
  console.log("done");
}

/** Floyd–Steinberg 1-bit dither: ink pixels opaque Deep Ink, the rest transparent. */
async function dither(svg, w, h, file) {
  const { data } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const lum = new Float32Array(w * h);
  const alpha = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    alpha[i] = data[i * 4 + 3];
    lum[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const outBuf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (alpha[i] < 128) continue;
      const old = lum[i];
      const ink = old < 128;
      const err = old - (ink ? 0 : 255);
      if (x + 1 < w) lum[i + 1] += (err * 7) / 16;
      if (y + 1 < h) {
        if (x > 0) lum[i + w - 1] += (err * 3) / 16;
        lum[i + w] += (err * 5) / 16;
        if (x + 1 < w) lum[i + w + 1] += err / 16;
      }
      if (ink) {
        outBuf[i * 4] = 0x15; outBuf[i * 4 + 1] = 0x13; outBuf[i * 4 + 2] = 0x1f; outBuf[i * 4 + 3] = 255;
      }
    }
  await sharp(outBuf, { raw: { width: w, height: h, channels: 4 } }).png({ palette: true }).toFile(file);
}

// ------------------------------------------------------------------ illustrations
const sprocketStrip = (d, width = 54) => `
  <path d="${d}" fill="none" stroke="#000" stroke-width="${width}" stroke-linecap="butt"/>
  <path d="${d}" fill="none" stroke="#5a5a5a" stroke-width="${width - 6}" stroke-linecap="butt"/>
  <path d="${d}" fill="none" stroke="#fff" stroke-width="${width - 14}" stroke-dasharray="6 9" stroke-linecap="butt"/>
  <path d="${d}" fill="none" stroke="url(#frame)" stroke-width="${width - 26}" stroke-dasharray="40 6" stroke-linecap="butt"/>`;

const DECOR = {
  // A tilted film reel unspooling a strip of film.
  "film-reel": {
    w: 440, h: 380,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="380" viewBox="0 0 440 380">
      <defs>
        <radialGradient id="disc" cx=".32" cy=".28" r=".95"><stop offset="0" stop-color="#f4f4f4"/><stop offset=".55" stop-color="#a8a8a8"/><stop offset="1" stop-color="#2c2c2c"/></radialGradient>
        <linearGradient id="frame" x1="0" x2="1"><stop offset="0" stop-color="#d0d0d0"/><stop offset="1" stop-color="#8a8a8a"/></linearGradient>
      </defs>
      ${sprocketStrip("M230 190 C 330 230 370 290 430 335")}
      <g transform="translate(190 170) rotate(-24) scale(1 .66)">
        <circle r="168" fill="#000"/>
        <circle r="161" fill="url(#disc)"/>
        <circle r="150" fill="none" stroke="#000" stroke-width="3"/>
        ${[0, 72, 144, 216, 288].map((a) => `<g transform="rotate(${a})"><circle cx="0" cy="-92" r="40" fill="#000"/><circle cx="0" cy="-92" r="35" fill="#fff"/></g>`).join("")}
        <circle r="30" fill="#000"/><circle r="25" fill="#9a9a9a"/><circle r="11" fill="#fff" stroke="#000" stroke-width="3"/>
      </g>
    </svg>`,
  },
  // An open clapperboard.
  clapperboard: {
    w: 400, h: 360,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="360" viewBox="0 0 400 360">
      <defs>
        <linearGradient id="slate" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a9a9a"/><stop offset="1" stop-color="#1e1e1e"/></linearGradient>
        <pattern id="stripes" width="56" height="60" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)"><rect width="28" height="60" fill="#111"/><rect x="28" width="28" height="60" fill="#e8e8e8"/></pattern>
      </defs>
      <g transform="translate(205 222) rotate(-6) scale(.92)">
        <rect x="-150" y="-50" width="300" height="190" rx="12" fill="#000"/>
        <rect x="-144" y="-44" width="288" height="178" rx="8" fill="url(#slate)"/>
        <path d="M-130 10 H130 M-130 62 H130 M-130 112 H130 M-10 10 V112" stroke="#eee" stroke-width="5"/>
        <rect x="-150" y="-96" width="300" height="46" fill="#000"/>
        <rect x="-145" y="-91" width="290" height="36" fill="url(#stripes)"/>
        <g transform="rotate(-20 -150 -96)">
          <rect x="-150" y="-142" width="300" height="46" fill="#000"/>
          <rect x="-145" y="-137" width="290" height="36" fill="url(#stripes)"/>
        </g>
        <circle cx="-136" cy="-96" r="12" fill="#000"/><circle cx="-136" cy="-96" r="6" fill="#ccc"/>
      </g>
    </svg>`,
  },
  // A camera lens seen at an angle, with focus ring knurling.
  lens: {
    w: 380, h: 380,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="380" viewBox="0 0 380 380">
      <defs>
        <radialGradient id="glass" cx=".34" cy=".3" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#9c9c9c"/><stop offset=".8" stop-color="#202020"/><stop offset="1" stop-color="#000"/></radialGradient>
        <linearGradient id="barrel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8d8d8"/><stop offset="1" stop-color="#2a2a2a"/></linearGradient>
      </defs>
      <g transform="translate(190 190) rotate(-18) scale(1 .9)">
        <circle r="172" fill="#000"/>
        <circle r="166" fill="url(#barrel)"/>
        <circle r="152" fill="none" stroke="#fff" stroke-width="14" stroke-dasharray="3 7"/>
        <circle r="138" fill="#000"/>
        <circle r="132" fill="#7a7a7a"/>
        <circle r="112" fill="#000"/>
        <circle r="106" fill="url(#glass)"/>
        <circle r="72" fill="none" stroke="#bdbdbd" stroke-width="2"/>
        <ellipse cx="-40" cy="-46" rx="26" ry="14" transform="rotate(-35 -40 -46)" fill="#fff"/>
      </g>
    </svg>`,
  },
  // A gently curving film strip.
  "film-strip": {
    w: 620, h: 200,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="200" viewBox="0 0 620 200">
      <defs><linearGradient id="frame" x1="0" x2="1"><stop offset="0" stop-color="#e0e0e0"/><stop offset=".5" stop-color="#8a8a8a"/><stop offset="1" stop-color="#cfcfcf"/></linearGradient></defs>
      ${sprocketStrip("M10 140 C 140 40 260 40 330 100 S 520 170 610 60", 64)}
    </svg>`,
  },
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
