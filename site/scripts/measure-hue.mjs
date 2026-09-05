/**
 * Does the photograph keep its COLOURS, or just its colourfulness?
 *
 *   npm run measure:hue [label] [slot,slot,...]
 *
 * Saturation alone cannot answer that. A `color` blend layer keeps the base's
 * luminance and replaces its hue and saturation with the layer's, so a
 * treatment can report 80% saturation retained while having repainted a room
 * full of skin, wood, blue chairs and sage into one green. The eye reads that
 * as a tinted photograph; the saturation number calls it healthy.
 *
 * So this measures the DISTRIBUTION of hue, over colourful pixels only
 * (HSV saturation > 0.15 - grey pixels have no meaningful hue and would
 * otherwise dominate any average):
 *
 *   spread     circular dispersion, 1 - |mean resultant vector|.
 *              0 = every pixel is the same hue, 1 = hues spread evenly.
 *              This is the number that collapses when a photo is tinted.
 *   nearGreen  share of colourful pixels within 25 degrees of green.
 *
 * Both are computed on the SOURCE file off disk and on the RENDERED region as
 * the browser composites it, so the two are directly comparable.
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.PORT ?? '4500';
const label = process.argv[2] ?? 'now';
const WANT = (process.argv[3] ?? 'give.impact,program.deen,enroll.sunday').split(',');

const SAT_FLOOR = 0.15;
const GREEN_DEG = 120;
const GREEN_TOL = 25;

/** Every page that might carry one of the slots. */
const PAGES = ['/', '/our-story', '/program', '/give', '/faqs', '/enroll', '/calendar', '/contact'];

const hueStats = (data, channels) => {
  let sx = 0, sy = 0, n = 0, near = 0;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx === 0) continue;
    const sat = (mx - mn) / mx;
    if (sat <= SAT_FLOOR) continue;

    let h;
    const d = mx - mn;
    if (d === 0) continue;
    if (mx === r) h = 60 * (((g - b) / d) % 6);
    else if (mx === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;

    const rad = (h * Math.PI) / 180;
    sx += Math.cos(rad);
    sy += Math.sin(rad);
    n++;

    let dist = Math.abs(h - GREEN_DEG);
    if (dist > 180) dist = 360 - dist;
    if (dist <= GREEN_TOL) near++;
  }
  if (!n) return { spread: 0, nearGreen: 0, colourful: 0 };
  const R = Math.hypot(sx / n, sy / n);
  return { spread: 1 - R, nearGreen: (near / n) * 100, colourful: n };
};

/* Slot -> src from the registry text. */
const srcOf = new Map();
for (const f of ['home.ts', 'calendar.ts', 'content.ts']) {
  const text = readFileSync(resolve(ROOT, 'src/data/media', f), 'utf8');
  let key = null;
  for (const line of text.split('\n')) {
    const k = /^  '([a-z0-9.]+)':/.exec(line);
    if (k) key = k[1];
    const v = /^\s+src:\s*'([^']+)'/.exec(line);
    if (v && key) srcOf.set(key, v[1]);
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
await ctx.addInitScript(() =>
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 12 })
);
const page = await ctx.newPage();

const found = new Map();

for (const path of PAGES) {
  if (found.size === WANT.length) break;
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
  for (const slot of WANT) {
    if (found.has(slot)) continue;
    const fig = await page.$(`figure.media[data-slot="${slot}"]`);
    if (!fig) continue;
    await fig.scrollIntoViewIfNeeded();
    await page
      .waitForFunction(
        (el) => {
          const m = el.querySelector('img, video');
          if (!m) return false;
          const ok = m.tagName === 'IMG' ? m.complete && m.naturalWidth > 0 : m.readyState >= 2;
          return ok && (!el.classList.contains('media--reveal') || el.classList.contains('is-revealed'));
        },
        fig,
        { timeout: 15000 }
      )
      .catch(() => {
        throw new Error(`${slot}: never finished loading - refusing to measure a blank plate`);
      });
    await page.waitForTimeout(700);
    const shot = await fig.screenshot();
    writeFileSync(`/tmp/hue-${label}-${slot}.png`, shot);
    const png = PNG.sync.read(shot);
    found.set(slot, { path, rendered: hueStats(png.data, 4) });
  }
}
await browser.close();

console.log(`\n${label}  -  hue distribution, colourful pixels only (HSV sat > ${SAT_FLOOR})\n`);
console.log('slot             near-green %          hue spread           colourful px');
console.log('                 source -> render     source -> render');

const rows = [];
for (const slot of WANT) {
  const hit = found.get(slot);
  if (!hit) {
    console.log(`${slot.padEnd(16)} NOT FOUND on any page`);
    continue;
  }
  const file = resolve(ROOT, 'src/assets/media', srcOf.get(slot) ?? '');
  if (!existsSync(file)) {
    console.log(`${slot.padEnd(16)} source file missing (${srcOf.get(slot)})`);
    continue;
  }
  const { data, info } = await sharp(file)
    .resize(500, null, { fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const src = hueStats(data, info.channels);
  const r = hit.rendered;

  const spreadKept = src.spread > 0 ? (r.spread / src.spread) * 100 : 0;
  const greenDelta = r.nearGreen - src.nearGreen;

  rows.push({ slot, src, rendered: r, spreadKept, greenDelta });
  console.log(
    `${slot.padEnd(16)} ${src.nearGreen.toFixed(0).padStart(3)}% -> ${r.nearGreen.toFixed(0).padStart(3)}%` +
      ` (${greenDelta >= 0 ? '+' : ''}${greenDelta.toFixed(0)}pt)` +
      `    ${src.spread.toFixed(2)} -> ${r.spread.toFixed(2)} (${spreadKept.toFixed(0)}% kept)` +
      `   ${r.colourful}`
  );
}

/* Acceptance: spread >= 85% of source, near-green within +/-10 points. */
const fails = rows.filter((r) => r.spreadKept < 85 || Math.abs(r.greenDelta) > 10);
console.log('');
for (const r of rows) {
  const bad = [];
  if (r.spreadKept < 85) bad.push(`hue spread only ${r.spreadKept.toFixed(0)}% of source (needs 85%)`);
  if (Math.abs(r.greenDelta) > 10)
    bad.push(`near-green moved ${r.greenDelta.toFixed(0)} points (needs within 10)`);
  if (bad.length) console.log(`  FAIL  ${r.slot}: ${bad.join('; ')}`);
}
console.log(
  fails.length
    ? `\n${fails.length} of ${rows.length} slots fail the hue-fidelity bar.\n`
    : `\nAll ${rows.length} slots keep their own colours.\n`
);
writeFileSync(`/tmp/hue-${label}.json`, JSON.stringify(rows, null, 2));
process.exitCode = fails.length ? 1 : 0;
