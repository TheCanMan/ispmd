/**
 * Mean luminance + mean saturation of every rendered media region.
 *
 * "Brighter with better colours" is an impression until it is two numbers.
 * This screenshots each figure.media as the browser actually composites it -
 * filter, ::before tint, ::after screen and the ground behind it - and
 * reports Y average on 0-255 with mean HSV saturation beside it.
 *
 * It also reads the SOURCE file off disk and reports how much of its
 * saturation survives to the screen. That ratio is the whole question when
 * photographs are said to look monochrome: a treatment can be defended as
 * "gentle" right up until you see that it is delivering 40% of the colour
 * that was in the file.
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const PORT = process.env.PORT ?? '4500';
const PAGES = ['/', '/our-story', '/program', '/give', '/faqs', '/enroll', '/calendar'];
const label = process.argv[2] ?? 'now';

/** HSV saturation, (max-min)/max, so source and render are comparable. */
const measure = (data, channels) => {
  let y = 0, sat = 0, n = 0, blown = 0;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    y += 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    sat += mx === 0 ? 0 : (mx - mn) / mx;
    /* Brightness is a multiply, so the one thing it can cost is the top end.
       Measure that rather than trusting the filter value. */
    if (mx >= 250 / 255) blown++;
    n++;
  }
  return { y: (y / n) * 255, sat: (sat / n) * 100, blown: (blown / n) * 100 };
};

const stats = (buf) => {
  const png = PNG.sync.read(buf);
  return measure(png.data, 4);
};

/* The source file as it sits on disk, before any browser touches it. */
const sourceStats = async (src) => {
  const file = resolve(ROOT, 'src/assets/media', src);
  if (!existsSync(file)) return null;
  const { data, info } = await sharp(file)
    .resize(400, null, { fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return measure(data, info.channels);
};

/* Slot -> src, read straight out of the registry text. */
const registrySrc = new Map();
for (const f of ['home.ts', 'calendar.ts', 'content.ts']) {
  const text = readFileSync(resolve(ROOT, 'src/data/media', f), 'utf8');
  let key = null;
  for (const line of text.split('\n')) {
    const k = /^  '([a-z0-9.]+)':/.exec(line);
    if (k) key = k[1];
    const v = /^\s+src:\s*'([^']+)'/.exec(line);
    if (k === null && v && key) registrySrc.set(key, v[1]);
    else if (v && key) registrySrc.set(key, v[1]);
  }
}

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
    const srcPath = registrySrc.get(slot);
    const src = srcPath ? await sourceStats(srcPath) : null;
    rows.push({
      page: path, slot, tr, ...s,
      srcSat: src?.sat ?? null,
      srcY: src?.y ?? null,
      srcBlown: src?.blown ?? null,
      retention: src && src.sat > 0 ? (s.sat / src.sat) * 100 : null,
    });
    writeFileSync(`/tmp/lum-${label}-${slot}.png`, shot);
  }
}
await b.close();

rows.sort((a, z) => a.slot.localeCompare(z.slot));
console.log(`\n${label}: ${rows.length} media regions\n`);
console.log('slot                          treatment        Y(0-255)  sat%   srcSat%  kept');
for (const r of rows) {
  const keep = r.retention === null ? '    -' : `${r.retention.toFixed(0).padStart(4)}%`;
  const flag = r.retention !== null && r.retention < 90 ? '  <-- under 90%' : '';
  console.log(
    `${r.slot.padEnd(29)} ${r.tr.padEnd(16)} ${r.y.toFixed(1).padStart(8)} ${r.sat.toFixed(1).padStart(5)}` +
      `   ${(r.srcSat === null ? '-' : r.srcSat.toFixed(1)).padStart(6)}  ${keep}${flag}`
  );
}
const mean = (k) => {
  const v = rows.filter((r) => r[k] !== null);
  return v.reduce((a, r) => a + r[k], 0) / v.length;
};
console.log(`\nMEAN over ${rows.length} regions:  Y ${mean('y').toFixed(1)}   sat ${mean('sat').toFixed(1)}%   ` +
  `source sat ${mean('srcSat').toFixed(1)}%   RETAINED ${mean('retention').toFixed(0)}%   ` +
  `blown ${mean('blown').toFixed(2)}% (source ${mean('srcBlown').toFixed(2)}%)`);
const under = rows.filter((r) => r.retention !== null && r.retention < 90).length;
console.log(`${under} of ${rows.filter((r) => r.retention !== null).length} slots deliver under 90% of source saturation.`);
writeFileSync(`/tmp/lum-${label}.json`, JSON.stringify(rows, null, 2));
