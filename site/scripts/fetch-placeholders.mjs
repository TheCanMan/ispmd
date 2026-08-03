/**
 * Sources placeholder photography for every image slot in DESIGN.md 15.
 *
 * Openverse is used rather than the Unsplash or Pexels APIs because both of
 * those now require a key, and this build has to be reproducible by anyone
 * with the repository. The filter is license=cc0,pdm, so nothing committed
 * here carries an attribution obligation - CREDITS.md records provenance
 * anyway, because a school site should be able to say where its pictures
 * came from.
 *
 * The photographs are NOT graded here. The section 8 treatments are applied
 * at render time by Media.astro from the slot's `treatment` field, which is
 * what makes swapping in a real photo a data edit rather than a re-export.
 *
 *   node scripts/fetch-placeholders.mjs           stage candidates
 *   node scripts/fetch-placeholders.mjs --commit  crop the chosen ones in
 *
 * Candidate choices live in scripts/placeholder-choices.json.
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STAGE = resolve(ROOT, '.placeholder-cache');
const OUT = resolve(ROOT, 'src/assets/media/placeholder');
const CHOICES = resolve(ROOT, 'scripts/placeholder-choices.json');

const UA = 'ispmd-site-build/1.0 (https://github.com/TheCanMan/ispmd)';

/** Slot id -> { queries, ratio, minWidth }. Mirrors the registry in section 15. */
export const SLOTS = {
  'home.community.wide':          { ratio: [21, 9], minWidth: 2400, queries: ['community gathering', 'people workshop room', 'group meeting room'] },
  'home.program.arabic':          { ratio: [4, 5],  minWidth: 1200, queries: ['hands open book', 'reading book hands', 'book table reading'] },
  'home.calendar.room':           { ratio: [5, 4],  minWidth: 1600, queries: ['empty classroom', 'empty chairs room', 'classroom desks'] },
  'story.opening':                { ratio: [21, 9], minWidth: 2400, queries: ['doorway light', 'entrance hall', 'open door building'] },
  'story.families':               { ratio: [4, 5],  minWidth: 1200, queries: ['parent child reading', 'family reading book', 'adult child book'] },
  'story.volunteers':             { ratio: [5, 4],  minWidth: 1600, queries: ['volunteers working', 'people arranging room', 'community volunteers'] },
  'program.arabic':               { ratio: [4, 5],  minWidth: 1200, queries: ['child writing', 'writing notebook', 'handwriting paper'] },
  'program.deen':                 { ratio: [4, 5],  minWidth: 1200, queries: ['children group circle', 'kids sitting together', 'children talking group'] },
  'program.between':              { ratio: [5, 4],  minWidth: 1600, queries: ['school corridor', 'hallway windows', 'corridor interior'] },
  'program.showcase':             { ratio: [16, 9], minWidth: 2000, queries: ['audience seated', 'presentation room', 'rows of chairs'] },
  'calendar.milestone.showcase':  { ratio: [1, 1],  minWidth: 1000, queries: ['child presenting', 'speaking to group', 'student presentation'] },
  'calendar.milestone.exams':     { ratio: [1, 1],  minWidth: 1000, queries: ['pencils paper desk', 'notebook pencil', 'stationery desk'] },
  'calendar.milestone.quran':     { ratio: [1, 1],  minWidth: 1000, queries: ['group gathering indoor', 'people together room', 'community celebration'] },
  'enroll.sunday':                { ratio: [16, 9], minWidth: 2000, queries: ['hall interior light', 'community centre interior', 'bright interior windows'] },
  'enroll.classroom':             { ratio: [4, 5],  minWidth: 1200, queries: ['children learning table', 'small class students', 'students working table'] },
  'faqs.aside':                   { ratio: [4, 5],  minWidth: 1200, queries: ['child looking window', 'child profile', 'kid thinking'] },
  'give.impact':                  { ratio: [21, 9], minWidth: 2400, queries: ['auditorium seats', 'hall from back', 'lecture hall'] },
  'give.classroom':               { ratio: [5, 4],  minWidth: 1600, queries: ['books shelf', 'library books', 'school supplies'] },
  'contact.venue':                { ratio: [5, 4],  minWidth: 1600, queries: ['building exterior morning', 'modern building facade', 'community building'] },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(query, minWidth) {
  const url =
    'https://api.openverse.org/v1/images/?' +
    new URLSearchParams({
      q: query,
      license: 'cc0,pdm',
      page_size: '20',
      mature: 'false',
      filter_dead: 'true',
      /* StockSnap and Rawpixel are the two CC0 sources in Openverse that hold
         modern editorial stock at print resolution. The rest of the CC0 pool
         is archival Flickr capped around 1024px, which fails every minWidth
         in section 15. */
      source: 'stocksnap,rawpixel',
    });
  /* The public endpoint rate-limits without warning and returns an empty
     page rather than an error, so back off and retry rather than silently
     recording "no candidates". */
  let data = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) { data = await res.json(); break; }
    if (res.status !== 429 && res.status < 500) throw new Error(`openverse ${res.status} for "${query}"`);
    await sleep(1500 * (attempt + 1));
  }
  if (!data) throw new Error(`openverse unavailable for "${query}"`);
  return (data.results ?? [])
    .filter((r) => (r.width ?? minWidth) >= minWidth && /jpg|jpeg|png/i.test(r.filetype ?? 'jpg'))
    .map((r) => ({
      id: r.id,
      title: r.title,
      creator: r.creator,
      license: `${r.license}${r.license_version ? ' ' + r.license_version : ''}`,
      source: r.source,
      landing: r.foreign_landing_url,
      url: r.url,
      width: r.width,
      height: r.height,
      query,
    }));
}

async function stage() {
  mkdirSync(STAGE, { recursive: true });
  /* Accumulate across runs. Openverse relevance shifts between calls, so a
     slot that came back empty once can fill on a later pass. */
  const indexPath = resolve(STAGE, 'candidates.json');
  const index = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf8')) : {};
  for (const [slot, cfg] of Object.entries(SLOTS)) {
    const found = index[slot] ?? [];
    const seen = new Set(found.map((f) => f.id));
    for (const q of cfg.queries) {
      if (found.length >= 8) break;
      let hits = [];
      try {
        hits = await search(q, cfg.minWidth);
      } catch (err) {
        console.warn(`  ! ${slot}: ${err.message}`);
      }
      for (const h of hits) {
        if (found.length >= 8 || seen.has(h.id)) continue;
        seen.add(h.id);
        found.push(h);
      }
      await sleep(700);
    }
    index[slot] = found;
    console.log(`${slot.padEnd(30)} ${found.length} candidates`);
  }
  writeFileSync(resolve(STAGE, 'candidates.json'), JSON.stringify(index, null, 2));

  // Download every candidate at contact-sheet size so they can be reviewed.
  for (const [slot, cands] of Object.entries(index)) {
    for (const [i, c] of cands.entries()) {
      const file = resolve(STAGE, `${slot.replace(/\./g, '-')}--${i}.jpg`);
      if (existsSync(file)) continue;
      try {
        const res = await fetch(c.url, { headers: { 'User-Agent': UA } });
        if (!res.ok) continue;
        const buf = Buffer.from(await res.arrayBuffer());
        await sharp(buf).resize({ width: 420 }).jpeg({ quality: 74 }).toFile(file);
      } catch {
        /* a dead candidate is not fatal; there are five others */
      }
    }
  }
  console.log(`\nStaged in ${STAGE}. Build contact sheets, choose, then --commit.`);
}

async function commit() {
  const index = JSON.parse(readFileSync(resolve(STAGE, 'candidates.json'), 'utf8'));
  const choices = JSON.parse(readFileSync(CHOICES, 'utf8'));
  mkdirSync(OUT, { recursive: true });

  const credits = [
    '# Placeholder photography credits',
    '',
    'Every file in this folder is a placeholder. None of them is a photograph',
    'of the Islamic School of Potomac, and the `alt` text in the media registry',
    'describes what is actually in the frame rather than claiming otherwise.',
    'The intended photograph is described in each slot\'s `realAlt`.',
    '',
    'All images are CC0 or public domain, sourced through Openverse. No',
    'attribution is legally required; it is recorded here anyway.',
    '',
    '| Slot | Source | Creator | License | Original |',
    '|---|---|---|---|---|',
  ];

  for (const [slot, pick] of Object.entries(choices)) {
    if (slot.startsWith('_')) continue;
    const cfg = SLOTS[slot];
    if (!cfg) throw new Error(`Unknown slot in choices: ${slot}`);
    /* A [slot, index] pair borrows a candidate that surfaced under another
       slot's query. Subject matter does not respect the query that found it. */
    const spec = typeof pick === 'object' && !Array.isArray(pick) ? pick : { index: pick };
    const fromSlot = spec.from ?? slot;
    const i = spec.index;
    const cand = index[fromSlot]?.[i];
    if (!cand) throw new Error(`No candidate ${i} staged for ${fromSlot}`);
    if ((cand.width ?? 0) < cfg.minWidth) {
      throw new Error(
        `${slot}: source is ${cand.width}px, below minWidth ${cfg.minWidth}. ` +
          `Upscaling a placeholder is a lie about its quality; pick another candidate.`
      );
    }

    const res = await fetch(cand.url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`download failed for ${slot}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    const [rw, rh] = cfg.ratio;
    const width = cfg.minWidth;
    const height = Math.round((width * rh) / rw);
    const file = resolve(OUT, `${slot.replace(/\./g, '-')}.jpg`);

    await sharp(buf)
      .resize(width, height, { fit: 'cover', position: spec.crop ?? sharp.strategy.attention })
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(file);

    credits.push(
      `| \`${slot}\` | ${cand.source} | ${cand.creator ?? 'unknown'} | ${cand.license} | ${cand.landing} |`
    );
    console.log(`${slot.padEnd(30)} ${width}x${height}`);
  }

  credits.push('');
  writeFileSync(resolve(OUT, 'CREDITS.md'), credits.join('\n'));
}

if (process.argv.includes('--commit')) {
  await commit();
} else {
  await stage();
}
