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
 *     film strip) and the hero's halftone camera used around the page.
 *
 *   node scripts/prepare-assets.mjs --decor-only   re-renders just the illustrations.
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

async function renderDecor() {
  await mkdir(out("decor"), { recursive: true });
  for (const [name, art] of Object.entries(DECOR)) {
    const file = out("decor", `${name}.png`);
    await (art.halftone ? halftone(art, file) : dither(art, file));
  }
}

async function main() {
  if (process.argv.includes("--decor-only")) {
    await renderDecor();
    console.log("done (decor only)");
    return;
  }
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
  await renderDecor();
  console.log("done");
}

/**
 * Floyd–Steinberg 1-bit dither of a greyscale render: 1 = ink, 2 = covered but light, 0 = empty.
 * `grain` > 1 dithers the mid-tones on a coarser grid (pure blacks and whites stay pixel-exact),
 * so the shading stays clean, without moiré, when the image is shown at around half size.
 */
async function ditherMask(svg, w, h, grain = 1) {
  const { data } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const lum = new Float32Array(w * h);
  const alpha = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    alpha[i] = data[i * 4 + 3];
    lum[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const on = new Uint8Array(w * h);
  // Error diffusion over a grid of (gw × gh) cells with the given starting luminance.
  const diffuse = (L, gw, gh, has, setCell) => {
    for (let y = 0; y < gh; y++)
      for (let x = 0; x < gw; x++) {
        const k = y * gw + x;
        if (!has(k)) continue;
        const old = L[k];
        const ink = old < 128;
        const err = old - (ink ? 0 : 255);
        if (x + 1 < gw) L[k + 1] += (err * 7) / 16;
        if (y + 1 < gh) {
          if (x > 0) L[k + gw - 1] += (err * 3) / 16;
          L[k + gw] += (err * 5) / 16;
          if (x + 1 < gw) L[k + gw + 1] += err / 16;
        }
        setCell(k, ink ? 1 : 2);
      }
  };
  if (grain <= 1) {
    diffuse(lum, w, h, (k) => alpha[k] >= 128, (k, v) => (on[k] = v));
    return on;
  }
  // Solid tones stay pixel-exact (outlines, text); mid-tones are dithered block by block.
  const bw = Math.ceil(w / grain), bh = Math.ceil(h / grain);
  const cell = (x, y) => ((y / grain) | 0) * bw + ((x / grain) | 0);
  const bl = new Float32Array(bw * bh), bn = new Uint16Array(bw * bh), res = new Uint8Array(bw * bh);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (alpha[i] < 128) continue;
      if (lum[i] < 48) on[i] = 1;
      else if (lum[i] > 232) on[i] = 2;
      else { const k = cell(x, y); bl[k] += lum[i]; bn[k]++; }
    }
  for (let k = 0; k < bw * bh; k++) if (bn[k]) bl[k] /= bn[k];
  diffuse(bl, bw, bh, (k) => bn[k] > 0, (k, v) => (res[k] = v));
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (alpha[i] >= 128 && !on[i]) on[i] = res[cell(x, y)];
    }
  return on;
}

/**
 * 1-bit illustration: ink pixels opaque Deep Ink, the rest transparent.
 * An optional `accent` layer (same canvas) is dithered on top in Stitch Orange, and `paper`
 * fills the light areas inside shapes with white so overlapping cards read as paper cut-outs.
 */
async function dither({ svg, w, h, accent, paper = false, grain = 1 }, file) {
  const ink = await ditherMask(svg, w, h, grain);
  const acc = accent ? await ditherMask(accent, w, h, grain) : null;
  const outBuf = Buffer.alloc(w * h * 4);
  const put = (i, r, g, b) => {
    outBuf[i * 4] = r; outBuf[i * 4 + 1] = g; outBuf[i * 4 + 2] = b; outBuf[i * 4 + 3] = 255;
  };
  for (let i = 0; i < w * h; i++) {
    if (acc && acc[i] === 1) put(i, 0xf4, 0x5f, 0x3f);
    else if (ink[i] === 1) put(i, 0x15, 0x13, 0x1f);
    else if (paper && (ink[i] === 2 || (acc && acc[i] === 2))) put(i, 0xff, 0xff, 0xff);
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
  // A gently curving film strip.
  "film-strip": {
    w: 620, h: 200,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="200" viewBox="0 0 620 200">
      <defs><linearGradient id="frame" x1="0" x2="1"><stop offset="0" stop-color="#e0e0e0"/><stop offset=".5" stop-color="#8a8a8a"/><stop offset="1" stop-color="#cfcfcf"/></linearGradient></defs>
      ${sprocketStrip("M10 140 C 140 40 260 40 330 100 S 520 170 610 60", 64)}
    </svg>`,
  },
};

/**
 * Halftone print: the greyscale render is sampled on a square grid and each cell becomes one Deep
 * Ink dot whose area follows the tone, like a newspaper photo. `accent` is an SVG drawn on top
 * as-is (flat Stitch Orange marks). Everything outside the art stays transparent.
 */
async function halftone({ svg, w, h, cell = 8, accent = "" }, file) {
  const { data } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const dots = [];
  for (let cy = 0; cy < h; cy += cell)
    for (let cx = 0; cx < w; cx += cell) {
      let lum = 0, cover = 0, n = 0;
      for (let y = cy; y < Math.min(cy + cell, h); y++)
        for (let x = cx; x < Math.min(cx + cell, w); x++) {
          const i = (y * w + x) * 4, a = data[i + 3] / 255;
          lum += a * (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
          cover += a;
          n++;
        }
      if (cover / n < 0.35) continue;
      const dark = Math.min(1, Math.max(0.05, 1 - lum / cover / 255)) * Math.min(1, cover / n / 0.8);
      const r = (cell / 2) * 1.32 * Math.sqrt(dark);
      if (r >= 0.55) dots.push(`<circle cx="${cx + cell / 2}" cy="${cy + cell / 2}" r="${r.toFixed(2)}"/>`);
    }
  const page = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <g fill="#15131f">${dots.join("")}</g>${accent}</svg>`;
  await sharp(Buffer.from(page)).png({ palette: true }).toFile(file);
}

const svgOpen = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;

DECOR.camera = (() => {
  // Hero, beside the headline: a tilted rangefinder camera printed in halftone, with two little
  // orange "pop" bursts by the lens (after the supplied reference, recoloured to the palette).
  const w = 460, h = 380;
  const cx = 230, cy = 196, tilt = -14;
  const rad = (d) => (d * Math.PI) / 180;
  // Lens centre in canvas space (it sits at (12, 34) inside the rotated body).
  const lx = cx + 12 * Math.cos(rad(tilt)) - 34 * Math.sin(rad(tilt));
  const ly = cy + 12 * Math.sin(rad(tilt)) + 34 * Math.cos(rad(tilt));
  const burst = (angles, r1, r2) =>
    angles
      .map((a) => {
        const c = Math.cos(rad(a)), sn = Math.sin(rad(a));
        return `<path d="M${(lx + c * r1).toFixed(1)} ${(ly + sn * r1).toFixed(1)} L${(lx + c * r2).toFixed(1)} ${(ly + sn * r2).toFixed(1)}"/>`;
      })
      .join("");
  return {
    w, h, halftone: true, cell: 7,
    svg: `${svgOpen(w, h)}<defs>
        <linearGradient id="hide" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a9a9a"/><stop offset=".55" stop-color="#b8b8b8"/><stop offset="1" stop-color="#7a7a7a"/></linearGradient>
        <linearGradient id="plate" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bdbdbd"/><stop offset=".5" stop-color="#ececec"/><stop offset="1" stop-color="#c4c4c4"/></linearGradient>
        <radialGradient id="glass" cx=".38" cy=".34" r=".8"><stop offset="0" stop-color="#9a9a9a"/><stop offset=".45" stop-color="#2a2a2a"/><stop offset="1" stop-color="#050505"/></radialGradient>
        <radialGradient id="barrel" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#e2e2e2"/><stop offset="1" stop-color="#8a8a8a"/></radialGradient>
      </defs>
      <g transform="translate(${cx} ${cy}) rotate(${tilt})">
        <rect x="-184" y="-46" width="16" height="34" rx="5" fill="#8a8a8a"/>
        <rect x="168" y="-46" width="16" height="34" rx="5" fill="#8a8a8a"/>
        <rect x="-36" y="-124" width="118" height="62" rx="12" fill="url(#plate)"/>
        <rect x="-4" y="-112" width="50" height="32" rx="4" fill="#0e0e0e"/>
        <rect x="4" y="-106" width="16" height="10" rx="2" fill="#5a5a5a"/>
        <rect x="-138" y="-98" width="46" height="26" rx="5" fill="#8c8c8c"/>
        <rect x="104" y="-92" width="34" height="20" rx="5" fill="#a8a8a8"/>
        <rect x="-172" y="-74" width="344" height="190" rx="18" fill="url(#hide)"/>
        <rect x="-172" y="-74" width="344" height="46" rx="18" fill="url(#plate)"/>
        <rect x="-172" y="-40" width="344" height="12" fill="url(#plate)"/>
        <rect x="-152" y="-64" width="40" height="28" rx="4" fill="#f4f4f4"/>
        <rect x="-148" y="-60" width="32" height="20" rx="3" fill="#cfcfcf"/>
        <rect x="132" y="-16" width="30" height="104" rx="12" fill="#5e5e5e"/>
        <path d="M-172 70 H172 V98 a18 18 0 0 1 -18 18 H-154 a18 18 0 0 1 -18 -18 Z" fill="#666666"/>
        <circle cx="12" cy="34" r="84" fill="#1c1c1c"/>
        <circle cx="12" cy="34" r="76" fill="url(#barrel)"/>
        <circle cx="12" cy="34" r="58" fill="#161616"/>
        <circle cx="12" cy="34" r="50" fill="url(#glass)"/>
        <circle cx="12" cy="34" r="22" fill="#0a0a0a"/>
        <circle cx="-6" cy="16" r="9" fill="#f2f2f2"/>
        <rect x="110" y="20" width="22" height="36" rx="6" fill="#d6d6d6"/>
        <rect x="116" y="28" width="10" height="20" rx="3" fill="#6a6a6a"/>
      </g></svg>`,
    accent: `<g fill="none" stroke="#f45f3f" stroke-width="10" stroke-linecap="round">
        ${burst([168, 200, 232], 104, 128)}${burst([-74, -42, -10], 104, 128)}</g>`,
  };
})();

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
