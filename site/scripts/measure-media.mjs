/**
 * Mean luminance + mean saturation of every rendered media region.
 *
 * "Brighter with better colours" is an impression until it is two numbers.
 * This screenshots each figure.media as the browser actually composites it -
 * filter, ::before tint, ::after screen and the ground behind it - and
 * reports Y average on 0-255 with mean HSL saturation beside it.
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync } from 'node:fs';

const PORT = process.env.PORT ?? '4500';
const PAGES = ['/', '/our-story', '/program', '/give', '/faqs', '/enroll', '/calendar'];
const label = process.argv[2] ?? 'now';

const stats = (buf) => {
  const png = PNG.sync.read(buf);
  let y = 0, sat = 0, n = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i] / 255, g = png.data[i + 1] / 255, b = png.data[i + 2] / 255;
    y += 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    sat += mx === mn ? 0 : (l > 0.5 ? (mx - mn) / (2 - mx - mn) : (mx - mn) / (mx + mn));
    n++;
  }
  return { y: (y / n) * 255, sat: (sat / n) * 100 };
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() =>
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 12 })
);
const p = await ctx.newPage();
const rows = [];

for (const path of PAGES) {
  await p.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  const figures = await p.$$('figure.media');
  for (const fig of figures) {
    const slot = await fig.getAttribute('data-slot');
    const tr = await fig.evaluate((el) =>
      [...el.classList].find((c) => c.startsWith('tr-')) ?? '?'
    );
    await fig.scrollIntoViewIfNeeded();
    /*
     * Wait for actual pixels, not for a timeout. Slots are lazy-loaded, and a
     * fixed delay against a cold server measured five empty plates as
     * Y 242 at 0.3% saturation - which reads as "brilliantly bright" in a
     * table and means "the image had not decoded yet". A blank plate is the
     * one result that must never be mistaken for a good one.
     */
    await p
      .waitForFunction((el) => {
        const media = el.querySelector('img, video');
        if (!media) return false;
        const loaded = media.tagName === 'IMG'
          ? media.complete && media.naturalWidth > 0
          : media.readyState >= 2;
        /* The reveal animates the grade in; only the settled state counts. */
        return loaded && (!el.classList.contains('media--reveal') || el.classList.contains('is-revealed'));
      }, fig, { timeout: 15000 })
      .catch(() => {
        throw new Error(`${slot}: media never finished loading - refusing to measure a blank plate`);
      });
    await p.waitForTimeout(900);
    const box = await fig.boundingBox();
    if (!box || box.width < 8 || box.height < 8) continue;
    const shot = await fig.screenshot();
    const s = stats(shot);
    rows.push({ page: path, slot, tr, ...s });
    writeFileSync(`/tmp/lum-${label}-${slot}.png`, shot);
  }
}
await b.close();

rows.sort((a, z) => a.slot.localeCompare(z.slot));
console.log(`\n${label}: ${rows.length} media regions\n`);
console.log('slot                          treatment         Y(0-255)  sat%');
for (const r of rows) {
  console.log(
    `${r.slot.padEnd(29)} ${r.tr.padEnd(17)} ${r.y.toFixed(1).padStart(8)} ${r.sat.toFixed(1).padStart(5)}`
  );
}
const mean = (k) => rows.reduce((a, r) => a + r[k], 0) / rows.length;
console.log(`\nMEAN over ${rows.length} regions:  Y ${mean('y').toFixed(1)}   sat ${mean('sat').toFixed(1)}%`);
writeFileSync(`/tmp/lum-${label}.json`, JSON.stringify(rows, null, 2));
