import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const PORT = process.env.PORT ?? '4500';
const label = process.argv[2] ?? 'now';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() =>
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 12 })
);
const p = await ctx.newPage();
await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
await p.waitForTimeout(3800);

const shot = await p.screenshot({ path: `/tmp/hero-${label}.png` });
const png = PNG.sync.read(shot);

/* Whole hero, plus the aperture region alone: the aperture is where "morning
   light" either happens or does not, and averaging it with the dark type side
   hides the change we are making. */
const regions = {
  'hero (full 1440x900)': [0, 0, 1440, 900],
  'aperture (right half)': [740, 300, 700, 460],
  'type side (left)': [40, 200, 700, 560],
};

console.log(`\n${label}`);
for (const [name, [x0, y0, w, h]] of Object.entries(regions)) {
  let y = 0, sat = 0, n = 0, maxY = 0;
  for (let yy = y0; yy < Math.min(y0 + h, png.height); yy++) {
    for (let xx = x0; xx < Math.min(x0 + w, png.width); xx++) {
      const i = (png.width * yy + xx) << 2;
      const r = png.data[i] / 255, g = png.data[i + 1] / 255, bl = png.data[i + 2] / 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * bl;
      y += lum; maxY = Math.max(maxY, lum);
      const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl), l = (mx + mn) / 2;
      sat += mx === mn ? 0 : l > 0.5 ? (mx - mn) / (2 - mx - mn) : (mx - mn) / (mx + mn);
      n++;
    }
  }
  console.log(
    `  ${name.padEnd(24)} Y ${((y / n) * 255).toFixed(1).padStart(6)}   peak ${(maxY * 255).toFixed(1).padStart(6)}   sat ${((sat / n) * 100).toFixed(1)}%`
  );
}
await b.close();
