/**
 * Ingest generated stills into the media registry.
 *
 *   node scripts/ingest-media.mjs <folder>            # dry run, writes nothing
 *   node scripts/ingest-media.mjs <folder> --apply    # crops, encodes, edits
 *
 * Input files are named by slot id exactly as the registry spells it:
 *
 *   enroll.sunday.png          -> the enroll.sunday slot
 *   enroll.sunday.2.png        -> an ALTERNATE for that slot
 *
 * For each file the slot's own `ratio`, `minWidth`, `minHeight` and `focal`
 * decide the crop. Nothing is inferred from the image: the registry has
 * always been the authority on shape, and that is the whole point of it.
 *
 * ------------------------------------------------------------------------
 * TWO THINGS THIS DELIBERATELY DOES NOT DO
 *
 * 1. It never upscales. A file narrower than the slot's minWidth is a
 *    warning and is written at its own size. Interpolating a 1200px file up
 *    to 2400 produces a 2400px file that looks worse than the original and
 *    reports as compliant, which is the worst of both.
 *
 * 2. It never picks between alternates. `slot.2.png` is written to
 *    real/alternates/ and reported, and the registry is left pointing at the
 *    primary. Choosing which photograph of a child represents a school is
 *    not a decision a build script should be making on its own.
 *
 * ------------------------------------------------------------------------
 * ALT TEXT. Every alt written here is prefixed "Illustration:".
 *
 * These images are generated. They are not photographs of the Islamic School
 * of Potomac, and a screen-reader user has no way to tell from the page that
 * they are looking at an illustration rather than at this school's children.
 * `realAlt` was written for real photography, so promoting it verbatim would
 * turn "Children arriving on a Sunday morning" into a claim about a specific
 * school that nobody made and that is not true. The prefix is the difference
 * between describing an image and asserting a fact about a real place.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = resolve(ROOT, 'src/assets/media');
const OUT_DIR = resolve(ASSETS, 'real');
const ALT_DIR = resolve(OUT_DIR, 'alternates');
const REGISTRIES = ['home.ts', 'calendar.ts', 'content.ts'].map((f) =>
  resolve(ROOT, 'src/data/media', f)
);

const JPEG_QUALITY = 82;
const ASPECT_TOLERANCE = 0.25;

const [, , folderArg, ...flags] = process.argv;
const APPLY = flags.includes('--apply');

if (!folderArg) {
  console.error('usage: node scripts/ingest-media.mjs <folder> [--apply]');
  process.exit(2);
}
const FOLDER = resolve(process.cwd(), folderArg);
if (!existsSync(FOLDER)) {
  console.error(`ingest: ${FOLDER} does not exist.`);
  process.exit(2);
}

/* ------------------------------------------------------------------ */
/* Read the registry as TEXT.
 *
 * These are .ts modules with comments and computed strings, so they cannot
 * simply be imported here. Each slot is located by its quoted key and read
 * by brace matching, which is exact for this file shape and does not care
 * about the prose around it.
 */

const readSlots = () => {
  const slots = new Map();
  for (const file of REGISTRIES) {
    const text = readFileSync(file, 'utf8');
    const keyRe = /^\s{2}'([a-z0-9.]+)':\s*\{/gm;
    let m;
    while ((m = keyRe.exec(text))) {
      const id = m[1];
      let depth = 0;
      let i = text.indexOf('{', m.index);
      const start = i;
      for (; i < text.length; i++) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') {
          depth--;
          if (depth === 0) break;
        }
      }
      const body = text.slice(start, i + 1);
      const field = (name) => {
        const f = new RegExp(`\\b${name}:\\s*'([^']*)'`).exec(body);
        return f ? f[1] : undefined;
      };
      const num = (name) => {
        const f = new RegExp(`\\b${name}:\\s*(\\d+)`).exec(body);
        return f ? Number(f[1]) : undefined;
      };
      slots.set(id, {
        id,
        file,
        start,
        end: i + 1,
        body,
        kind: field('kind'),
        ratio: field('ratio'),
        focal: field('focal'),
        status: field('status'),
        minWidth: num('minWidth'),
        minHeight: num('minHeight'),
        realAlt: field('realAlt'),
      });
    }
  }
  return slots;
};

const slots = readSlots();

/* ------------------------------------------------------------------ */
/* Match input files to slots. */

const files = readdirSync(FOLDER).filter((f) => /\.(png|jpe?g|webp|tiff?)$/i.test(f));
const plan = [];
const unmatched = [];

for (const name of files.sort()) {
  const stem = basename(name, extname(name));
  const alt = /^(.*)\.(\d+)$/.exec(stem);
  const id = alt ? alt[1] : stem;
  const variant = alt ? Number(alt[2]) : 1;

  const slot = slots.get(id);
  if (!slot) {
    unmatched.push(name);
    continue;
  }
  if (slot.kind !== 'image') {
    unmatched.push(`${name} (slot ${id} is a ${slot.kind} slot)`);
    continue;
  }
  plan.push({ name, id, slot, variant });
}

/* ------------------------------------------------------------------ */
/* Crop geometry: the slot's ratio, anchored on the slot's focal point. */

const cropFor = (w, h, ratioStr, focalStr) => {
  const [rw, rh] = ratioStr.split('/').map(Number);
  const want = rw / rh;
  const [fx, fy] = (focalStr ?? '50% 50%')
    .split(/\s+/)
    .map((v) => parseFloat(v) / 100)
    .map((v) => (Number.isFinite(v) ? v : 0.5));

  let cw = w;
  let ch = Math.round(w / want);
  if (ch > h) {
    ch = h;
    cw = Math.round(h * want);
  }
  const left = Math.max(0, Math.min(w - cw, Math.round(fx * w - cw / 2)));
  const top = Math.max(0, Math.min(h - ch, Math.round(fy * h - ch / 2)));
  return { left, top, width: cw, height: ch, want };
};

/* ------------------------------------------------------------------ */

const results = [];

for (const item of plan) {
  const src = join(FOLDER, item.name);
  const meta = await sharp(src).metadata();
  const { left, top, width, height, want } = cropFor(
    meta.width,
    meta.height,
    item.slot.ratio,
    item.slot.focal
  );

  const warnings = [];
  const got = meta.width / meta.height;
  if (Math.abs(got - want) / want > ASPECT_TOLERANCE) {
    warnings.push(
      `aspect ${got.toFixed(2)} vs slot ${item.slot.ratio} (${want.toFixed(2)}) - ` +
        `off by ${((Math.abs(got - want) / want) * 100).toFixed(0)}%, so the crop discards a lot`
    );
  }
  if (meta.width < item.slot.minWidth) {
    warnings.push(
      `${meta.width}px wide, slot minimum is ${item.slot.minWidth} - written at source size, NOT upscaled`
    );
  }

  /* Target the slot's declared minimum, never larger and never interpolated
     upward: minWidth is already the retina figure the layout was designed
     against, so anything beyond it is bytes with no visible return. */
  const outWidth = Math.min(width, item.slot.minWidth);
  const outHeight = Math.round(outWidth / want);
  if (outHeight < item.slot.minHeight) {
    warnings.push(`resolves to ${outWidth}x${outHeight}, below slot minimum height ${item.slot.minHeight}`);
  }

  const fileStem = item.id.replace(/\./g, '-');
  const outName = item.variant === 1 ? `${fileStem}.jpg` : `${fileStem}-${item.variant}.jpg`;
  const outPath = item.variant === 1 ? join(OUT_DIR, outName) : join(ALT_DIR, outName);
  /* Alternates live under real/alternates/ and are never referenced by the
     registry, so report where the file actually lands rather than a path
     nothing points at. */
  const registrySrc = item.variant === 1 ? `real/${outName}` : `real/alternates/${outName}`;

  results.push({ ...item, meta, left, top, width, height, outWidth, outHeight, outPath, outName, registrySrc, warnings });

  if (!APPLY) continue;

  mkdirSync(item.variant === 1 ? OUT_DIR : ALT_DIR, { recursive: true });
  await sharp(src)
    .extract({ left, top, width, height })
    .resize(outWidth, outHeight, { fit: 'cover' })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(outPath);
}

/* ------------------------------------------------------------------ */
/* Registry edits - primaries only. */

const edits = new Map();

for (const r of results) {
  if (r.variant !== 1) continue;
  const slot = r.slot;

  let body = slot.body;
  const before = body;

  body = body.replace(/\bstatus:\s*'placeholder'/, "status: 'real'");

  /* Provenance is what these files ARE, and it is what drives both the alt
     prefix and the size-floor severity. Set it here so the two can never
     disagree with each other. */
  if (/\bprovenance:\s*'\w+'/.test(body)) {
    body = body.replace(/\bprovenance:\s*'\w+'/, "provenance: 'generated'");
  } else {
    body = body.replace(/\bstatus:\s*'real',/, "status: 'real',\n    provenance: 'generated',");
  }

  if (/\bsrc:\s*'[^']*'/.test(body)) {
    body = body.replace(/\bsrc:\s*'[^']*'/, `src: '${r.registrySrc}'`);
  } else {
    body = body.replace(/\bstatus:\s*'real',/, `status: 'real',\n    src: '${r.registrySrc}',`);
  }

  /* Promote realAlt, prefixed. A slot marked decorative keeps alt="" - it is
     already making no claim, and "Illustration: " on an empty string would
     announce a decoration to a screen reader for no reason. */
  const decorative = /\bdecorative:\s*true/.test(body);
  if (!decorative) {
    if (slot.realAlt) {
      const alt = `Illustration: ${slot.realAlt.charAt(0).toLowerCase()}${slot.realAlt.slice(1)}`;
      if (/\balt:\s*'[^']*'/.test(body)) {
        body = body.replace(/\balt:\s*'[^']*'/, `alt: '${alt.replace(/'/g, "\\'")}'`);
      } else {
        r.warnings.push('alt is not a simple quoted string - left untouched, edit by hand');
      }
    } else {
      r.warnings.push('no realAlt on this slot - alt left as the placeholder description');
    }
  }

  if (body !== before) {
    if (!edits.has(slot.file)) edits.set(slot.file, []);
    edits.get(slot.file).push({ start: slot.start, end: slot.end, body });
  }
  r.newBody = body;
}

if (APPLY) {
  for (const [file, list] of edits) {
    let text = readFileSync(file, 'utf8');
    /* Apply back-to-front so earlier offsets stay valid. */
    for (const e of list.sort((a, b) => b.start - a.start)) {
      text = text.slice(0, e.start) + e.body + text.slice(e.end);
    }
    writeFileSync(file, text);
  }
}

/* ------------------------------------------------------------------ */
/* Report. */

const mode = APPLY ? 'APPLIED' : 'DRY RUN - nothing written';
console.log(`\ningest-media  ${mode}`);
console.log(`source: ${FOLDER}`);
console.log(`${files.length} image files, ${results.length} matched to slots\n`);

for (const r of results.sort((a, b) => a.id.localeCompare(b.id))) {
  const tag = r.variant === 1 ? '' : `  [alternate ${r.variant}]`;
  console.log(`  ${r.id}${tag}`);
  console.log(`      ${r.name}  ${r.meta.width}x${r.meta.height}`);
  console.log(
    `      crop ${r.width}x${r.height} at ${r.left},${r.top} (focal ${r.slot.focal})` +
      `  ->  ${r.outWidth}x${r.outHeight}  ${r.registrySrc}`
  );
  if (r.variant === 1 && r.newBody) {
    const alt = /\balt:\s*'([^']*)'/.exec(r.newBody);
    if (alt && alt[1]) console.log(`      alt: "${alt[1]}"`);
  }
  for (const w of r.warnings) console.log(`      WARN  ${w}`);
}

const missing = [...slots.values()].filter(
  (s) => s.kind === 'image' && !results.some((r) => r.id === s.id && r.variant === 1)
);
if (missing.length) {
  console.log(`\n  no file supplied for ${missing.length} image slot(s):`);
  for (const s of missing) console.log(`      ${s.id}  (${s.ratio}, min ${s.minWidth}px)`);
}
if (unmatched.length) {
  console.log(`\n  ${unmatched.length} file(s) matched no slot:`);
  for (const u of unmatched) console.log(`      ${u}`);
}

const warned = results.filter((r) => r.warnings.length).length;
console.log(
  `\n${results.length} processed, ${warned} with warnings, ` +
    `${edits.size ? [...edits.values()].flat().length : 0} registry slot(s) ${APPLY ? 'updated' : 'would be updated'}.`
);
if (!APPLY) console.log('Re-run with --apply to write files and edit the registry.\n');
else console.log('Run `npm run check:media` now.\n');
