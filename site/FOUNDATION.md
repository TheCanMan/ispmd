# The foundation

What Phase 1 built, and how to use it. `DESIGN.md` and `COPY.md` are the contracts; this file
is the map to the code that implements them.

**Everything listed here is read-only to page agents.** If you need something that is not here,
stop and report it. Do not inline a value.

---

## Commands

```bash
npm run dev          # dev server
npm run build        # must stay green
npm run check        # astro check, currently 0 errors 0 warnings
npm run check:media  # validates the media registry; warns locally, fails in CI
npm run gen:pattern  # regenerates public/img from the 9.2 geometry (rarely needed)
```

---

## Two traps that cost real time. Read these before you write a component.

**1. `slot` is a reserved Astro attribute.** Passing `slot="..."` to a component makes Astro
treat it as a named-slot assignment and silently move the element somewhere else in the DOM.
The tech plan's illustrative snippet writes `<Media slot="..."/>`; the real prop is `slotId`.

```astro
<Media slotId="home.community.wide" sizes="100vw" />   <!-- correct -->
<Media slot="home.community.wide" />                    <!-- silently misplaced -->
```

**2. A class passed INTO a component does not carry the parent's scope.** Astro scopes styles
with a per-component attribute, so a scoped rule in the parent never matches an element that
lives inside a child component. The rule does not error, it just does nothing.

```astro
<MilestoneCard class="year__milestone--1" />
```
```css
.year__milestone--1 { grid-column: 1 / 4; }           /* inert */
:global(.year__milestone--1) { grid-column: 1 / 4; }  /* works */
```

---

## Tokens and utilities - `src/styles/global.css`

The §1 `:root` block and the §2.2 `@font-face` block are pasted verbatim and must not be edited.
Everything after them is the utility layer.

- **Type roles**: `.t-mega .t-hero .t-display .t-title .t-subtitle .t-lead .t-body .t-small
  .t-label .t-label-lg .t-ui .t-arabic .t-arabic-kufi`, plus `.t-italic`, `.t-num` (any number a
  reader might compare to another number) and `.t-mark` (the amber exclamation mark, twice
  site-wide).
- **Ground context**: put `.on-dark` on any dark subtree and every `--ctx-*` colour flips to the
  right row of §6.2 automatically. `.on-fill` does the same for a `--fill-*` cell. Type roles read
  `--ctx-text`, never `--text` directly, so this is the only lever you need.
- **Layout**: `.grid` (ten columns), `.container`, `.container-narrow`, `.container-wide`,
  `.measure`, `.measure-lead`, `.measure-display`, `.flow`, `.stack` + `.stack-N`, `.bleed-left`,
  `.bleed-right`.
- **Buttons**: `.btn-primary .btn-ghost .btn-ghost-on-dark .btn-quiet` - use the `<Button>`
  component rather than the classes.
- **Links**: `.link` for inline prose, `.link-hook` for nav and editorial index links (the 36°
  hooked underline). Never `.link-hook` on prose.
- **Other**: `.card`, `.media` + `.tr-*`, `.accordion*`, `.cal-cell*`, `.hairlines`,
  `.hairline-row`, `.icon`, `.lattice` (+ `--whisper/quiet/present/strong`), `.grain`,
  `.skip-link`, `.visually-hidden`, `.shader-band*`, `.hero-window`.

The lattice is applied through `mask-image` rather than `background-image` so its colour stays a
token. `.on-dark .lattice` turns it to `--paper` automatically.

---

## Facts - `src/data/site.ts`

**Never retype a phone number, address, EIN or external URL.** They all live in `site`, and
`labels` holds every recurring button string from `COPY.md`.

```ts
import { site, labels, epigraph, primaryNav, footerNav } from '../data/site';

site.phone.display   // "(301) 929-1441"    site.phone.href   // "tel:+13019291441"
site.email.display   // "info@ispmd.org"    site.venue.lines  // the IEC, as the VENUE
site.mail.lines      // the P.O. Box, mail only
site.nonprofit.ein   // "52-1989063"
site.donateUrl  site.enrollFormUrl  site.icsPath
```

ISP and the Islamic Education Center are separate 501(c)(3)s. ISP **meets at** the IEC; that
address is never "our address". The IEC's number never appears anywhere. ISP has no street
address at all. See the header comment in `site.ts`.

`src/data/schema.ts` builds the `EducationalOrganization` JSON-LD. Per §14.8 it goes on the
Contact page only: `<Base jsonLd={educationalOrganization(Astro.site.href)}>`.

---

## Components - `src/components/`

| Component | Notes |
|---|---|
| `Base.astro` (in `layouts/`) | `title`, `description`, `transparentHeader`, `jsonLd`, `bodyClass`, `ogImage`. Owns head, landmarks, skip link, duotone filter, grain, header state, mobile menu, motion init. |
| `Masthead.astro` | `preset`, `label`, `lines[]`, `dark`, `short`. The whole interior-page overture: shader band, CSS-gradient fallback, `<h1>`. |
| `Section.astro` | `ground` (`paper｜warm｜cool｜ink｜slate`), `rhythm` (`default｜lg｜sm`), `container`, `grid`. Dark grounds get `.on-dark` automatically. |
| `SectionHeader.astro` | `label`, `headline` or `lines[]`, `role`, `level`. Slot for the body beneath. |
| `Media.astro` | `slotId`, `sizes`, `priority`, `widths`, `class`. The only thing that renders media. |
| `Button.astro` | `href`, `variant`, `icon`, `external`, `download`. |
| `Icon.astro` | The six icons in §7.9. No others exist. |
| `Card.astro` | The one card. Never three-up, never an icon in a circle. |
| `HairlineList` + `HairlineRow` | The site's dominant list form. `marker`, `title`, `titleRole`, `meta`, `href`, `muted`. |
| `Accordion` + `AccordionItem` | `question`, `id`, `open`. First item open on load. |
| `Divider.astro` | Replaces every horizontal rule. |
| `Epigraph.astro` | 20:114, `align` = `start｜end｜center`. The Arabic string is never retyped. |
| `MilestoneCard.astro` | `date`, `title`, `slotId`, `href`. |
| `calendar/CalendarBand` | `sessions`, `variant` (`strip｜grid`), `affordance`, `legend`. |
| `calendar/CalendarCell` | `session`, `next`. |
| `calendar/CalendarLegend` | Colour never carries meaning alone. |
| `calendar/NextClass` | The client island. All three states from `COPY.md`; the ended state is the server-rendered default so a failed fetch leaves a true message. |

---

## Data and scripts

- `src/data/calendar.ts` - `getCalendarYear()` is the ONLY way to read the collection. It carries
  the non-empty assertion that turns a silently empty collection into a build failure.
- `src/scripts/next-class.ts` - `resolveNextClass`, `formatSessionDate`, `cellParts`. Timezone
  handling is done once, here, in `America/New_York`.
- `src/scripts/motion.ts` - GSAP, ScrollTrigger, SplitText, DrawSVG and Lenis, registered once.
  Add `data-motion="line-rise|body-rise|tile-in"` to an element and it is wired automatically.
  Group tiles under `[data-stagger-vector]` so the 36° ordering is per grid.
- `src/scripts/webgl.ts` - `mountField(canvas, { preset })`, all ten §13.3 presets, `detectTier()`,
  `cappedDpr()`. Do not write a second WebGL stack.
- `src/scripts/hero-field.ts` - the homepage only.
- `src/pages/ispmd-2026-27.ics.ts` and `src/pages/calendar.json.ts` - already built. Link the
  `.ics` with `site.icsPath`.

---

## Media registry - `src/data/media/`

`index.ts` is **frozen**. Add slots to `home.ts`, `calendar.ts` or `content.ts` - whichever your
pages own - and they appear automatically. All twenty §15 slots are already seeded with a
committed placeholder, so nothing here should block you.

`alt` describes the file rendered **today**. The intended photograph lives in `realAlt` until
the swap. Never write alt text that claims a placeholder is a photograph of this school.

Sourcing new placeholders is not your job. If a slot needs a different shape, change its `ratio`
and let the page reflow - that is a one-field edit and often the right answer.

---

## Things that will break the design

Short version of §17, plus what Phase 1 hit in practice:

- Inventing a colour, size, duration or radius. Every value is in §1.
- A three-up card grid. Banned in 4.1, 7.5 and 12.4. Break the rhythm with a deliberate gap.
- `--amber` as text on a light ground. Use `--text-amber`.
- Centring display type. It happens exactly twice site-wide and both are already spent.
- Implementing reduced motion in CSS only. It must be checked in JS and it changes
  `uConstruction`.
- Publishing the wrong phone number or any street address for ISP.
