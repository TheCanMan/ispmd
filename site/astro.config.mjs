// @ts-check
import { defineConfig } from 'astro/config';

/**
 * `site` is required for canonical URLs, Open Graph tags, and the absolute
 * URL embedded in the generated .ics file.
 *
 * Today this builds for the Cloudflare Pages project while ispmd.org still
 * points at Squarespace. Emitting canonical tags for ispmd.org before cutover
 * would point search engines at a different site, so the default is the Pages
 * URL and cutover is a single environment variable:
 *
 *   SITE_URL=https://ispmd.org npm run build
 */
const SITE = process.env.SITE_URL ?? 'https://ispmd.pages.dev';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  vite: {
    build: {
      // Three.js is dynamically imported by the homepage only.
      chunkSizeWarningLimit: 700,
    },
  },
});
