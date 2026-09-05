/**
 * Glyph-level contrast, measured from the rendered page.
 *
 * This exists because DECLARED contrast is not shipped contrast. Reading the
 * token off the stylesheet and comparing it to the ground the annotation
 * claims will certify text that paints at 1.65:1 - the epigraph did exactly
 * that at a declared 14.3:1, because a scrim was sitting on top of it. Only
 * the composited pixels tell the truth.
 *
 * Method. Two renders per page: one normal, one with every text colour and
 * text-decoration colour forced transparent. Pixels that differ between them
 * are glyph pixels, by construction; the same coordinates in the transparent
 * render are that glyph's true background, whatever painted it. No assumption
 * is made about what is behind the text, so it works over a shader, over a
 * photograph and under a blurred scrim identically.
 *
 * Four traps this has fallen into before, all now handled:
 *
 *   - `visibility: hidden` also hides ::before, so the scrim under the text
 *     disappeared exactly when measured and before/after came out identical.
 *     Only `color` is touched here, never visibility or opacity.
 *   - `text-decoration-color` survives `color: transparent`. A descender
 *     crossing its own underline reported the underline as "background" and
 *     failed every linked phone number. Decoration is transparentised too.
 *   - Element bounding boxes include children, so a parent got blamed for a
 *     child's glyphs. Rects come from Range.getClientRects() per TEXT NODE.
 *   - Text painted over by an opaque layer produces two IDENTICAL renders,
 *     the diff finds nothing, and the element used to be SKIPPED - reporting
 *     "no failures" while the text was invisible. That is now a failure.
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const PORT = process.env.PORT ?? '4500';
const WIDTHS = [390, 1440];
const PAGES = process.env.PAGES?.split(',') ?? [
  '/', '/our-story', '/program', '/calendar', '/enroll', '/faqs', '/give', '/contact', '/404',
];

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const x = L(a), y = L(b);
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
};

/** WCAG 1.4.3: 3.0 for >=24px, or >=18.66px bold. 4.5 otherwise. */
const required = (px, weight) => (px >= 24 || (px >= 18.66 && weight >= 700) ? 3.0 : 4.5);

const collect = () =>
  [...document.querySelectorAll('body *')].flatMap((el) => {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return [];
    if (el.closest('[aria-hidden="true"]')) return [];
    /* Astro's dev toolbar and our own <canvas> carry no readable text. */
    if (el.closest('astro-dev-toolbar, canvas, svg, script, style, noscript')) return [];
    /*
     * The skip link is parked off-screen until it takes focus, so unfocused
     * it is correctly "not painted". It is not exempt, though - it is a real
     * control that a keyboard user sees - so it is measured separately below
     * in the state it is actually used in.
     */
    if (el.closest('.skip-link') && document.activeElement !== el.closest('.skip-link')) return [];

    const rects = [];
    for (const node of el.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        /* PAGE coordinates, not viewport: the screenshot is full-page, and
           measuring only what happens to be above the fold checked a fifth
           of the site's text and called it the site. */
        if (r.width > 1 && r.height > 1) {
          rects.push({ x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height });
        }
      }
    }
    if (!rects.length) return [];

    /* The homepage calendar strip carries a mask that legitimately fades its
       outermost cells. Text inside the ramp is not a contrast defect. */
    const scroller = el.closest('[data-calendar-scroller]');
    let masked = false;
    if (scroller) {
      const s = scroller.getBoundingClientRect();
      masked = rects.some((r) => r.x < s.x + 56 || r.x + r.w > s.x + s.width - 72);
    }

    return [{
      sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
      text: el.textContent.trim().slice(0, 40),
      px: parseFloat(cs.fontSize),
      weight: parseInt(cs.fontWeight, 10) || 400,
      rects,
      masked,
    }];
  });

const KILL_TEXT_COLOUR = `*, *::before, *::after {
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  text-decoration-color: transparent !important;
  text-emphasis-color: transparent !important;
  caret-color: transparent !important;
}`;

const px = (png, x, y) => {
  const i = (png.width * y + x) << 2;
  return [png.data[i], png.data[i + 1], png.data[i + 2]];
};

const browser = await chromium.launch();
let measured = 0;
const failures = [];

for (const width of WIDTHS) {
  /*
   * reducedMotion is not a convenience here, it is what makes the diff valid.
   * The field shader animates, so between the two screenshots the background
   * moves and thousands of non-glyph pixels differ. Under reduced motion the
   * shader renders exactly one frame and every entrance sits at its end
   * state - which is also the state whose contrast actually matters.
   */
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  /* Headless Chromium reports <=4 cores, which sends the hero down to its
     flat tier - so the field under the headline would not be the one a
     desktop visitor sees, and its contrast would not be theirs either. */
  await ctx.addInitScript(() =>
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 12 })
  );
  const page = await ctx.newPage();

  for (const path of PAGES) {
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
    /* Entrances must be settled: a line still rising through its own mask is
       legitimately clipped, and measuring mid-scrub reports a defect that
       does not exist at rest. */
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1600);

    const items = await page.evaluate(collect);
    const before = PNG.sync.read(await page.screenshot({ fullPage: true }));

    const handle = await page.addStyleTag({ content: KILL_TEXT_COLOUR });
    await page.waitForTimeout(120);
    const after = PNG.sync.read(await page.screenshot({ fullPage: true }));
    await handle.evaluate((el) => el.remove());

    for (const item of items) {
      let worst = null;
      let glyphPixels = 0;

      /*
       * Per rect, the glyph colour is taken from the pixel with the LARGEST
       * difference between the two renders - the most fully covered pixel,
       * i.e. the inside of a stroke.
       *
       * Taking the minimum contrast across every qualifying pixel instead
       * finds the most washed-out antialiased edge pixel on the site every
       * single time, which is why an earlier version of this file reported
       * 221 failures out of 221 elements. A glyph edge is a blend of ink and
       * ground by definition; it is not a contrast defect.
       */
      for (const r of item.rects) {
        const x0 = Math.max(0, Math.floor(r.x)), x1 = Math.min(before.width - 1, Math.ceil(r.x + r.w));
        const y0 = Math.max(0, Math.floor(r.y)), y1 = Math.min(before.height - 1, Math.ceil(r.y + r.h));
        if (y0 >= before.height || y1 <= 0 || x1 <= 0) continue;

        let best = null;
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const fg = px(before, x, y);
            const bg = px(after, x, y);
            const delta = Math.abs(fg[0] - bg[0]) + Math.abs(fg[1] - bg[1]) + Math.abs(fg[2] - bg[2]);
            /* Antialiased edge pixels are a blend of glyph and ground and
               would flatter the result. Only near-solid coverage counts. */
            if (delta < 90) continue;
            glyphPixels++;
            if (!best || delta > best.delta) best = { delta, fg, bg };
          }
        }
        if (best) {
          const c = ratio(best.fg, best.bg);
          if (!worst || c < worst.c) worst = { c, fg: best.fg, bg: best.bg };
        }
      }

      measured++;

      if (glyphPixels === 0) {
        if (item.masked) continue;
        failures.push({
          width, path, ...item,
          why: 'NOT PAINTED - identical with and without text colour',
        });
        continue;
      }

      const need = required(item.px, item.weight);
      if (worst.c < need && !item.masked) {
        failures.push({
          width, path, ...item,
          why: `${worst.c.toFixed(2)}:1 (needs ${need}) fg rgb(${worst.fg}) bg rgb(${worst.bg})`,
        });
      }
    }
    /* The skip link, focused - the only state in which anyone sees it. */
    await page.focus('.skip-link').catch(() => {});
    await page.waitForTimeout(250);
    const focusItems = await page.evaluate(collect);
    const skip = focusItems.find((i) => i.sel.includes('skip-link'));
    if (skip) {
      const fBefore = PNG.sync.read(await page.screenshot({ fullPage: true }));
      const fHandle = await page.addStyleTag({ content: KILL_TEXT_COLOUR });
      await page.waitForTimeout(120);
      const fAfter = PNG.sync.read(await page.screenshot({ fullPage: true }));
      await fHandle.evaluate((el) => el.remove());

      let best = null;
      for (const r of skip.rects) {
        const x0 = Math.max(0, Math.floor(r.x)), x1 = Math.min(fBefore.width - 1, Math.ceil(r.x + r.w));
        const y0 = Math.max(0, Math.floor(r.y)), y1 = Math.min(fBefore.height - 1, Math.ceil(r.y + r.h));
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const fg = px(fBefore, x, y), bg = px(fAfter, x, y);
            const delta = Math.abs(fg[0]-bg[0]) + Math.abs(fg[1]-bg[1]) + Math.abs(fg[2]-bg[2]);
            if (delta < 90) continue;
            if (!best || delta > best.delta) best = { delta, fg, bg };
          }
        }
      }
      measured++;
      if (!best) {
        failures.push({ width, path, ...skip, why: 'NOT PAINTED even when focused' });
      } else {
        const c = ratio(best.fg, best.bg);
        const need = required(skip.px, skip.weight);
        if (c < need) {
          failures.push({ width, path, ...skip, why: `focused: ${c.toFixed(2)}:1 (needs ${need})` });
        }
      }
      await page.evaluate(() => document.activeElement?.blur());
    }

    process.stdout.write(`${path}@${width} `);
  }
  await ctx.close();
}
await browser.close();

console.log(`\n\nmeasured ${measured} text elements`);
if (!failures.length) {
  console.log('\nNO CONTRAST FAILURES\n');
  process.exit(0);
}
console.log(`\n${failures.length} CONTRAST FAILURES\n`);
for (const f of failures) {
  console.log(`  ${f.path}@${f.width}  ${f.sel}  ${f.px}px/${f.weight}`);
  console.log(`      "${f.text}"`);
  console.log(`      ${f.why}\n`);
}
process.exit(1);
