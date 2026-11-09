/**
 * Pre-generates every responsive image variant the page uses, so no image depends on
 * runtime optimisation (which made the first visit show an empty frame while it encoded).
 *
 *   node scripts/optimize-images.mjs          (runs automatically before `dev` and `build`)
 *   node scripts/optimize-images.mjs --force  (regenerate everything)
 *
 * Reads the committed source PNGs listed in src/config/images.json and writes
 * public/images/generated/<name>-<width>.avif and .webp. Up-to-date files are skipped.
 * AVIF uses full-resolution chroma (4:4:4) so small coloured UI text stays crisp.
 */
import sharp from "sharp";
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "images", "generated");
const force = process.argv.includes("--force");

const manifest = JSON.parse(await readFile(path.join(ROOT, "src", "config", "images.json"), "utf8"));
const mtime = async (f) => (await stat(f).catch(() => null))?.mtimeMs ?? 0;

const encoders = {
  avif: (s) => s.avif({ quality: 72, chromaSubsampling: "4:4:4", effort: 6 }),
  webp: (s) => s.webp({ quality: 90, smartSubsample: true, effort: 6 }),
};

await mkdir(OUT, { recursive: true });
const t0 = Date.now();
let made = 0;
let skipped = 0;

const jobs = [];
for (const [name, img] of Object.entries(manifest.images)) {
  const src = path.join(ROOT, img.src);
  const srcTime = await mtime(src);
  if (!srcTime) throw new Error(`Missing source image for "${name}": ${img.src}`);
  for (const w of img.widths) {
    if (w > img.width) throw new Error(`"${name}": width ${w} exceeds source width ${img.width}`);
    for (const [fmt, encode] of Object.entries(encoders)) {
      const out = path.join(OUT, `${name}-${w}.${fmt}`);
      if (!force && (await mtime(out)) >= srcTime) {
        skipped++;
        continue;
      }
      jobs.push(
        encode(sharp(src).resize({ width: w, kernel: "lanczos3", withoutEnlargement: true }))
          .toFile(out)
          .then(() => made++),
      );
    }
  }
}
await Promise.all(jobs);
console.log(`optimize-images: ${made} generated, ${skipped} up to date (${Date.now() - t0}ms)`);
