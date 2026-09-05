/**
 * axe-core over every page, at a phone width and a desktop width.
 *
 * The JotForm iframe on /enroll is third-party markup we do not control and
 * cannot fix; its findings are reported separately rather than folded into
 * our count, so a real regression in our own code cannot hide behind it.
 */
import { chromium } from 'playwright';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve('axe-core');
const PORT = process.env.PORT ?? '4500';
const WIDTHS = [360, 1440];
const PAGES = [
  '/', '/our-story', '/program', '/calendar', '/enroll', '/faqs', '/give', '/contact', '/404',
];

const browser = await chromium.launch();
let ours = 0;
const notes = [];

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();

  for (const path of PAGES) {
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await page.addScriptTag({ path: AXE_PATH });

    const results = await page.evaluate(async () =>
      await window.axe.run(document, {
        resultTypes: ['violations'],
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
      })
    );

    for (const v of results.violations) {
      const foreign = v.nodes.every((n) => n.target.join(' ').includes('iframe'));
      if (foreign) {
        notes.push(`${path} @${width}  (JotForm iframe, not our code: ${v.id})`);
        continue;
      }
      ours++;
      console.log(`\n${path} @${width}  ${v.id}  [${v.impact}]`);
      console.log(`  ${v.help}`);
      for (const n of v.nodes.slice(0, 4)) console.log(`    ${n.target.join(' ')}`);
    }
  }
  await ctx.close();
}
await browser.close();

for (const n of [...new Set(notes)]) console.log(n);
if (ours) {
  console.log(`\naxe-core: ${ours} VIOLATIONS in our code\n`);
  process.exit(1);
}
console.log(`\naxe-core: ZERO violations in our code across all ${PAGES.length} pages at ${WIDTHS.join(' and ')}\n`);
