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

/*
 * Two severities, because they answer different questions.
 *
 *   problems    fatal in CI. Something is wrong.
 *   advisories  never fatal, in any environment. Something is known and
 *               accepted - the 19 generated illustrations land at 928-1584px
 *               against minimums written for real photography. The minimums
 *               stay as written, because they are the brief for the real
 *               shoot; a generated file under them is a trade we made, not a
 *               defect, and blocking every deploy on it would train everyone
 *               to ignore the check.
 *
 * Aspect deviation is fatal for every provenance. A wrong crop is wrong
 * whatever made the file.
 */
const problems = [];
const advisories = [];
const notes = [];

/** Undersize is only a hard failure for a real photograph. */
const sizeIssue = (slot, message) =>
  (slot.provenance === 'photo' ? problems : advisories).push(message);

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

  /*
   * Provenance drives the alt prefix, and this is what stops them drifting.
   * A generated illustration that describes itself as a photograph of this
   * school is a confident falsehood told to exactly the users who cannot
   * check it, so it is fatal rather than advisory.
   */
  if (!slot.provenance) {
    problems.push(`${where}: no provenance. Say what this file is: 'placeholder', 'generated' or 'photo'.`);
  } else if (!slot.decorative && slot.alt?.trim()) {
    const prefixed = /^illustration:\s/i.test(slot.alt.trim());
    if (slot.provenance === 'generated' && !prefixed) {
      problems.push(
        `${where}: provenance is 'generated' but alt does not begin "Illustration:". ` +
          `A screen-reader user cannot see that this is not a photograph of the school.`
      );
    }
    if (slot.provenance === 'photo' && prefixed) {
      problems.push(
        `${where}: provenance is 'photo' but alt still begins "Illustration:". ` +
          `Drop the prefix - this one really is a photograph.`
      );
    }
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

  /*
   * A declared poster that is not on disk is worse than no poster: the video
   * element falls back to a transparent box, so the aperture renders empty
   * and looks identical to State A. Check the file, and check its shape -
   * a poster in the wrong ratio flashes a differently-cropped frame before
   * the first video frame paints.
   */
  if (slot.kind === 'video' && slot.poster) {
    const posterFile = resolve(ASSETS, slot.poster);
    if (!existsSync(posterFile)) {
      problems.push(`${where}: poster src/assets/media/${slot.poster} does not exist.`);
    } else {
      try {
        const pm = await sharp(posterFile).metadata();
        const [rw, rh] = slot.ratio.split('/').map(Number);
        const want = rw / rh;
        const got = pm.width / pm.height;
        if (Math.abs(got - want) / want > 0.25) {
          problems.push(
            `${where}: poster is ${pm.width}x${pm.height} (${got.toFixed(2)}), ` +
              `slot ratio is ${slot.ratio} (${want.toFixed(2)}).`
          );
        }
        if (pm.width < slot.minWidth) {
          sizeIssue(slot, `${where}: poster is ${pm.width}px wide, slot minimum is ${slot.minWidth}.`);
        }
      } catch (err) {
        problems.push(`${where}: could not read poster ${slot.poster} (${err.message}).`);
      }
    }
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
    sizeIssue(slot, `${where}: ${width}px wide, slot needs ${slot.minWidth}px. [${slot.provenance ?? 'unset'}]`);
  }
  if (height < slot.minHeight) {
    sizeIssue(slot, `${where}: ${height}px tall, slot needs ${slot.minHeight}px. [${slot.provenance ?? 'unset'}]`);
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
const byProv = (p) => Object.values(media).filter((s) => s.provenance === p).length;

for (const note of notes) console.log(`  note  ${note}`);
for (const a of advisories) console.log(`  note  ${a}`);

const census =
  `${total} slots: ${byProv('photo')} photo, ${byProv('generated')} generated, ` +
  `${byProv('placeholder')} placeholder (${placeholders} not yet wired up)`;

if (problems.length === 0) {
  console.log(
    `\ncheck:media  ${census}.\n` +
      `${advisories.length} advisory note${advisories.length === 1 ? '' : 's'} ` +
      `(size floors on non-photo slots, never fatal). Clean.\n`
  );
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
