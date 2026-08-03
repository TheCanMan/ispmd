# Islamic School of Potomac - ispmd.org

New website for the [Islamic School of Potomac](https://ispmd.org), a Sunday school in Potomac, Maryland serving Muslim children ages 5-18.

Replaces an aging Squarespace site. Built as a design showcase: Astro 7 + GSAP + Lenis + Three.js, static, deployed to Cloudflare Pages.

## Layout

- `site/` - the Astro site. See `site/DESIGN.md` for the design system and `site/COPY.md` for the copy deck.
- `research/` - legacy site content, the verified 2026-27 calendar transcription, image inventory
- `.github/workflows/deploy.yml` - Cloudflare Pages deploy on push to `main`

## Develop

```sh
cd site
npm install
npm run dev
```

## Deploy

```sh
cd site
npm run build
npx wrangler pages deploy dist --project-name ispmd --branch main
```

Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Status

`ispmd.org` still points at Squarespace. This site deploys to a Cloudflare Pages preview URL only.
**DNS cutover is a separate, explicitly approved step.**

## Architecture in one line

Every photo and video position is a slot in `site/src/data/media.ts` with a declared aspect ratio, so real photography drops in later as a data edit rather than a layout rewrite.

Full planning artifacts live in Traycer under epic `c3b21fdb-f266-4468-a47b-b8040e98ccc1`.
