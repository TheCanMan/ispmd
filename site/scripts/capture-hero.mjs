// Capture the homepage hero at Tier 1 (3D field + montage playing) and under reduced motion (poster).
// Also crops the aperture's lower-right so the watermark question can be judged from pixels.
import { chromium } from 'playwright'; import { mkdirSync } from 'node:fs';
const PORT = process.env.PORT || 4401; const OUT = process.env.OUT || '/tmp/ispmd-shots'; mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const [label, opts] of [['tier1-playing', {}], ['reduced-poster', { reducedMotion: 'reduce' }]]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  await ctx.addInitScript(() => Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 }));
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 80))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 80)); });
  await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' }); await p.waitForTimeout(6000);
  const v = await p.evaluate(() => { const v = document.querySelector('.hero-window video'); if (!v) return null;
    const r = v.getBoundingClientRect(); return { paused: v.paused, t: +v.currentTime.toFixed(2), src: (v.currentSrc || '').split('/').pop(), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) }; });
  console.log(`${label}: video=${JSON.stringify(v)} console-errors=${errs.length}`);
  await p.screenshot({ path: `${OUT}/hero-${label}.png` });
  if (v && label === 'tier1-playing') await p.screenshot({ path: `${OUT}/hero-aperture-lower-right.png`, clip: { x: v.x + v.w * 0.55, y: v.y + v.h * 0.55, width: v.w * 0.45, height: v.h * 0.45 } });
  await ctx.close();
}
await b.close();
