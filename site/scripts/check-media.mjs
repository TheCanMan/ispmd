/**
 * Validates the media slot registry against the files on disk.
 *
 *   npm run check:media
 *
 * WARNS locally, FAILS in CI (set CI=true, which GitHub Actions does).
 *
 * That split is deliberate. Hard-failing a local build on a missing file
 * deadlocks page work, because the agent building a page does not own the
 * assets folder and cannot fix what it does not own. CI on main is where the
 * gate belongs.
 *
 * What it checks, and why each one is here:
 *
 *  - the file exists                  the registry is worthless if it lies
 *  - width and height >= the slot's   a 2400px slot fed an 800px file is a
 *    minimums                         blurry hero on a retina phone
 *  - ASPECT deviation <= 25%          this is the one that actually bites.
 *                                     A 2400x3000 portrait PASSES minWidth
 *                                     2400 into a 16/9 slot while `cover`
 *                                     throws away 55% of the frame. Checking
 *                                     width alone caught the rare failure and
 *                                     was blind to the likely one.
 *  - alt is non-empty unless the      never ship a confident falsehood, and
 *    slot is marked decorative        never ship silence either
 *  - a video with a src has a poster
 *  - status: 'real' slots have left   the pre-cutover assertion
 *    src/assets/media/placeholder
 */

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = resolve(ROOT, 'src/assets/media');

const { media } = await import(resolve(ROOT, 'src/data/media/index.ts'));

const ASPECT_TOLERANCE = 0.25;

const problems = [];
const notes = [];

function ratioValue(ratio) {
  const [w, h] = String(ratio).split('/').map(Number);
  return w / h;
}

for (const [id, slot] of Object.entries(media)) {
  const where = `${id}`;

  if (!slot.decorative && !slot.alt?.trim()) {
    problems.push(`${where}: alt is empty. Mark the slot \`decorative: true\` or write alt text.`);
  }

  if (slot.decorative && slot.alt) {
    problems.push(`${where}: decorative slots render alt="", so the alt string here is dead text.`);
  }

  if (slot.status === 'placeholder' && slot.alt && !slot.realAlt && !slot.decorative) {
    notes.push(
      `${where}: no realAlt. The intended photograph's description belongs there, not in alt.`
    );
  }

  if (!slot.src) {
    /* The hero montage in State A is specified to have no file at all
       (DESIGN.md 13.2, 15). Anything else without a src is an oversight. */
    if (slot.kind === 'video' && slot.status === 'placeholder') {
      notes.push(`${where}: no file, which is State A as specified. Nothing to validate.`);
    } else {
      problems.push(`${where}: has no src.`);
    }
    continue;
  }

  if (slot.status === 'real' && slot.src.startsWith('placeholder/')) {
    problems.push(`${where}: status is 'real' but src still points into placeholder/.`);
  }

  if (slot.kind === 'video' && !slot.poster) {
    problems.push(`${where}: a video slot with a file must declare a poster.`);
  }

  const file = resolve(ASSETS, slot.src);
  if (!existsSync(file)) {
    problems.push(`${where}: src/assets/media/${slot.src} does not exist.`);
    continue;
  }

  if (slot.kind === 'video') continue;

  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch (err) {
    problems.push(`${where}: could not read ${slot.src} (${err.message}).`);
    continue;
  }

  const { width = 0, height = 0 } = meta;

  if (width < slot.minWidth) {
    problems.push(`${where}: ${width}px wide, slot needs ${slot.minWidth}px.`);
  }
  if (height < slot.minHeight) {
    problems.push(`${where}: ${height}px tall, slot needs ${slot.minHeight}px.`);
  }

  const want = ratioValue(slot.ratio);
  const got = width / height;
  const deviation = Math.abs(got - want) / want;
  if (deviation > ASPECT_TOLERANCE) {
    const lost = Math.round((1 - Math.min(got, want) / Math.max(got, want)) * 100);
    problems.push(
      `${where}: file is ${width}x${height} (${got.toFixed(2)}:1) in a ${slot.ratio} slot ` +
        `(${want.toFixed(2)}:1). ${(deviation * 100).toFixed(0)}% off; object-fit: cover will ` +
        `discard about ${lost}% of the frame. Re-crop it, or change the slot's ratio and let ` +
        `the page reflow - that is a one-field edit too, and often the right answer.`
    );
  }
}

const total = Object.keys(media).length;
const placeholders = Object.values(media).filter((s) => s.status === 'placeholder').length;

for (const note of notes) console.log(`  note  ${note}`);

if (problems.length === 0) {
  console.log(`\ncheck:media  ${total} slots, ${placeholders} still placeholder. Clean.\n`);
  process.exit(0);
}

const ci = process.env.CI === 'true' || process.env.CI === '1';
const label = ci ? 'ERROR' : 'warn ';
for (const p of problems) console.log(`  ${label} ${p}`);
console.log(
  `\ncheck:media  ${problems.length} problem${problems.length === 1 ? '' : 's'} across ${total} slots.` +
    (ci ? '\n' : '  (Warnings only outside CI.)\n')
);
process.exit(ci ? 1 : 0);
