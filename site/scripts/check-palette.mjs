/**
 * Contrast matrix for the token palette.
 *
 *   node scripts/check-palette.mjs
 *
 * Every colour token is checked against EVERY ground it can legally land on,
 * not just the one it was designed against. The --text-faint defect came from
 * an annotation that quoted the best ground; this prints the worst.
 *
 * Thresholds: 4.5 for body-size text, 3.0 for >=24px and for non-text UI.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* ---- colour maths ------------------------------------------------- */

const lin = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => {
  const [r, g, b] = hex(h);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
export const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
};

/* ---- read the tokens straight out of the stylesheet --------------- */

const css = readFileSync(resolve(ROOT, 'src/styles/global.css'), 'utf8');
const root = css.slice(css.indexOf(':root {'), css.indexOf('/* ====', css.indexOf(':root {') + 3000));

function token(name) {
  const m = new RegExp(`\\s${name}:\\s*(#[0-9A-Fa-f]{6})`).exec(css);
  if (!m) throw new Error(`token ${name} not found or not a hex value`);
  return m[1];
}

const T = Object.fromEntries(
  [
    'paper', 'paper-warm', 'paper-cool', 'vellum',
    'ink', 'ink-raised', 'slate-deep', 'slate-raised',
    'text', 'text-soft', 'text-faint', 'text-link', 'text-link-warm', 'text-amber',
    'text-on-dark', 'text-on-dark-soft', 'text-on-dark-faint', 'link-on-dark', 'link-on-dark-cool',
    'sienna', 'sienna-ink', 'sienna-bright', 'slate', 'slate-light', 'amber', 'amber-deep',
    'fill-apricot', 'fill-sage', 'fill-sky', 'fill-amber', 'fill-mist',
    'state-ok', 'state-warn', 'state-error',
    'focus-color', 'focus-color-on-dark',
  ].map((n) => [n, token(`--${n}`)])
);

const LIGHT = ['paper', 'paper-warm', 'paper-cool', 'vellum'];
const DARK = ['ink', 'ink-raised', 'slate-deep', 'slate-raised'];
const FILLS = ['fill-apricot', 'fill-sage', 'fill-sky', 'fill-amber'];

/**
 * fg -> the grounds it is allowed on, and the ratio it must clear there.
 * 3.0 entries are either large-text-only roles or non-text UI.
 */
const RULES = [
  ...['text', 'text-soft', 'text-faint', 'text-link', 'text-link-warm', 'text-amber', 'sienna-ink']
    .map((fg) => [fg, LIGHT, 4.5]),
  ['state-ok', LIGHT, 4.5],
  ['state-warn', LIGHT, 4.5],
  ['state-error', LIGHT, 4.5],
  /* 1.4 restricts --sienna to >=16px text, fills and rules. 3.0 is the
     non-text / large-text floor it actually has to clear. */
  ['sienna', LIGHT, 3.0],
  ...['text-on-dark', 'text-on-dark-soft', 'link-on-dark', 'link-on-dark-cool']
    .map((fg) => [fg, DARK, 4.5]),
  /* 1.3 marks this one >=19px only. */
  ['text-on-dark-faint', DARK, 3.0],
  /* 1.4: "text on --ink only, never on --slate-deep". */
  ['sienna-bright', ['ink'], 4.5],
  /* 1.5: --text on any fill, for the labels inside calendar cells. */
  ['text', FILLS, 4.5],
  /* 10: focus rings are non-text UI. */
  ['focus-color', LIGHT, 3.0],
  ['focus-color-on-dark', DARK, 3.0],
];

/* Specific component pairings the token table cannot express. */
const PAIRS = [
  ['btn-primary label on fill', 'paper', 'sienna', 4.5],
  ['btn-primary hover fill', 'paper', 'ink', 4.5],
  ['btn-primary on dark', 'ink', 'sienna-bright', 4.5],
  ['btn-ghost on dark hover', 'ink', 'paper', 4.5],
  ['calendar cell border vs fill', 'text', 'fill-mist', 4.5],
];

let failures = 0;
console.log('\nTOKEN                 ' + LIGHT.concat(DARK, FILLS).map((g) => g.slice(0, 9).padStart(10)).join(''));

for (const [fg, grounds, need] of RULES) {
  const cells = LIGHT.concat(DARK, FILLS).map((g) => {
    if (!grounds.includes(g)) return ''.padStart(10);
    const c = contrast(T[fg], T[g]);
    const bad = c < need;
    if (bad) failures++;
    return (bad ? '!' : ' ') + c.toFixed(2).padStart(9);
  });
  const worst = Math.min(...grounds.map((g) => contrast(T[fg], T[g])));
  console.log(
    `${fg.padEnd(20)}${cells.join('')}   worst ${worst.toFixed(2)} need ${need}${worst < need ? '  <-- FAIL' : ''}`
  );
}

console.log('');
for (const [label, fg, bg, need] of PAIRS) {
  const c = contrast(T[fg], T[bg]);
  if (c < need) failures++;
  console.log(`${c >= need ? 'ok  ' : 'FAIL'} ${label.padEnd(28)} ${c.toFixed(2)} (need ${need})  ${T[fg]} on ${T[bg]}`);
}

/*
 * The four calendar fills carry meaning, so they must stay distinguishable.
 * Contrast RATIO is the wrong test for that - two hues of similar lightness
 * sit at ~1.0 and look nothing alike. Perceptual distance in OKLab is the
 * right one, and it is also what a colour-blind check approximates.
 */
function oklab(h) {
  let [r, g, b] = hex(h).map((c) => lin(c));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s2 = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s2,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s2,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s2,
  ];
}
const deltaE = (a, b) => {
  const [p, q] = [oklab(a), oklab(b)];
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
};

console.log('\nfill separation, OKLab dE (>= 0.06 is comfortably distinguishable):');
for (let i = 0; i < FILLS.length; i++) {
  for (let j = i + 1; j < FILLS.length; j++) {
    const d = deltaE(T[FILLS[i]], T[FILLS[j]]);
    const close = d < 0.06;
    if (close) failures++;
    console.log(`  ${close ? 'TOO CLOSE' : 'ok       '} ${FILLS[i].padEnd(12)} vs ${FILLS[j].padEnd(12)} dE ${d.toFixed(3)}`);
  }
}

console.log(failures ? `\n${failures} FAILURES\n` : '\npalette clean\n');
process.exit(failures ? 1 : 0);
