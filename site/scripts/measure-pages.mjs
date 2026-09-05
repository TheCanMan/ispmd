/**
 * Whole-page ground balance.
 *
 *   npm run measure:pages [label]
 *
 * "The site feels gloomy" is an impression until it is a distribution. This
 * screenshots every page full-length at 1440 and reports, per page:
 *
 *   - mean luminance over the whole page, 0-255
 *   - the share of the page sitting on a DARK ground
 *   - the share sitting on a LIGHT ground
 *   - the longest unbroken run of dark, in viewport heights
 *
 * That last number is the one that matches how gloom is actually
 * experienced. A page can average a perfectly reasonable luminance and still
 * feel oppressive if the dark arrives in one continuous three-screen slab,
 * and a page with the same average broken into short bands does not. Mean
 * alone would call those two pages identical.
 *
 * Thresholds are on the site's own grounds rather than on a generic
 * mid-grey: --ink is L 0.078 and --paper is L 0.973, so anything below 0.30
 * is unambiguously one of the dark grounds and anything above 0.70 is one of
 * the paper grounds. Photographs and the shader land in between and are
 * counted as neither, which is correct - they are not grounds.
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { writeFileSync } from 'node:fs';

const PORT = process.env.PORT ?? '4500';
const WIDTH = 1440;
const VIEWPORT_H = 900;
const DARK = 0.30;
const LIGHT = 0.70;

const PAGES = [
  '/', '/our-story', '/program', '/calendar', '/enroll', '/faqs', '/give', '/contact', '/404',
];

/*
 * The 404 route has to be RESOLVED, not assumed.
 *
 * `astro preview` maps /404 to 404.html; a plain static server does not, and
 * returns its OWN error page instead - whose bare h1 and p sit outside any
 * landmark. That was reported as 4 axe violations "in our code" when the page
 * being audited was the Python http.server error document. Probe once and use
 * whichever form this server actually serves.
 */
const resolve404 = async () => {
  for (const candidate of ['/404', '/404.html']) {
    try {
      const res = await fetch(`http://localhost:${PORT}${candidate}`);
      if (res.ok) return candidate;
    } catch {}
  }
  return '/404';
};

const label = process.argv[2] ?? 'now';

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };

PAGES[PAGES.indexOf('/404')] = await resolve404();

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: VIEWPORT_H },
  deviceScaleFactor: 1,
  /* One static shader frame and settled entrances, so the measurement is of
     the page rather than of whichever animation frame we happened to catch. */
  reducedMotion: 'reduce',
});
await ctx.addInitScript(() =>
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 12 })
);
const page = await ctx.newPage();

const rows = [];

for (const path of PAGES) {
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
  /* Walk the page so lazy media loads before the full-page capture. */
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);

  const shot = await page.screenshot({ fullPage: true });
  writeFileSync(`/tmp/page-${label}-${path.replace(/\//g, '_') || '_home'}.png`, shot);
  const png = PNG.sync.read(shot);

  let sum = 0, dark = 0, light = 0, n = 0;
  /* Per-row means, so a run of dark can be found down the page. */
  const rowLum = new Float64Array(png.height);

  for (let y = 0; y < png.height; y++) {
    let rs = 0;
    for (let x = 0; x < png.width; x += 2) {
      const i = (png.width * y + x) << 2;
      const l =
        0.2126 * lin(png.data[i]) + 0.7152 * lin(png.data[i + 1]) + 0.0722 * lin(png.data[i + 2]);
      rs += l;
      sum += l;
      if (l < DARK) dark++;
      else if (l > LIGHT) light++;
      n++;
    }
    rowLum[y] = rs / Math.ceil(png.width / 2);
  }

  let run = 0, longest = 0, longestAt = 0;
  for (let y = 0; y < png.height; y++) {
    if (rowLum[y] < DARK) {
      run++;
      if (run > longest) {
        longest = run;
        longestAt = y - run + 1;
      }
    } else run = 0;
  }

  /*
   * The two views that decide whether a site "feels" gloomy are the one a
   * visitor lands on and the one they leave on. A page-long mean averages
   * those together with everything scrolled past, so a dark hero and a dark
   * footer can bracket a bright middle and the page still reports as light.
   * Measure the brackets separately.
   */
  const band = (y0, y1) => {
    let s = 0, c = 0;
    for (let y = Math.max(0, y0); y < Math.min(png.height, y1); y++) {
      s += rowLum[y];
      c++;
    }
    return c ? (s / c) * 255 : 0;
  };

  rows.push({
    path,
    height: png.height,
    mean: (sum / n) * 255,
    darkPct: (dark / n) * 100,
    lightPct: (light / n) * 100,
    firstScreen: band(0, VIEWPORT_H),
    lastScreen: band(png.height - VIEWPORT_H, png.height),
    longestDarkPx: longest,
    longestDarkAt: longestAt,
    longestDarkScreens: longest / VIEWPORT_H,
  });
  process.stdout.write(`${path} `);
}

await browser.close();

console.log(`\n\n${label}  -  ground balance at ${WIDTH}px\n`);
console.log('page          height  mean Y  1st scr  last scr  dark%  light%  longest dark run');
for (const r of rows) {
  console.log(
    `${r.path.padEnd(12)} ${String(r.height).padStart(6)}  ` +
      `${r.mean.toFixed(1).padStart(6)}  ${r.firstScreen.toFixed(1).padStart(7)}  ` +
      `${r.lastScreen.toFixed(1).padStart(8)}  ${r.darkPct.toFixed(1).padStart(5)}  ` +
      `${r.lightPct.toFixed(1).padStart(6)}  ` +
      `${String(r.longestDarkPx).padStart(5)}px at y=${String(r.longestDarkAt).padStart(5)}`
  );
}

const w = (k) => rows.reduce((a, r) => a + r[k] * r.height, 0) / rows.reduce((a, r) => a + r.height, 0);
console.log(
  `\nSITE (height-weighted):  mean Y ${w('mean').toFixed(1)}   ` +
    `dark ${w('darkPct').toFixed(1)}%   light ${w('lightPct').toFixed(1)}%`
);
const avg = (k) => rows.reduce((a, r) => a + r[k], 0) / rows.length;
console.log(
  `ENTRY/EXIT across ${rows.length} pages:  first screen ${avg('firstScreen').toFixed(1)}   ` +
    `last screen ${avg('lastScreen').toFixed(1)}`
);
writeFileSync(`/tmp/pages-${label}.json`, JSON.stringify(rows, null, 2));
