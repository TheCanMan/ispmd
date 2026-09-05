/**
 * Build the hero montage from source clips.
 *
 *   node scripts/build-montage.mjs <clip1> <clip2>
 *
 * Writes src/assets/media/real/hero-montage.{mp4,webm} and a poster JPEG.
 * Requires ffmpeg on PATH.
 *
 * ------------------------------------------------------------------------
 * WHY THE GRADE IS BAKED IN HERE RATHER THAN APPLIED IN CSS
 *
 * The source clips are generated footage with a muted documentary look -
 * measured mean luminance 98.7 and 93.1 on 0-255, which is an overcast day.
 * Under the site's old CSS grade, which desaturated and multiplied, that
 * compounded into the dim wash the school reacted to.
 *
 * Correcting it at encode time means the pixels that ship are already right,
 * so the browser composites a good image instead of trying to rescue a bad
 * one through a filter. The slot's treatment is 'raw' for exactly this
 * reason: grading twice is how the dimness came back.
 *
 * The lift is gamma-led on purpose. `gamma` maps 1 to 1, so it opens the
 * midtones and shadows while leaving white at white; `brightness` is additive
 * and clips the top end, so it is kept small. Measured result: mean Y 121.8,
 * with 0.03% of pixels above 252 - which is to say, effectively no clipping.
 *
 * ------------------------------------------------------------------------
 * THE LOOP
 *
 * Two 10s clips crossfade at the seam. The result is then crossfaded with
 * its own head, so the last frame resolves into the first and the loop has
 * no cut in it. Length is 18.4s rather than 20s because each crossfade
 * consumes its own duration.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/assets/media/real');

const [, , clip1, clip2] = process.argv;
if (!clip1 || !clip2) {
  console.error('usage: node scripts/build-montage.mjs <clip1> <clip2>');
  process.exit(2);
}
for (const c of [clip1, clip2]) {
  if (!existsSync(c)) {
    console.error(`build-montage: ${c} does not exist.`);
    process.exit(2);
  }
}

/** Gamma-led lift. See the header: gamma is highlight-safe, brightness is not. */
const LIFT = 'eq=gamma=1.28:brightness=0.02:saturation=1.24';
const XFADE = 0.8;
const CLIP = 10;

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const probe = (file, entries) =>
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', entries, '-of', 'csv=p=0', file])
    .toString()
    .trim();

/**
 * Mean luminance over every frame, 0-255.
 *
 * Two sharp edges here, both of which silently produced NaN:
 *   - `csv=p=0` puts a trailing comma on the first row, so Number('130.4,')
 *     is NaN and one bad row poisons the whole average. parseFloat, then
 *     drop anything non-finite.
 *   - the `movie=` filter is parsed by ffmpeg, not by the shell, so a path
 *     containing a space, a colon or a backslash has to be escaped for the
 *     FILTER grammar even though execFileSync passes it through untouched.
 */
const meanY = (file) => {
  const escaped = file.replace(/([\\':])/g, '\\$1').replace(/ /g, '\\ ');
  const rows = execFileSync('ffprobe', [
    '-v', 'error', '-f', 'lavfi', '-i', `movie=${escaped},signalstats`,
    '-show_entries', 'frame_tags=lavfi.signalstats.YAVG', '-of', 'csv=p=0',
  ])
    .toString()
    .split('\n')
    .map((line) => parseFloat(line))
    .filter(Number.isFinite);
  if (!rows.length) return NaN;
  return rows.reduce((a, b) => a + b, 0) / rows.length;
};

mkdirSync(OUT, { recursive: true });

const seam = CLIP - XFADE;                 /* 9.2  */
const joined = CLIP * 2 - XFADE;           /* 19.2 */
const body = joined - XFADE;               /* 18.4 */

const graph = [
  `[0:v]${LIFT},setpts=PTS-STARTPTS[a]`,
  `[1:v]${LIFT},setpts=PTS-STARTPTS[b]`,
  `[a][b]xfade=transition=fade:duration=${XFADE}:offset=${seam}[m]`,
  `[m]split=2[m1][m2]`,
  `[m1]trim=0:${XFADE},setpts=PTS-STARTPTS[head]`,
  `[m2]trim=${XFADE}:${joined},setpts=PTS-STARTPTS[bodyv]`,
  `[bodyv][head]xfade=transition=fade:duration=${XFADE}:offset=${body - XFADE},format=yuv420p[out]`,
].join(';');

const mp4 = resolve(OUT, 'hero-montage.mp4');
const webm = resolve(OUT, 'hero-montage.webm');
const poster = resolve(OUT, 'hero-montage-poster.jpg');

console.log(`source mean Y: ${meanY(clip1).toFixed(1)} and ${meanY(clip2).toFixed(1)}`);

ff(['-i', clip1, '-i', clip2, '-filter_complex', graph, '-map', '[out]', '-an',
    '-c:v', 'libx264', '-profile:v', 'high', '-crf', '24', '-preset', 'slow',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);

ff(['-i', mp4, '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1',
    '-deadline', 'good', '-cpu-used', '2', '-an', webm]);

/* Frame 12 rather than frame 0: the first frames of a generated clip are
   often the least settled, and the poster is what a reduced-motion visitor
   sees for as long as they are on the page. */
ff(['-i', mp4, '-vf', 'select=eq(n\\,12)', '-vframes', '1', '-q:v', '3', poster]);

const mb = (f) => (statSync(f).size / 1048576).toFixed(2);
console.log(`\n  ${probe(mp4, 'stream=width,height').replace(',', 'x')}  ${probe(mp4, 'format=duration')}s`);
console.log(`  mp4    ${mb(mp4)} MB`);
console.log(`  webm   ${mb(webm)} MB`);
console.log(`  poster ${mb(poster)} MB`);
console.log(`  montage mean Y: ${meanY(mp4).toFixed(1)}  (target 120-135)\n`);
