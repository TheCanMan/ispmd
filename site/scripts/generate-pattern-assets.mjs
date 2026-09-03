/**
 * Generates every flat pattern and surface asset in public/img/.
 *
 * The geometry is derived here rather than hand-typed so that the vertex
 * table in DESIGN.md section 9.2 is the single source of truth. Run with:
 *
 *   npm run gen:pattern
 *
 * Outputs are committed. This script exists so they can be audited and
 * regenerated, not so they are rebuilt on every build.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/img');
mkdirSync(OUT, { recursive: true });

/* Tokens. These are the only colours this script may emit (DESIGN.md 1). */
const INK = '#14261C';
const PAPER = '#F8FAF7';
const SIENNA = '#2F6B45';
const SLATE_DEEP = '#0F1F17';
const AMBER = '#D9EDC6';   /* --fill-apricot, a pale leaf: the poster's light end is green */

/* ---------------------------------------------------------------------
   9.2  The {10/3} decagram

   Ten vertices on a circle, each joined to the vertex three steps away.
   A single closed path that visits all ten vertices and self-intersects
   twenty times. Path order: 0 3 6 9 2 5 8 1 4 7 Z.
   --------------------------------------------------------------------- */

const round = (n) => Number(n.toFixed(2));

function decagramVertices(cx, cy, r) {
  return Array.from({ length: 10 }, (_, k) => {
    const a = (Math.PI / 180) * 36 * k;
    return [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))];
  });
}

const DECAGRAM_ORDER = [0, 3, 6, 9, 2, 5, 8, 1, 4, 7];

function decagramPath(cx, cy, r) {
  const v = decagramVertices(cx, cy, r);
  const pts = DECAGRAM_ORDER.map((k) => v[k]);
  return `M${pts.map(([x, y]) => `${x},${y}`).join(' L')} Z`;
}

/* Ten-fold symmetry cannot tile the plane periodically. The closest lattice
   on which decagrams meet tip to tip has period 2R horizontally and
   2R sin72 vertically, so the repeat is 1 : sin72 = 1 : 0.95106. */
const TILE_W = 1000;
const TILE_H = 951.06;
const CORNER_R = 500;
const CENTRE = [500, 475.53];
const CENTRE_R = 180;

const CORNERS = [
  [0, 0],
  [TILE_W, 0],
  [0, TILE_H],
  [TILE_W, TILE_H],
];

/* Four connecting straps, from a corner decagram vertex to a centre one.
   Endpoints are derived, then checked against the table in 9.2. */
const STRAPS = [
  { from: [CORNERS[0], 1], to: 6 },
  { from: [CORNERS[1], 4], to: 9 },
  { from: [CORNERS[2], 9], to: 4 },
  { from: [CORNERS[3], 6], to: 1 },
];

const EXPECTED_STRAPS = [
  [[404.51, 293.89], [354.38, 369.73]],
  [[595.49, 293.89], [645.62, 369.73]],
  [[404.51, 657.17], [354.38, 581.33]],
  [[595.49, 657.17], [645.62, 581.33]],
];

function strapPaths() {
  const centreV = decagramVertices(CENTRE[0], CENTRE[1], CENTRE_R);
  return STRAPS.map(({ from: [corner, k], to }, i) => {
    const cornerV = decagramVertices(corner[0], corner[1], CORNER_R);
    const a = cornerV[k];
    const b = centreV[to];
    const [ea, eb] = EXPECTED_STRAPS[i];
    for (const [got, want, label] of [[a, ea, 'from'], [b, eb, 'to']]) {
      if (Math.abs(got[0] - want[0]) > 0.02 || Math.abs(got[1] - want[1]) > 0.02) {
        throw new Error(
          `Strap ${'ABCD'[i]} ${label} endpoint is ${got} but DESIGN.md 9.2 says ${want}`
        );
      }
    }
    return `M${a[0]},${a[1]} L${b[0]},${b[1]}`;
  });
}

const STROKE = [
  'fill="none"',
  'stroke="currentColor"',
  'stroke-width="9"',
  'stroke-linejoin="miter"',
  'stroke-miterlimit="10"',
  'stroke-linecap="butt"',
].join(' ');

function girihTile({ construction }) {
  const paths = [
    ...CORNERS.map(([x, y]) => decagramPath(x, y, CORNER_R)),
    decagramPath(CENTRE[0], CENTRE[1], CENTRE_R),
    ...strapPaths(),
  ];

  /* The tile is used both inline (where currentColor inherits) and as a CSS
     background-image (where it does not). color on the root element gives the
     standalone case a token value rather than the black default. */
  const body = paths.map((d) => `  <path d="${d}"/>`).join('\n');

  let overlay = '';
  if (construction) {
    /* 9.2 - the circumscribing circle of every decagram and the ten radii of
       the centre decagram. This layer is what becomes permanently visible
       under prefers-reduced-motion (5.4). */
    const circles = [...CORNERS, CENTRE].map((c, i) => {
      const r = i < 4 ? CORNER_R : CENTRE_R;
      return `    <circle cx="${c[0]}" cy="${c[1]}" r="${r}"/>`;
    });
    const radii = decagramVertices(CENTRE[0], CENTRE[1], CENTRE_R).map(
      ([x, y]) => `    <line x1="${CENTRE[0]}" y1="${CENTRE[1]}" x2="${x}" y2="${y}"/>`
    );
    overlay =
      `\n  <g id="construction" fill="none" stroke="currentColor" stroke-width="3">\n` +
      `${circles.join('\n')}\n${radii.join('\n')}\n  </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_W} ${TILE_H}" width="${TILE_W}" height="${TILE_H}" color="${INK}" ${STROKE}>
${body}${overlay}
</svg>
`;
}

/* ---------------------------------------------------------------------
   4.3  The divider

   A hairline whose left 140px resolves into three cells of the lattice.
   Shipped at the detail's own size so it is never distorted by the
   full-width rule beside it; see .divider in global.css.
   --------------------------------------------------------------------- */

function divider() {
  const W = 140;
  const H = 40;
  /* Three decagrams sitting on the rule line, meeting tip to tip on the same
     lattice as the tile: R is set by the height, since a decagram is taller
     than it is wide by 1 : sin72. Three of them occupy 126px of the 140px
     detail, so the strapwork visibly relaxes back into the hairline. */
  const r = (H / 2) / Math.sin((72 * Math.PI) / 180);
  const cy = H / 2;
  const centres = [r, 3 * r, 5 * r];
  const paths = centres.map((cx) => decagramPath(cx, cy, r));
  /* The rule enters from the right edge of the detail and is drawn by the
     .divider__rule element; inside the detail it runs between the stars. */
  const body = paths.map((d) => `  <path d="${d}"/>`).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" color="${INK}" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="miter" stroke-miterlimit="10" stroke-linecap="butt">
${body}
  <line x1="0" y1="${cy}" x2="${W}" y2="${cy}"/>
</svg>
`;
}

/* ---------------------------------------------------------------------
   9.3  The logo mark and favicon
   One decagram, R=12 in a 28px box, in --sienna. This is the single place
   the pattern is allowed to appear as a complete, centred composition:
   it is a signature, not a composition.
   --------------------------------------------------------------------- */

function mark({ size, r, color, ground }) {
  const c = size / 2;
  const bg = ground ? `  <rect width="${size}" height="${size}" fill="${ground}"/>\n` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
${bg}  <path d="${decagramPath(c, c, r)}" fill="none" stroke="${color}" stroke-width="${(size / 28) * 1.6}" stroke-linejoin="miter" stroke-miterlimit="10" stroke-linecap="butt"/>
</svg>
`;
}

/* ---------------------------------------------------------------------
   6.4  Grain
   180x180 so it never moires against the WebGL canvas. Ink-tinted rather
   than black: a black speckle on warm paper reads dirty.
   --------------------------------------------------------------------- */

async function grain() {
  const N = 180;
  const px = Buffer.alloc(N * N * 4);
  /* Deterministic so the committed file does not churn between runs. */
  let seed = 0x1a2b3c4d;
  const rand = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed >>> 0) % 100000) / 100000;
  };
  /* Sparse rather than dense: most pixels stay fully transparent and the rest
     take one of three alpha steps. Dense per-pixel noise is incompressible and
     lands at ~16KB; this reads identically at --grain-opacity and fits the 6KB
     budget in section 11. */
  const LEVELS = [0, 64, 108, 128];
  for (let i = 0; i < N * N; i++) {
    const r = rand();
    const a = r < 0.72 ? 0 : LEVELS[1 + Math.min(2, Math.floor((r - 0.72) / 0.095))];
    px[i * 4 + 0] = 0x28;
    px[i * 4 + 1] = 0x1e;
    px[i * 4 + 2] = 0x14;
    px[i * 4 + 3] = a;
  }
  const buf = await sharp(px, { raw: { width: N, height: N, channels: 4 } })
    .png({ palette: true, colours: 4, compressionLevel: 9, effort: 10 })
    .toBuffer();
  writeFileSync(resolve(OUT, 'grain.png'), buf);
  return buf.length;
}

/* ---------------------------------------------------------------------
   The Open Graph poster
   Geometry, light and nothing else. No type: an OG image is the one place
   a wrong typeface would be uncorrectable after the fact, and 12.4 already
   forbids the alternatives.
   --------------------------------------------------------------------- */

async function ogPoster() {
  const W = 1200;
  const H = 630;
  const field = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="light" cx="62%" cy="38%" r="78%">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.92"/>
      <stop offset="42%" stop-color="${SIENNA}" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="${SLATE_DEEP}" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <rect width="${W}" height="${H}" fill="url(#light)"/>
</svg>`;

  /* --pattern-strong, the only opacity the lattice is allowed at this weight
     (9.1, rule 3). Applied as stroke-opacity so it survives compositing. */
  const tileSvg = girihTile({ construction: false })
    .replace(`color="${INK}"`, `color="${PAPER}"`)
    .replace('stroke-width="9"', 'stroke-width="9" stroke-opacity="0.34"');
  const tilePx = 420;
  const tile = await sharp(Buffer.from(tileSvg))
    .resize(tilePx, Math.round(tilePx * (TILE_H / TILE_W)))
    .png()
    .toBuffer();

  const meta = await sharp(tile).metadata();
  const tw = meta.width ?? tilePx;
  const th = meta.height ?? tilePx;
  const composites = [];
  for (let y = -th; y < H + th; y += th) {
    for (let x = -tw; x < W + tw; x += tw) {
      composites.push({ input: tile, left: Math.round(x), top: Math.round(y), blend: 'over' });
    }
  }

  const lattice = await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(composites)
    .png()
    .toBuffer();

  const out = await sharp(Buffer.from(field))
    .composite([{ input: lattice, blend: 'over' }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  writeFileSync(resolve(OUT, 'og-default.jpg'), out);
  return out.length;
}

/* --------------------------------------------------------------------- */

writeFileSync(resolve(OUT, 'girih-tile.svg'), girihTile({ construction: false }));
writeFileSync(resolve(OUT, 'girih-construction.svg'), girihTile({ construction: true }));
writeFileSync(resolve(OUT, 'divider.svg'), divider());
writeFileSync(resolve(OUT, 'mark.svg'), mark({ size: 28, r: 12, color: SIENNA }));
writeFileSync(
  resolve(ROOT, 'public/favicon.svg'),
  mark({ size: 64, r: 27, color: SIENNA, ground: PAPER })
);

const grainBytes = await grain();
const ogBytes = await ogPoster();

console.log(`girih-tile.svg          ok`);
console.log(`girih-construction.svg  ok`);
console.log(`divider.svg             ok`);
console.log(`mark.svg / favicon.svg  ok`);
console.log(`grain.png               ${(grainBytes / 1024).toFixed(1)}KB  (budget 6KB)`);
console.log(`og-default.jpg          ${(ogBytes / 1024).toFixed(1)}KB`);
