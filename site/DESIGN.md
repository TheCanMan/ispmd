# Islamic School of Potomac - Design System

This file is the implementation contract.
Where a value is given, use it verbatim.
Copy comes from `COPY.md`, verbatim; implementers do not write user-facing prose.

**The concept, in one line:** the site is one continuous girih field - always cropped, never closed - because knowledge is a prayer for more, and because a pattern this size needs every tile: the child, the parent, the volunteer.

Full rationale is in section 12.
Sections 1 through 7 are the load-bearing part.
If you read only the first third of this file you should still be able to build a coherent page.

**Three rules that govern every decision below.**

1. **Geometry is structure, never ornament.** The pattern is the grid, the light, the mask, the divider, the loading state. It is never a decorative flourish laid over finished work.
2. **The frame crops; the pattern continues.** Every appearance of the lattice is cut by an edge. Nothing is ever presented as a complete, centred medallion. This single rule is what separates this site from souvenir Islamic design.
3. **Warmth carries the voice; restraint carries the credibility.** Paper and ink hold roughly 85% of every screen. Colour lives in the geometry, in the calendar, and in one accent per viewport.

---

## 1. Tokens

Paste this block into `src/styles/global.css` as-is.
**No colour, size, duration, easing, radius or z-index may be used anywhere in the site that is not in this block.**
If you need a value that is not here, you have found a gap in the design - do not invent one; use the nearest token.

Every colour is sampled from the school's own 2026-2027 calendar graphic (`research/calendar-2026-2027.png`) or derived from it for contrast compliance.
Nothing is imported from outside their palette.

```css
:root {
  color-scheme: light;

  /* ==========================================================
     1.1  COLOUR - GROUNDS
     ========================================================== */
  --paper:            #FBF8F2;   /* default page ground */
  --paper-warm:       #F6E7D7;   /* alternating warm section ground */
  --paper-cool:       #E4EBE6;   /* alternating cool section ground */
  --vellum:           #F4E1CE;   /* cards and insets on warm grounds */

  --ink:              #281E14;   /* warm bistre - primary dark ground */
  --ink-raised:       #35291C;   /* cards sitting on --ink */
  --slate-deep:       #22394B;   /* secondary dark ground */
  --slate-raised:     #2C4759;   /* cards sitting on --slate-deep */

  /* ==========================================================
     1.2  COLOUR - TEXT ON LIGHT GROUNDS
     ========================================================== */
  --text:             #281E14;   /* 15.4:1 on --paper */
  --text-soft:        #5A4A3A;   /*  8.0:1 on --paper */
  --text-faint:       #7A6857;   /*  5.0:1 on --paper */
  --text-link:        #3C6482;   /*  5.9:1 on --paper */
  --text-link-warm:   #8F4A16;   /*  6.3:1 on --paper */
  --text-amber:       #8A5D12;   /*  5.4:1 on --paper - the only amber-family text colour */

  /* ==========================================================
     1.3  COLOUR - TEXT ON DARK GROUNDS
     ========================================================== */
  --text-on-dark:        #FBF8F2; /* 15.4:1 on --ink | 11.3:1 on --slate-deep */
  --text-on-dark-soft:   #C9BCAB; /*  8.8:1 on --ink |  6.4:1 on --slate-deep */
  --text-on-dark-faint:  #A99A86; /*  6.0:1 on --ink |  4.4:1 on --slate-deep - >=19px only */
  --link-on-dark:        #E8B05A; /*  8.4:1 on --ink |  6.2:1 on --slate-deep */
  --link-on-dark-cool:   #7FA6BF; /*  6.3:1 on --ink |  4.6:1 on --slate-deep */

  /* ==========================================================
     1.4  COLOUR - ACCENTS
     Sienna is the school's Semester 1 colour. Slate is their Semester 2
     colour. Amber is their milestone colour. Honour those meanings.
     ========================================================== */
  --sienna:           #A85A1E;   /* 4.8:1 on --paper - text >=16px, fills, rules */
  --sienna-ink:       #8F4A16;   /* body-size sienna text and links */
  --sienna-bright:    #C87A3A;   /* hover; text on --ink only, never on --slate-deep */
  --slate:            #3C6482;
  --slate-light:      #7FA6BF;
  --amber:            #E8B05A;   /* FILL ONLY on light grounds. Text on dark grounds. */
  --amber-deep:       #C98F35;   /* fill / rule only, never text */

  /* ==========================================================
     1.5  COLOUR - FILLS
     These are NEVER text colours on a light ground.
     --text (#281E14) on any of them clears 8:1 - use it for labels inside cells.
     ========================================================== */
  --fill-apricot:     #E8B282;   /* class Sundays (their colour) */
  --fill-sage:        #B0D194;   /* no-school Sundays (their colour) */
  --fill-sky:         #B9DEE4;   /* Semester 2 cells (their colour) */
  --fill-amber:       #E8B05A;   /* milestone Sundays (their colour) */
  --fill-mist:        #DCE5E0;   /* their tessellation ground */

  /* ==========================================================
     1.6  COLOUR - RULES, TINTS, STATES
     ========================================================== */
  --rule:                 rgba(40, 30, 20, 0.14);
  --rule-strong:          rgba(40, 30, 20, 0.28);
  --rule-faint:           rgba(40, 30, 20, 0.07);
  --rule-accent:          rgba(168, 90, 30, 0.42);
  --rule-on-dark:         rgba(251, 248, 242, 0.16);
  --rule-on-dark-strong:  rgba(251, 248, 242, 0.34);

  --tint-sienna:      rgba(168, 90, 30, 0.08);
  --tint-slate:       rgba(60, 100, 130, 0.08);
  --tint-amber:       rgba(232, 176, 90, 0.14);
  --tint-sage:        rgba(176, 209, 148, 0.20);
  --tint-ink:         rgba(40, 30, 20, 0.05);
  --tint-paper:       rgba(251, 248, 242, 0.07);

  --state-ok:         #4E7B4A;   /* 4.7:1 on --paper */
  --state-warn:       #8A5D12;   /* 5.4:1 on --paper */
  --state-error:      #9B3218;   /* 6.9:1 on --paper */

  /* ==========================================================
     1.7  COLOUR - SHADOW
     Shadows are ink-tinted. A black shadow on warm paper reads dirty.
     ========================================================== */
  --shadow-sm:        0 1px 2px rgba(40, 30, 20, 0.06);
  --shadow-md:        0 6px 20px -8px rgba(40, 30, 20, 0.14);
  --shadow-lg:        0 24px 60px -24px rgba(40, 30, 20, 0.22);
  --shadow-glow:      0 0 48px -8px rgba(232, 176, 90, 0.45);

  /* ==========================================================
     2.1  TYPE - FAMILIES
     ========================================================== */
  --font-display: "Bricolage Grotesque", "Bricolage Fallback", "Helvetica Neue", Arial, sans-serif;
  --font-text:    "Literata", "Literata Fallback", Georgia, "Times New Roman", serif;
  --font-mono:    "DM Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-kufi:    "Reem Kufi", "Noto Naskh Arabic", serif;   /* Arabic display */
  --font-naskh:   "Amiri", "Noto Naskh Arabic", serif;       /* Arabic running text */

  /* ==========================================================
     2.2  TYPE - VARIABLE AXIS SETTINGS
     Use as: font-variation-settings: var(--vf-hero);
     ========================================================== */
  --vf-mega:      "wght" 400, "wdth" 78, "opsz" 96;
  --vf-hero:      "wght" 500, "wdth" 82, "opsz" 96;
  --vf-display:   "wght" 500, "wdth" 86, "opsz" 72;
  --vf-title:     "wght" 600, "wdth" 92, "opsz" 36;
  --vf-subtitle:  "wght" 600, "wdth" 96, "opsz" 24;
  --vf-ui:        "wght" 500, "wdth" 100, "opsz" 14;
  --vf-ui-strong: "wght" 650, "wdth" 100, "opsz" 14;
  --vf-text:      "opsz" 16;                 /* Literata body */
  --vf-text-lg:   "opsz" 28;                 /* Literata lead */
  --vf-kufi:      "wght" 500;

  /* ==========================================================
     2.3  TYPE - SIZE
     Fluid between 360px and 1600px viewport.
     ========================================================== */
  --fs-mega:      clamp(4rem,      0.5rem  + 15.50vw, 16rem);      /*  64 -> 256 */
  --fs-hero:      clamp(3.25rem,   1rem    + 10.00vw, 11rem);      /*  52 -> 176 */
  --fs-display:   clamp(2.5rem,    1.15rem +  6.00vw, 6.5rem);     /*  40 -> 104 */
  --fs-title:     clamp(1.75rem,   1.20rem +  2.44vw, 3.25rem);    /*  28 ->  52 */
  --fs-subtitle:  clamp(1.375rem,  1.10rem +  1.22vw, 2rem);       /*  22 ->  32 */
  --fs-lead:      clamp(1.1875rem, 1.06rem +  0.56vw, 1.5rem);     /*  19 ->  24 */
  --fs-body:      clamp(1.0625rem, 1.02rem +  0.19vw, 1.1875rem);  /*  17 ->  19 */
  --fs-small:     clamp(0.9375rem, 0.92rem +  0.09vw, 1rem);       /*  15 ->  16 */
  --fs-label:     0.8125rem;                                       /*  13 */
  --fs-label-lg:  0.9375rem;                                       /*  15 */
  --fs-arabic:    clamp(1.5rem,    1.05rem +  2.00vw, 2.75rem);    /*  24 ->  44 */

  /* ==========================================================
     2.4  TYPE - LINE HEIGHT
     ========================================================== */
  --lh-mega:      0.86;
  --lh-hero:      0.92;
  --lh-display:   0.98;
  --lh-title:     1.06;
  --lh-subtitle:  1.18;
  --lh-lead:      1.45;
  --lh-body:      1.62;
  --lh-small:     1.50;
  --lh-label:     1.20;
  --lh-arabic:    1.85;   /* Arabic needs more leading than Latin */

  /* ==========================================================
     2.5  TYPE - TRACKING
     ========================================================== */
  --tr-mega:      -0.045em;
  --tr-hero:      -0.035em;
  --tr-display:   -0.028em;
  --tr-title:     -0.018em;
  --tr-subtitle:  -0.012em;
  --tr-lead:      -0.004em;
  --tr-body:       0em;
  --tr-small:      0.005em;
  --tr-label:      0.14em;   /* mono, uppercase */
  --tr-arabic:     0em;      /* NEVER letter-space Arabic - it breaks the joins */

  /* ==========================================================
     3  SPACE  (8px base, 4px sub-unit)
     ========================================================== */
  --s-1:   4px;
  --s-2:   8px;
  --s-3:  12px;
  --s-4:  16px;
  --s-5:  24px;
  --s-6:  32px;
  --s-7:  48px;
  --s-8:  64px;
  --s-9:  96px;
  --s-10: 128px;
  --s-11: 176px;
  --s-12: 240px;

  --section-y:     clamp(72px,  9vw, 176px);   /* standard section padding-block */
  --section-y-lg:  clamp(112px, 13vw, 240px);  /* set-piece sections */
  --section-y-sm:  clamp(48px,  5vw, 88px);    /* dense / list sections */

  /* ==========================================================
     4  LAYOUT
     The page grid is TEN columns. Five-fold symmetry is the system
     the pattern is built on; ten is its natural division.
     Consequence: thirds are not available on the page grid. That is
     deliberate - it forces asymmetry. Component-internal grids are free.
     ========================================================== */
  --container:         1440px;
  --container-narrow:   760px;   /* long-form measure container */
  --container-wide:    1760px;   /* full-bleed-with-margin bands */
  --gutter:            clamp(20px, 4.4vw, 72px);
  --grid-cols:         10;
  --grid-gap:          clamp(16px, 2vw, 32px);
  --measure:           62ch;     /* body copy max width */
  --measure-lead:      46ch;     /* lead paragraph max width */
  --measure-display:   17ch;     /* display headline max width */

  /* Breakpoints - DOCUMENTATION ONLY.
     Custom properties cannot be used in @media. Write these literally. */
  --bp-xs:  360px;
  --bp-sm:  600px;
  --bp-md:  768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl:1600px;

  /* ==========================================================
     5  SHAPE
     The pattern is angular. Pills and large radii fight it.
     ========================================================== */
  --radius-xs:    2px;
  --radius-sm:    4px;    /* buttons, inputs, photo frames */
  --radius-md:   10px;    /* cards, panels */
  --radius-lg:   16px;    /* only the JotForm frame */
  --radius-full: 999px;   /* ONLY the calendar "today" dot and status pips */

  --border-hair:  1px;
  --border-thin:  1.5px;
  --border-thick: 2px;

  /* ==========================================================
     6  MOTION
     ========================================================== */
  --dur-instant: 0.12s;
  --dur-fast:    0.22s;
  --dur-base:    0.32s;
  --dur-slow:    0.62s;
  --dur-reveal:  0.90s;   /* standard entrance */
  --dur-draw:    1.90s;   /* the pattern drawing itself */

  --ease-out:      cubic-bezier(0.16, 1, 0.30, 1);   /* default; expo-out */
  --ease-entrance: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);   /* scrubbed / pinned */
  --ease-exit:     cubic-bezier(0.40, 0, 1, 1);

  --stagger:       0.055s;   /* between siblings */
  --stagger-slow:  0.090s;   /* between large blocks */
  --rise:          24px;     /* standard entrance translate-Y */
  --rise-sm:       12px;
  --lenis-lerp:    0.085;    /* documentation - pass to Lenis in JS */

  /* ==========================================================
     7  DEPTH
     ========================================================== */
  --z-base:     0;
  --z-media:    1;
  --z-content:  2;
  --z-raised:  10;
  --z-sticky:  50;
  --z-header: 100;
  --z-overlay:200;
  --z-modal:  300;
  --z-grain: 9000;

  /* ==========================================================
     8  MEDIA
     Aspect ratio is declared by the SLOT, never by the file.
     These five are the only ratios in the site.
     ========================================================== */
  --ratio-window: 16 / 9;   /* the hero montage aperture */
  --ratio-band:   21 / 9;   /* full-bleed bands - max twice site-wide */
  --ratio-land:    5 / 4;
  --ratio-port:    4 / 5;   /* the dominant editorial ratio */
  --ratio-square:  1 / 1;

  /* ==========================================================
     9  PATTERN AND SURFACE
     ========================================================== */
  --pattern-whisper: 0.05;
  --pattern-quiet:   0.10;
  --pattern-present: 0.18;
  --pattern-strong:  0.34;
  --pattern-scale:   380px;   /* rendered width of one girih repeat tile */
  --pattern-scale-lg: 620px;
  --grain-opacity:   0.045;
  --grain-tile:      180px;

  /* ==========================================================
     10  FOCUS
     ========================================================== */
  --focus-color:         #3C6482;   /* --slate, 5.9:1 on --paper */
  --focus-color-on-dark: #E8B05A;   /* --amber, 8.4:1 on --ink */
  --focus-width:  2px;
  --focus-offset: 3px;
}
```

---

## 2. Fonts

Five families. All from the Google Fonts catalogue, so all are obtainable through Fontsource with `npm install`, then copied into `public/fonts/` as self-hosted woff2.
**No font CDN. No `<link>` to fonts.googleapis.com.**

### 2.1 Acquisition

```bash
npm i -D @fontsource-variable/bricolage-grotesque \
         @fontsource-variable/literata \
         @fontsource-variable/reem-kufi \
         @fontsource/dm-mono \
         @fontsource/amiri
```

Copy exactly these six files into `site/public/fonts/`, renaming as shown.
Take the **latin** subset for the three Latin faces and the **arabic** subset for the two Arabic faces.

| Source (inside `node_modules/.../files/`) | Rename to |
|---|---|
| `bricolage-grotesque-latin-full-normal.woff2` | `bricolage-grotesque-var.woff2` |
| `literata-latin-wght-normal.woff2` | `literata-var.woff2` |
| `literata-latin-wght-italic.woff2` | `literata-italic-var.woff2` |
| `dm-mono-latin-400-normal.woff2` | `dm-mono-400.woff2` |
| `reem-kufi-arabic-wght-normal.woff2` | `reem-kufi-var.woff2` |
| `amiri-arabic-400-normal.woff2` | `amiri-400.woff2` |

Fontsource file names change between versions.
If a name does not match, take the file whose name contains the same subset, axis and style, and rename it to the target above.
Do not substitute a different typeface.

### 2.2 `@font-face` block

Paste as-is, immediately above the `:root` block in `global.css`.

```css
@font-face {
  font-family: "Bricolage Grotesque";
  src: url("/fonts/bricolage-grotesque-var.woff2") format("woff2");
  font-weight: 200 800;
  font-stretch: 75% 100%;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Literata";
  src: url("/fonts/literata-var.woff2") format("woff2");
  font-weight: 200 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Literata";
  src: url("/fonts/literata-italic-var.woff2") format("woff2");
  font-weight: 200 900;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: "DM Mono";
  src: url("/fonts/dm-mono-400.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Arabic faces are fetched ONLY when Arabic codepoints are present on the page. */
@font-face {
  font-family: "Reem Kufi";
  src: url("/fonts/reem-kufi-var.woff2") format("woff2");
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
}
@font-face {
  font-family: "Amiri";
  src: url("/fonts/amiri-400.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
}

/* Metric-matched fallbacks. These stop the swap from shifting layout. */
@font-face {
  font-family: "Bricolage Fallback";
  src: local("Helvetica Neue"), local("Arial"), local("Liberation Sans");
  size-adjust: 97%;
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
}
@font-face {
  font-family: "Literata Fallback";
  src: local("Georgia"), local("Times New Roman"), local("Liberation Serif");
  size-adjust: 103%;
  ascent-override: 90%;
  descent-override: 24%;
  line-gap-override: 0%;
}
```

Preload exactly two files in `Base.astro` `<head>` - the two that render above the fold on every page:

```html
<link rel="preload" href="/fonts/bricolage-grotesque-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/literata-var.woff2" as="font" type="font/woff2" crossorigin>
```

Do not preload the Arabic faces or the italic.

### 2.3 Why these five

The Latin faces do the structural work and the Arabic faces do the calligraphic work.
That division is the point: the Arabic on this site is not Latin type wearing a costume, and it is not ornament pasted on. It carries a real typographic role that the Latin cannot.

| Face | Role | Why it |
|---|---|---|
| **Bricolage Grotesque** | Display, headlines, nav, buttons, all UI | It is an *optically sized* variable face: the same letter at 96pt is a different drawing than at 12pt. That is the mistara logic - a proportional system that re-derives the form at every scale - made into type. The width axis lets a headline be *fitted* to its measure the way a scribe fills a line. And it has genuine character without costume: confident and editorial at `wght 500 / wdth 82`, warm and plain at `wght 500 / wdth 100`. |
| **Literata** | All body copy, long-form, FAQ answers | Engineered for sustained screen reading, with a large x-height and open apertures. This site has to be readable by a 65-year-old grandparent on a phone in a car park. Literata is the least fashionable and most correct choice available, and its italic is genuinely lovely. |
| **DM Mono** | Dates, indices, eyebrows, tags, legal | The calendar is the most data-dense thing on the site and needs a voice that aligns and does not pretend to be prose. DM Mono is warm rather than technical. |
| **Reem Kufi** | Arabic display: `العربية`, `الدين`, section marks | Modern geometric Kufi, drawn by Khaled Hosny from Ottoman-era square Kufic. Square Kufic is *letters constructed on a grid* - the same discipline as the pattern behind them. It is the only Arabic face on the site that rhymes with the geometry. |
| **Amiri** | The Quranic epigraph, and only that | A Naskh revival of the Bulaq Press type. When a verse is set, it should be set in a face made for setting verses. Used in exactly two places site-wide. |

---

## 3. Type roles

Every piece of text on the site is one of these thirteen roles.
There are no other type treatments.

| Role | Family | Size | Weight / axes | Line height | Tracking | Case | Colour |
|---|---|---|---|---|---|---|---|
| `.t-mega` | display | `--fs-mega` | `--vf-mega` | `--lh-mega` | `--tr-mega` | sentence | context |
| `.t-hero` | display | `--fs-hero` | `--vf-hero` | `--lh-hero` | `--tr-hero` | sentence | context |
| `.t-display` | display | `--fs-display` | `--vf-display` | `--lh-display` | `--tr-display` | sentence | `--text` |
| `.t-title` | display | `--fs-title` | `--vf-title` | `--lh-title` | `--tr-title` | sentence | `--text` |
| `.t-subtitle` | display | `--fs-subtitle` | `--vf-subtitle` | `--lh-subtitle` | `--tr-subtitle` | sentence | `--text` |
| `.t-lead` | text | `--fs-lead` | `--vf-text-lg` | `--lh-lead` | `--tr-lead` | sentence | `--text-soft` |
| `.t-body` | text | `--fs-body` | `--vf-text` | `--lh-body` | `--tr-body` | sentence | `--text-soft` |
| `.t-small` | text | `--fs-small` | `--vf-text` | `--lh-small` | `--tr-small` | sentence | `--text-faint` |
| `.t-label` | mono | `--fs-label` | 400 | `--lh-label` | `--tr-label` | UPPERCASE | `--text-faint` |
| `.t-label-lg` | mono | `--fs-label-lg` | 400 | `--lh-label` | `--tr-label` | UPPERCASE | `--text-faint` |
| `.t-ui` | display | `--fs-small` | `--vf-ui` | 1.2 | 0.01em | sentence | context |
| `.t-arabic` | naskh | `--fs-arabic` | 400 | `--lh-arabic` | `--tr-arabic` | n/a | context |
| `.t-arabic-kufi` | kufi | `--fs-subtitle` | `--vf-kufi` | 1.4 | `--tr-arabic` | n/a | context |

**Headline colour.** Headlines are `--text` (or `--text-on-dark`). They are not sienna, not slate, not amber.
Colour in a headline is reserved for **one word or one mark per page, maximum** - and on the homepage that mark is already spent (see 12.3).

**Italic.** Literata italic is the site's emphasis voice: quoted lines from the school, the epigraph translation, and the single emphasised word in a lead paragraph. Bricolage has no italic; never synthesise one.

**Body colour.** Long-form body text is `--text-soft`, not `--text`. Full-strength ink at 19px over 60 characters is heavier than it needs to be. `--text` is for headlines, labels on fills, and short emphatic lines.

**Numbers.** Any number a reader might compare to another number (dates, dollar amounts, ages, counts) is set in `--font-mono`. Numbers inside running prose stay in Literata.

**Arabic mechanics.**

- Every Arabic element carries `lang="ar" dir="rtl"`.
- Never apply `letter-spacing` to Arabic; it breaks the joins.
- Never apply `text-transform`; it does nothing and signals carelessness.
- Arabic appears in exactly four places site-wide: the homepage epigraph, the footer epigraph, and the two program section marks (`العربية`, `الدين`). Nowhere else. `"...and in between"` gets no Arabic - it is the English one, and that is the joke.
- The epigraph string, to be copied verbatim and never retyped:

```
وَقُلْ رَبِّ زِدْنِي عِلْمًا
```

If this renders as tofu or with broken shaping in any browser, ship the English line alone rather than a broken one, and raise it.

---

## 4. Layout

### 4.1 The ten-column grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: var(--grid-gap);
}
.container       { width: 100%; max-width: var(--container);        margin-inline: auto; padding-inline: var(--gutter); }
.container-narrow{ width: 100%; max-width: var(--container-narrow); margin-inline: auto; padding-inline: var(--gutter); }
.container-wide  { width: 100%; max-width: var(--container-wide);   margin-inline: auto; padding-inline: var(--gutter); }
```

Ten columns at every breakpoint.
Below 768px almost every span becomes `1 / -1`; the grid stays ten so the maths never changes.
Every page spec in section 14 gives explicit spans per breakpoint. Do not improvise spans.

Thirds are not available. That is deliberate.
When content comes in threes - and it does, three times on this site - it is sequenced vertically or split asymmetrically, never laid out as three equal cards.
**There are no three-up card grids anywhere on this site.**

### 4.2 Section rhythm

Sections alternate ground colour on a fixed cycle so the page has a pulse without anyone deciding case by case:

`--paper` → `--paper-warm` → `--paper` → *dark* → `--paper` → `--paper-cool` → `--paper` → *dark footer*

- Standard section: `padding-block: var(--section-y)`.
- Set-piece section (the ones named in section 13): `--section-y-lg`.
- List or dense section (calendar tables, FAQ list): `--section-y-sm`.
- **At most two dark sections per page**, footer included.
- Never place two coloured grounds adjacent without a `--paper` section between them.

### 4.3 Section dividers

The divider is the site's smallest expression of the concept and it replaces every horizontal rule.

A 1px `--rule` line runs the full container width.
At its left end, over the first 140px, the line **resolves into three cells of the girih lattice** - the strapwork briefly becomes visible, then relaxes back into a plain hairline.
Ship as one SVG, `divider.svg`, 1000 x 40 viewBox, stroke `currentColor`, and scale it so the lattice portion is 140px at all breakpoints (`width: 100%; height: 40px; --divider-detail: 140px`).

On scroll into view, the lattice draws left-to-right over `--dur-reveal` with `--ease-out`; the plain rule scales from `scaleX(0)` with origin left over the same duration.

### 4.4 Vertical measure and prose

- Long-form prose sits in `.container-narrow`, `max-width: var(--measure)`.
- Paragraph spacing: `margin-block-start: var(--s-5)`.
- Headline-to-body gap: `var(--s-5)`. Section-label-to-headline gap: `var(--s-3)`.
- First paragraph after a `.t-display` may be `.t-lead`; there is never more than one lead per section.

### 4.5 Edges

Full-bleed elements bleed to the viewport edge on **one** side only, never both, and never centred.
The rule that makes this look intentional rather than broken: a full-bleed element always aligns its inner edge to a grid column line, so the composition still reads as gridded.

---

## 5. Motion

Stack: Lenis smooth scroll + GSAP with ScrollTrigger, SplitText and DrawSVG.
Register once in a shared module.

### 5.1 Global rules

- Lenis: `{ lerp: 0.085, smoothWheel: true, syncTouch: false }`.
- Transform and opacity only. Never animate `width`, `height`, `top`, `left`, `margin`, `filter` on scroll.
- Nothing bounces. Nothing spins. Nothing overshoots. Things **propagate** - they arrive as the next cell of a pattern.
- Default entrance: `--dur-reveal` with `--ease-out`, staggered by `--stagger`.
- One orchestrated moment per section. If two things want to be the moment, one of them is decoration.
- Every hover effect is inside `@media (hover: hover) and (pointer: fine)`. Touch gets the end state immediately.
- ScrollTrigger defaults: `start: "top 78%"`, `once: true` for entrances; `scrub: 0.6` for pinned or parallax work.

### 5.2 The four named entrance patterns

These four cover every animated element on the site. Nothing else is invented.

**A. `line-rise`** - all display and title text.
SplitText into lines, each line inside `overflow: hidden`.
`yPercent: 108 → 0`, `rotate: 1.4deg → 0`, `--dur-reveal`, `--ease-out`, stagger `--stagger`.
The slight rotation is the tell that makes it read as *settling* rather than sliding.

**B. `body-rise`** - paragraphs, buttons, small blocks.
`y: var(--rise) → 0`, `opacity: 0 → 1`, `--dur-reveal`, `--ease-entrance`, stagger `--stagger`.

**C. `tile-in`** - anything in a grid: calendar cells, FAQ rows, milestone cards, nav overlay links.
`scale: 0.94 → 1`, `opacity: 0 → 1`, `--dur-base`, `--ease-out`.
The stagger is **ordered along a 36-degree vector**, not row-major:

```js
const origin = { x: 0, y: 0 };                 // top-left of the grid
const a = 36 * Math.PI / 180;
const dir = { x: Math.cos(a), y: Math.sin(a) };
// sort targets by dot(elementCentre - origin, dir), then stagger by --stagger
```

The grid fills diagonally, at the pattern's own angle. It is a small thing and it is the difference between a grid animation and *this site's* grid animation.

**D. `strap-draw`** - dividers, underlines, the rosette in the homework moment, the SVG lattice in the footer.
DrawSVG `0% → 100%`, `--dur-draw`, `--ease-out`, ordered by each path's distance from a declared origin point so the pattern grows outward rather than left-to-right.

### 5.3 Links and controls

- **Inline prose link:** `--text-link`, 1px underline at `--rule-strong`, `text-underline-offset: 0.18em`. On hover the underline goes to `--text-link` and thickens to 1.5px over `--dur-fast`.
- **Nav and editorial index link:** no underline at rest. On hover a 1.5px rule draws from left over `--dur-base`, and at its right end **kicks up 36 degrees for 6px** - the turn of an interlace. Implement as a two-segment inline SVG (`M0,0 H100` then `L104.85,-3.53`) with DrawSVG, or as a `::after` plus a rotated `::before` of fixed 6px width. Never on inline prose links; it is a wayfinding signal.
- **Buttons:** the fill slides up from the bottom edge, `--dur-base`, `--ease-out`, text colour crossfading at the same time. No scale, no shadow change.
- **Focus:** `outline: var(--focus-width) solid var(--focus-color); outline-offset: var(--focus-offset);` and `--focus-color-on-dark` inside `.on-dark`. Focus is never removed and never animated.
- **Magnetic cursor effects: no.** They break keyboard parity and read as demo.

### 5.4 Reduced motion is a second design, not a fallback

`prefers-reduced-motion: reduce` produces a genuinely different and arguably more beautiful version of this site: **the pattern is already complete, and its construction is visible.**

| | Motion | Reduced motion |
|---|---|---|
| Lenis | on, lerp 0.085 | destroyed; native scroll |
| GSAP entrances | animate | `timeline.progress(1)` - end state set, never skipped |
| WebGL | animation loop | exactly one frame at `uTime = 3.7`, then `renderer.setAnimationLoop(null)` |
| `uConstruction` uniform | preset value (0.2 - 0.4) | **1.0 on every surface** |
| Hero construction hairlines | fade out after the draw | **stay visible permanently** |
| Transitions | as specified | `--dur-instant` (0.12s), not 0 - state changes must stay legible |
| Grain overlay | present | present |
| Parallax, pinning, scrub | on | off; pinned sections become ordinary stacked sections |

Raising `uConstruction` to 1.0 exposes the thin compass arcs and radii that generated the pattern.
The still site becomes a diagram of itself.

Both the CSS floor **and** the JS must check:

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Check it at init and re-check on `change`. A CSS-only implementation is not acceptable.

---

## 6. Colour rules

### 6.1 The three meanings the school already assigned

Their calendar graphic gave three colours a job. The site honours all three, everywhere, without exception.

| Colour | Their meaning | Site meaning |
|---|---|---|
| `--sienna` `#A85A1E` | Semester 1 header | Beginnings, arrival, enrolment, the warm half of the year |
| `--slate` `#3C6482` | Semester 2 header | Return, depth, structure, logistics, the cool half of the year |
| `--amber` `#E8B05A` | Milestone days | Celebration. The three named events. Exactly one amber mark per page. |

`--fill-apricot`, `--fill-sage`, `--fill-sky` keep their calendar meanings literally: class, no school, Semester 2.
Do not use them decoratively elsewhere.

### 6.2 Text colour is not a free choice

| Ground | Body text | Secondary | Meta / labels | Link |
|---|---|---|---|---|
| `--paper` / `--paper-warm` / `--paper-cool` / `--vellum` | `--text-soft` | `--text-faint` | `--text-faint` | `--text-link` |
| `--ink` | `--text-on-dark-soft` | `--text-on-dark-faint` (>=19px) | `--text-on-dark-faint` | `--link-on-dark` |
| `--slate-deep` | `--text-on-dark-soft` | `--text-on-dark-soft` | `--text-on-dark-soft` | `--link-on-dark` |
| `--fill-apricot` / `--fill-sage` / `--fill-sky` / `--fill-amber` | `--text` | `--text` | `--text` | `--text` underlined |

**Hard prohibitions.** These are the four ways an implementer will accidentally break AA:

1. `--amber` and `--amber-deep` are never text on a light ground. Use `--text-amber` (`#8A5D12`).
2. `--fill-*` colours are never text on any ground.
3. `--sienna-bright` is never text on `--slate-deep`.
4. `--text-on-dark-faint` is never below 19px on `--slate-deep`.

### 6.3 Verified contrast

Every combination the site actually uses, computed:

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `--text` `#281E14` | `--paper` `#FBF8F2` | 15.4:1 | AAA |
| `--text-soft` `#5A4A3A` | `--paper` | 8.0:1 | AAA |
| `--text-faint` `#7A6857` | `--paper` | 5.0:1 | AA |
| `--text-link` `#3C6482` | `--paper` | 5.9:1 | AA |
| `--text-link-warm` `#8F4A16` | `--paper` | 6.3:1 | AA |
| `--text-amber` `#8A5D12` | `--paper` | 5.4:1 | AA |
| `--sienna` `#A85A1E` | `--paper` | 4.8:1 | AA (>=16px) |
| `--state-error` `#9B3218` | `--paper` | 6.9:1 | AA |
| `--state-ok` `#4E7B4A` | `--paper` | 4.7:1 | AA |
| `--text-on-dark` `#FBF8F2` | `--ink` `#281E14` | 15.4:1 | AAA |
| `--text-on-dark-soft` `#C9BCAB` | `--ink` | 8.8:1 | AAA |
| `--text-on-dark-faint` `#A99A86` | `--ink` | 6.0:1 | AA |
| `--link-on-dark` `#E8B05A` | `--ink` | 8.4:1 | AAA |
| `--link-on-dark-cool` `#7FA6BF` | `--ink` | 6.3:1 | AA |
| `--sienna-bright` `#C87A3A` | `--ink` | 4.9:1 | AA |
| `--text-on-dark` | `--slate-deep` `#22394B` | 11.3:1 | AAA |
| `--text-on-dark-soft` | `--slate-deep` | 6.4:1 | AA |
| `--link-on-dark` | `--slate-deep` | 6.2:1 | AA |
| `--text` `#281E14` | `--fill-apricot` `#E8B282` | 8.7:1 | AAA |
| `--text` | `--fill-sage` `#B0D194` | 9.6:1 | AAA |
| `--text` | `--fill-sky` `#B9DEE4` | 11.4:1 | AAA |
| `--text` | `--fill-amber` `#E8B05A` | 8.4:1 | AAA |
| `--focus-color` `#3C6482` | `--paper` | 5.9:1 | passes 3:1 non-text |
| `--focus-color-on-dark` `#E8B05A` | `--ink` | 8.4:1 | passes 3:1 non-text |

### 6.4 Surface treatment

**Grain.** One page-level overlay, not per element. It kills digital flatness and makes stock photography read as printed.

```css
.grain {
  position: fixed;
  inset: 0;
  z-index: var(--z-grain);
  pointer-events: none;
  opacity: var(--grain-opacity);
  background-image: url("/img/grain.png");    /* 180x180 transparent-black speckle */
  background-size: var(--grain-tile) var(--grain-tile);
}
```

No `mix-blend-mode` - blending a fixed layer over text muddies it.
Generate `grain.png` once at build with an `feTurbulence` render (`baseFrequency 0.9`, `numOctaves 3`, monochrome, alpha 0 to 0.5) or any equivalent noise; 180x180, under 6KB.
The 180px tile size is chosen to avoid moiré against the WebGL canvas.

**Never** pure `#FFF` or `#000` anywhere in the site, including SVG fills, canvas clears and `::selection`.

```css
::selection { background: var(--tint-amber); color: var(--text); }
```

---

## 7. Components

### 7.1 Header

Fixed. Transparent over the homepage hero; on every other page it sits on `--paper` from the start.
After 72px of scroll it gains `background: var(--paper)`, `border-bottom: 1px solid var(--rule)` and `backdrop-filter: blur(8px)`, transitioning over `--dur-base`. Toggle with a class, not a scroll-linked style write.

Height: 76px at >=1024px, 64px below.

**Left - the lockup.** The mark plus a two-line wordmark.

- Mark: a single `{10/3}` decagram (section 9.2), 28px, `stroke: var(--sienna)`, `stroke-width: 1.6`, no fill.
- Wordmark: `--font-display`, `--vf-ui-strong`, 15px / 1.05, `--text`, two lines: `Islamic School` / `of Potomac`. Sentence case, not uppercase.
- Gap between mark and wordmark: `var(--s-3)`.

**Right - navigation.** Five links plus one CTA at >=1024px:

`Our Story · Program · Calendar · FAQs · Give` then a `.btn-primary` reading `Enroll`.

Links: `.t-ui`, `--text`, gap `var(--s-6)`, hooked-underline hover (5.3).
Current page: the hooked underline is drawn and static, in `--sienna`.
Contact and Enroll are reachable from the footer, from inline copy, and from the mobile menu; they are not in the desktop bar.

**Below 1024px** the links collapse to a button labelled `Menu` (text, not a hamburger glyph alone - though a 3-line glyph may sit beside it).
The overlay is full-screen, `background: var(--ink)`, and contains all eight page links at `--fs-title` in `--text-on-dark`. Beneath a `--rule-on-dark` hairline it carries both contact channels as tap targets: `(301) 929-1441` as a `tel:` link and `info@ispmd.org` as a `mailto:` link, each at `--fs-subtitle` in `--link-on-dark`.

**The phone number is not in the desktop header.** Six items are already there, and a phone number in a desktop nav bar is the posture of an organisation with a receptionist. It earns its place on mobile - where a parent wondering whether class is on actually wants to tap it - in the footer, and on the Contact page.
Links `tile-in` with `--stagger-slow`.
Focus is trapped, `Esc` closes, the trigger regains focus on close, `body` gets `overflow: hidden`.

### 7.2 Footer

Ground `--ink`. `padding-block: var(--section-y)` with an extra `var(--s-9)` at the top for the lattice.

**The lattice.** The static girih tile (9.2) runs across the top 40% of the footer at `--pattern-strong` opacity in `--paper`, and **terminates mid-cell at the bottom of the visible area** - clipped, not faded. The pattern visibly continues past the edge. This is the site's closing statement and it is the only place the lattice is allowed to be large and quiet at the same time.

Grid, `.container`, 10 columns:

| Span (>=1024px) | Content |
|---|---|
| `1 / 5` | Wordmark lockup in `--text-on-dark`. Below it, two contact lines at `--fs-subtitle` in `--link-on-dark`, stacked with `var(--s-2)` between them: `(301) 929-1441` as a `tel:+13019291441` link, then `info@ispmd.org` as a `mailto:` link. Below those, the mailing address in `.t-small`, `--text-on-dark-soft`, with the words `Mail only` in `.t-label`. |
| `5 / 8` | Two link columns: `Our Story / Program / Calendar / FAQs` and `Enroll / Give / Contact`. `.t-ui`, `--text-on-dark-soft`. |
| `8 / 11` | `Islamic School of Potomac is a 501(c)(3) non-profit organization.` / `EIN 52-1989063` in `.t-label`. Below: a `.btn-ghost-on-dark` reading `Support the school`. Below that: `Instagram` and `Facebook` as text links. |

Below 768px: single column, in that order.

Bottom band, above a `--rule-on-dark` hairline, centred:
the Arabic epigraph in `.t-arabic` at `--text-on-dark-soft`, the English translation beneath in Literata italic `.t-small`, and the reference `20:114` in `.t-label`.

The footer carries both channels and no street address. ISP has no address of its own: the P.O. Box is mail only, and the building where class meets belongs to another organisation. See 14.8.

### 7.3 Buttons

All buttons: `--font-display`, `--vf-ui-strong`, `--fs-small`, `--radius-sm`, `padding: 14px 24px`, `border: 1px solid transparent`, `line-height: 1`, no text-transform.
Minimum hit target 44 x 44px including padding.

| Class | Rest | Hover | On dark |
|---|---|---|---|
| `.btn-primary` | bg `--sienna`, text `--paper` | fill slides up in `--ink` | bg `--amber`, text `--ink`; hover fill `--paper` |
| `.btn-ghost` | transparent, 1px `--rule-strong`, text `--text` | fill slides up in `--ink`, text `--paper` | border `--rule-on-dark-strong`, text `--text-on-dark`; hover fill `--paper`, text `--ink` |
| `.btn-quiet` | text `--text-link`, hooked underline | underline draws | text `--link-on-dark` |

The slide-up fill is a `::before` at `inset: 0`, `transform: translateY(101%) → 0`, `--dur-base`, `--ease-out`, with the label on `z-index: 1`.
There is at most **one `.btn-primary` per viewport**.

### 7.4 Photo frame

Every image and video renders through `Media.astro`. The frame is uniform:

```css
.media {
  position: relative;
  aspect-ratio: var(--slot-ratio);      /* set inline from the slot */
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--fill-mist);          /* the ground while loading */
}
.media > img, .media > video {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: var(--slot-focal);    /* set inline from the slot */
  display: block;
}
.media::after {                          /* the plate rule */
  content: ""; position: absolute; inset: 0;
  border: 1px solid rgba(40, 30, 20, 0.16);
  border-radius: inherit;
  pointer-events: none;
}
```

**Parallax.** Images scale to 1.08 and translate `yPercent: -6 → 6` on `scrub: 0.6`. Never more than that; heavy photo parallax reads as a template.

**Reveal.** On entrance, the image's grade animates from `saturate(0) contrast(1.1)` to its treatment value over `--dur-slow`. Colour arrives. This is the only `filter` animation permitted on the site, and only on entrance, never on scrub.

### 7.5 Card

There is one card. `background: var(--paper)` on warm/cool grounds, or `--vellum` on `--paper`; `border: 1px solid var(--rule)`; `--radius-md`; `padding: var(--s-6)`; `--shadow-sm`.
On dark grounds: `--ink-raised` or `--slate-raised`, border `--rule-on-dark`.
Hover (only if the card is a link): border to `--rule-accent`, `--shadow-md`, `translateY(-2px)`, `--dur-base`.

No card ever contains an icon in a coloured circle. No card ever sits in a three-up grid.

### 7.6 Accordion (FAQs)

Rows separated by `--rule` hairlines, no boxes, no shadows, full container-narrow width.
Trigger: `.t-subtitle`, `--text`, `padding-block: var(--s-5)`, full-width `<button>` inside an `<h3>`.
Indicator: a 16px plus sign, 1.5px strokes, butt caps, `--sienna`; on open the vertical stroke `scaleY(0)` over `--dur-base` - it becomes a minus, it does not rotate.
Panel: `.t-body`, height tweened with GSAP over `--dur-base`; `aria-expanded` on the button, `aria-controls`/`id` pairing, panel `hidden` when closed.
The first FAQ is open on load.

### 7.7 Calendar cell

The atom of the Calendar page and the homepage calendar band.

```
┌──────────────┐
│ SEP  .t-label │   month, mono, uppercase, --text at 70% opacity
│ 13            │   day, mono, --fs-subtitle, --text
│ Back to       │   title, .t-small, --text, max 2 lines
│ School Day    │
└──────────────┘
```

`aspect-ratio: 1/1` at >=768px, `auto` below. `padding: var(--s-4)`. `--radius-sm`. Border `1px solid rgba(40,30,20,0.10)`.

| Kind | Fill |
|---|---|
| `class` | `--fill-apricot` in Semester 1, `--fill-sky` in Semester 2 |
| `no-school` | `--fill-sage`, title in `--text` at 80% opacity |
| `milestone` | `--fill-amber`, plus a 2px `--sienna` left border |

The Semester 1 / Semester 2 fill split is the school's own encoding from their graphic. Keep it.

**Next class** cell: adds `outline: 2px solid var(--sienna); outline-offset: 3px;` and a `.t-label` ribbon above reading `NEXT CLASS`. Computed client-side against the visitor's clock, never at build time.

Ramadan classes carry a `.t-label` annotation `RAMADAN` at the cell's bottom edge, `--text-amber`.

### 7.8 Form controls

Only the Enroll page's JotForm frame and `mailto:` links exist. There is no site-owned form.
If any input is ever added, it uses: `--font-text`, `--fs-body`, `padding: 12px 14px`, `border: 1px solid var(--rule-strong)`, `--radius-sm`, `background: var(--paper)`, focus ring per section 10, `--state-error` for invalid with a text message, never colour alone.

### 7.9 Icons

No icon library. Six icons, all inline SVG, `stroke-width: 1.5`, `stroke-linecap: butt`, `stroke-linejoin: miter`, `fill: none`, `currentColor`, 20 x 20 viewBox.

Round caps are forbidden - they soften shapes that should agree with the strapwork.

| Icon | Drawing |
|---|---|
| `arrow-right` | Horizontal stroke `M2,10 H17`, chevron `M13.1,5.5 L18,10 L13.1,14.5`. The chevron half-angle is 36 degrees, not 45. |
| `arrow-down` | The same shape rotated 90 degrees. |
| `plus` | `M10,3 V17` and `M3,10 H17`. |
| `external` | `M7,3 H17 V13` plus `M17,3 L7,13`. |
| `download` | `arrow-down` plus a tray `M3,15 V17 H17 V15`. |
| `mail` | Rectangle `M2,5 H18 V15 H2 Z` plus flap `M2,5 L10,11 L18,5`. |

### 7.10 Skip link

First focusable element in `Base.astro`. Visually hidden until focused, then: fixed top-left, `--s-4` inset, `background: var(--ink)`, `color: var(--text-on-dark)`, `padding: 12px 20px`, `--radius-sm`, `z-index: var(--z-modal)`. Target `#main`.

---

## 8. Photography treatment system

**The problem this solves.** Today every photo is mediocre stock. Tomorrow they are real ISP photos, decent but not professional. The same treatment system has to make both look art-directed, and the swap has to be a data edit.

What makes stock read as stock is fixable in CSS: neutral or blue white balance, full-spectrum saturation, and over-sharpened local contrast. What is not fixable is composition - so the slot ratios are aggressive and opinionated, and the crops do the rest.

Five treatments. `treatment` on the slot selects a class; nothing else about the image is styled.

### 8.1 `ink-duotone`

Luminance mapped onto a two-point ramp from `--ink` to `--paper`, with warm midtones. Everything becomes a warm bistre photogravure. Use where the photo is a **texture, not a subject**: full-bleed bands, the hero poster, page mastheads.

Ship as an inline SVG filter in `Base.astro`:

```svg
<svg width="0" height="0" aria-hidden="true" focusable="false">
  <filter id="ink-duotone" color-interpolation-filters="sRGB">
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer>
      <feFuncR type="table" tableValues="0.157 0.60 0.984"/>
      <feFuncG type="table" tableValues="0.118 0.54 0.973"/>
      <feFuncB type="table" tableValues="0.078 0.44 0.949"/>
    </feComponentTransfer>
  </filter>
</svg>
```

```css
.tr-ink-duotone { filter: url(#ink-duotone) contrast(1.04); }
```

The endpoints are exactly `--ink` and `--paper` in 0-1 channel values. The midpoints are deliberately warm (R > G > B), which is what makes it read as ink on paper rather than as a grey photo.

### 8.2 `warm-grade` - the workhorse

Roughly 70% of the site's photography. Full colour, pulled onto the site's warm axis so a mixed stock set reads as one shoot.

```css
.tr-warm-grade { filter: saturate(0.82) contrast(1.06) brightness(1.02) sepia(0.12) hue-rotate(-6deg); }
.tr-warm-grade::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: var(--sienna); opacity: 0.08; mix-blend-mode: multiply;
}
.tr-warm-grade::after {   /* replaces the default plate rule for graded slots */
  content: ""; position: absolute; inset: 0; z-index: 2; pointer-events: none;
  background: var(--fill-sky); opacity: 0.06; mix-blend-mode: screen;
  border: 1px solid rgba(40, 30, 20, 0.16); border-radius: inherit;
}
```

The sienna multiply warms the midtones; the sky screen lifts the shadows toward blue.
Warm shadows plus cool highlights is a colour-grading cliché; warm midtones plus **cool shadows** is the film-print relationship, and it is why this looks graded rather than filtered.

### 8.3 `cool-grade`

The Semester 2 counterpart. Calendar, Give, Contact, and anything that should feel like the second half of the year.

```css
.tr-cool-grade { filter: saturate(0.78) contrast(1.05) brightness(1.01); }
.tr-cool-grade::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: var(--slate); opacity: 0.10; mix-blend-mode: multiply;
}
```

Same `::after` plate rule as 8.2, with `--fill-apricot` at 0.05 screen instead of sky.

### 8.4 `behind-screen`

The one treatment where the pattern touches photography. The photo sits **behind** the girih lattice, as if seen through a light screen.

```css
.tr-behind-screen { filter: saturate(0.80) contrast(1.08) brightness(0.98); }
.tr-behind-screen::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background-image: url("/img/girih-tile.svg");
  background-size: var(--pattern-scale) auto;
  background-repeat: repeat;
  opacity: 0.16;
  mix-blend-mode: soft-light;
}
.tr-behind-screen::after {
  content: ""; position: absolute; inset: 0; z-index: 2; pointer-events: none;
  box-shadow: inset 0 0 48px 12px rgba(40, 30, 20, 0.18);
  border: 1px solid rgba(40, 30, 20, 0.16); border-radius: inherit;
}
```

**Maximum one per page.** Used twice site-wide: `program.between` and `home.program.arabic`.
It is not a mask. The photo is never cut into a star shape - that is exactly the souvenir-shop move this site is built to avoid.

### 8.5 `raw`

No grade, no tint, plate rule only. Nothing uses it today. It exists so that a genuinely good future photograph can opt out of the system without an implementer inventing a mechanism.

### 8.6 Alt text under placeholders

While `status: 'placeholder'`, the file is not a photo of ISP, so the alt text must not claim it is.
Every `alt` in the registry (section 15) is written to be **true of both** the placeholder and the eventual real photo: it describes what is in the frame, not who is in it.
`Children seated around a low table, working` is fine. `ISP students in a Sunday morning Arabic class` is not, until `status: 'real'`.

Decorative or purely textural media (the hero band, the masthead textures) take `alt=""` and `role="presentation"`.

---

## 9. The pattern

### 9.1 Rules

1. The pattern is **always cropped by its container**. It never appears as a complete, centred medallion. The single exception is the 28px logo mark, which is a signature, not a composition.
2. The pattern is **never** placed over body copy. Behind headlines, behind photos, behind sections - never behind a paragraph.
3. Opacity comes from `--pattern-whisper | quiet | present | strong`. No other value.
4. The pattern is `--paper` on dark grounds and `--ink` on light grounds. It is never sienna, slate or amber, with one exception: the single amber cell in the homework moment (12.3).
5. One vector asset governs every flat appearance: `public/img/girih-tile.svg`. There is no second pattern file.

### 9.2 `girih-tile.svg` - exact construction

The unit is the **`{10/3}` decagram**: ten vertices on a circle, each joined to the vertex three steps away. It is a single closed path, it visits all ten vertices, and it self-intersects twenty times.

That last property is why it was chosen. A ten-pointed star drawn as an outline is clip-art. A decagram is an *interlace* - and interlace is a three-dimensional fact, which is what the hero set-piece is built to show (13.1).

**Vertices**, for radius `R` centred at the origin, `k = 0..9`, angle `36k` degrees, y downward:

| k | angle | x | y |
|---|---|---|---|
| 0 | 0 | `+1.00000 R` | `0` |
| 1 | 36 | `+0.80902 R` | `+0.58779 R` |
| 2 | 72 | `+0.30902 R` | `+0.95106 R` |
| 3 | 108 | `-0.30902 R` | `+0.95106 R` |
| 4 | 144 | `-0.80902 R` | `+0.58779 R` |
| 5 | 180 | `-1.00000 R` | `0` |
| 6 | 216 | `-0.80902 R` | `-0.58779 R` |
| 7 | 252 | `-0.30902 R` | `-0.95106 R` |
| 8 | 288 | `+0.30902 R` | `-0.95106 R` |
| 9 | 324 | `+0.80902 R` | `-0.58779 R` |

**Path order:** `0 → 3 → 6 → 9 → 2 → 5 → 8 → 1 → 4 → 7 → Z`.

**The repeat tile.** `viewBox="0 0 1000 951.06"`.

The tile's proportion is not a choice. Ten-fold symmetry cannot tile the plane periodically; the closest lattice on which decagrams meet tip-to-tip has period `2R` horizontally and `2R sin72°` vertically. So the repeat is `1 : sin 72°` = `1 : 0.95106`. The geometry set it, not taste.

| Element | Centre | R | Notes |
|---|---|---|---|
| Corner decagram x4 | `(0,0)`, `(1000,0)`, `(0,951.06)`, `(1000,951.06)` | `500` | Clipped by the viewBox. Meets its horizontal neighbour at `(500, 0)` and its vertical neighbour at `(±154.51, 475.53)`. |
| Centre decagram | `(500, 475.53)` | `180` | |

**Four connecting straps**, exact endpoints:

| Strap | From (corner decagram vertex) | To (centre decagram vertex) |
|---|---|---|
| A | `(404.51, 293.89)` - k=1 of `(0,0)` | `(354.38, 369.73)` - k=6 of centre |
| B | `(595.49, 293.89)` - k=4 of `(1000,0)` | `(645.62, 369.73)` - k=9 of centre |
| C | `(404.51, 657.17)` - k=9 of `(0,951.06)` | `(354.38, 581.33)` - k=4 of centre |
| D | `(595.49, 657.17)` - k=6 of `(1000,951.06)` | `(645.62, 581.33)` - k=1 of centre |

**Rendering:** `fill: none`, `stroke: currentColor`, `stroke-width: 9`, `stroke-linejoin: miter`, `stroke-miterlimit: 10`, `stroke-linecap: butt`.
No interlace in the flat asset - crossings are plain. Interlace exists only in the 3D hero, where it is real.

**Acceptance test.** Tile the SVG in a 1600 x 1600 box at `background-size: 400px auto`. Correct output: continuous strapwork with no visible seams at tile edges, decagram tips meeting exactly, and the small centre stars reading as a secondary rhythm. If you see gaps at the tile boundary, the viewBox height is wrong - it is 951.06, not 1000.

**Construction overlay.** Produce a second file, `girih-construction.svg`, identical to the above plus: the circumscribing circle of every decagram, and the ten radii of the centre decagram, at `stroke-width: 3`, in a `<g id="construction">`. This is the layer that becomes permanently visible under `prefers-reduced-motion` (5.4).

### 9.3 Where the pattern appears

| Surface | Asset | Opacity | Colour |
|---|---|---|---|
| Homepage hero | 3D extruded ribbons (13.1) | n/a | `--paper` lit |
| Interior page mastheads | `field.frag` isolines (13.3) | per preset | per preset |
| Footer | `girih-tile.svg`, clipped at the viewport edge | `--pattern-strong` | `--paper` |
| Section dividers | `divider.svg` | 1.0 | `currentColor` |
| `behind-screen` photos | `girih-tile.svg` | 0.16 soft-light | `--paper` |
| Homework moment | one decagram, drawn | 1.0 | `--paper` + one `--amber` chord |
| Logo mark | one decagram, R=12 in 28px | 1.0 | `--sienna` |
| Favicon | one decagram on `--paper` | 1.0 | `--sienna` |
| 404 | `girih-tile.svg` | `--pattern-quiet` | `--ink` |

Nowhere else. If a section feels empty, the answer is composition, not more pattern.

---

## 10. Accessibility floor

Not a checklist at the end. These are design decisions already made above.

- **Contrast.** Section 6.3 is the authority. Every pairing is pre-verified. If you need a pairing that is not in that table, you are outside the system.
- **Focus.** `outline: var(--focus-width) solid var(--focus-color); outline-offset: var(--focus-offset);` on `:focus-visible`, with `--focus-color-on-dark` inside `.on-dark`. Never `outline: none` without an equivalent replacement. Focus is never animated.
- **Targets.** 44 x 44px minimum for every interactive element, including calendar cells and accordion triggers.
- **Landmarks.** One `<header>`, one `<nav aria-label="Main">`, one `<main id="main">`, one `<footer>`. Section headings in real `<h1>`-`<h3>` order, exactly one `<h1>` per page.
- **Canvas.** Every WebGL canvas is `aria-hidden="true"` and `tabindex="-1"`. No information exists only in the canvas.
- **Motion.** Section 5.4. Both CSS and JS must honour it.
- **Colour alone never carries meaning.** The calendar's colour coding is always accompanied by the words `Class`, `No school`, or the milestone's name, and by a visible legend.
- **Zoom.** The site is usable at 200% zoom and at 360px width. Nothing horizontal-scrolls except the calendar band, which does so deliberately and with a visible affordance.
- **Language.** `<html lang="en">`. Every Arabic element carries `lang="ar" dir="rtl"`.
- **Links.** Link text is meaningful out of context. No "click here", no "read more" without a following noun.
- **Video.** The hero montage is `muted loop playsinline` and decorative; it is `aria-hidden` and carries no captions burden. If it ever carries speech, it gains captions and a pause control.

---

## 11. Performance budget

| Budget | Value |
|---|---|
| Fonts | 6 woff2, subset, under 220KB total |
| JS, homepage | under 190KB gz including Three.js |
| JS, every other page | under 55KB gz |
| Shader | under 6KB |
| LCP | under 2.0s on a throttled 4G Moto G |
| CLS | under 0.02 - all media boxes are `aspect-ratio`-reserved, all fonts metric-matched |
| Lighthouse | 90+ across all four categories, every page |

Engineering floor for every WebGL surface, carried from `standard-dental` where it held:

- DPR capped at 2 (1.75 on the mobile hero tier).
- `IntersectionObserver` stops the render loop when the canvas leaves the viewport.
- `webglcontextlost` handler falls back to the CSS gradient rather than showing a black rectangle, and calls `event.preventDefault()`.
- Three.js is `client:only` and dynamically imported, on the homepage only.
- Textures and geometries are disposed on unmount.

---

## 12. Concept

### 12.1 The argument

The school's single strongest sentence is about the family, not the child:

> The Islamic School of Potomac was founded with a commitment to uplift every member of the family, not just the students registered in our school.

And its funniest sentence says the same thing:

> Children have enough homework during the week. We don't give homework to children - we give it to the parents!

Girih is generated from a small closed set of tiles that meet edge to edge at a fixed crossing angle.
No tile in a girih pattern is decorative. Remove one and the strapwork fails to close.
The pattern is not made of individuals; it is made of units that interlock.

That is the school's founding claim, stated as geometry: **the pattern needs every tile - the child, the parent, the volunteer.**

The second half of the concept comes from the epigraph the school already uses:

> "…and say, 'My Lord, increase me in knowledge.'" (20:114)

It is a prayer for permanent incompleteness. Islamic pattern is understood the same way - the frame crops a field that is infinite in principle and never terminates.
A school is also, by definition, an unfinished thing: every September, new children arrive mid-pattern.

So the site is **one continuous girih field, always cropped, never closed.**

### 12.2 Why the palette is theirs

The school's 2026-2027 calendar graphic is the only artefact they designed themselves. It uses a girih star tessellation in terracotta, dusty blue, sage and cream, with a burnt-sienna header for Semester 1 and a slate-blue header for Semester 2.

Every colour in section 1 was sampled from that file. Not approximated - sampled.

That matters for a reason beyond flattery. A palette invented for a client is a proposal. A palette grown from what they already made is an argument, and it survives the meeting where someone asks why. It also means their calendar's own colour logic - sienna for the first half of the year, slate for the second, amber for milestones - becomes the site's semantic colour system for free, and their printed calendar and their website will look like the same institution without anyone doing extra work.

The two colours that make this palette read as designed rather than trendy are the ones nobody would invent: the ground is a warm cream (`#FBF8F2`) rather than white, and the dark is a warm bistre (`#281E14`) rather than charcoal. Terracotta and sage on white with charcoal text is a 2021 interior-design trend. Terracotta and sage on cream with bistre text is a printed page.

### 12.3 The two marks

Colour in headline type is spent twice on this site. Nowhere else.

**The exclamation mark.** The school's teaching philosophy ends in an exclamation point. It is theirs, it is warm, and it is the only one on the site. At display size it is set in `--amber` while the rest of the line is `--paper`. One character, in the celebration colour, on the line that is the soul of the place.

**The closing cell.** In the same section, a single decagram sits behind the type with one chord missing - a visible gap in the strapwork. As the second line lands, that chord draws in, in `--amber`, and the star closes. No caption explains it.

That is the whole design in two seconds of motion, and it is why this section gets `--section-y-lg` and its own set-piece budget.

### 12.4 What this design refuses

These are not tonal preferences. They are prohibitions, because each one would make the site read as a costume.

| Refused | Because |
|---|---|
| Green and gold | The default palette of every Islamic institution on the internet. The school's own colours are better and are already theirs. |
| Mosque silhouettes, minarets, domes, star-and-crescent | Iconography of a building this school does not own, standing in for a school. |
| Arch-shaped photo masks | An arch used as a rounded rectangle is decoration pretending to be architecture. There are no arches on this site. |
| Calligraphy as ornament | Arabic on this site is set as type, in a real face, saying something. It is never a decorative swash. |
| Marble, mashrabiya photo textures, "Arabesque" background JPGs | Stock signifiers. The geometry here is constructed, not photographed. |
| Any depiction of a prophet or a human face in generated or illustrative work | Correct practice, and the better design problem. Photography of real students is in scope; generated imagery is geometry, light and letterform only. |
| Crests, seals, ceremonial photography, statistics walls, "Academics" mega-menus | The costume of institutions with endowments. This is a volunteer-run Sunday school with a $60 tuition, and pretending otherwise is the fastest way to lose a parent's trust. |
| Three-up feature card grids, icons in coloured circles, testimonial carousels with quote-mark glyphs | Template energy. Every one of them is available and every one of them is banned. |
| A hero with a dark overlay and centred white text over a stock photo | The current site already does a version of this. |

The confidence in this design lives in the typography, the restraint, the motion and the compositional courage. It does not live in pretending to be something the school isn't.

---

## 13. Set-pieces

Six. Each is tied to something the content is actually saying.
Motion that serves the content reads as expensive; motion for its own sake reads as a demo.

### 13.1 The Field - homepage hero, Three.js

The one true 3D set-piece in the build. Homepage only.

**What it is.** A shallow slab of extruded girih strapwork, lit from behind by a slow field of warm light, with a rectangular aperture cut into it where the pattern does not close. The aperture is the Window (13.2), and it is where the video montage will live.

The idea is a *jali* - pattern as a light filter - stated as light rather than as ornament. And it is the one surface in the site where the interlace is real: the ribbons genuinely weave over and under in z, which a flat SVG can never show. That is the payoff for spending the entire 3D budget in one place.

**Scene graph.**

```
scene
├── backdrop      PlaneGeometry, z = -1.6, ShaderMaterial(field.frag, preset "home-backdrop")
├── lattice       Group, z ∈ [0, 0.05]
│   └── ribbon[]  ExtrudeGeometry per decagram edge, MeshStandardMaterial
├── keyLight      DirectionalLight   #F6E7D7  intensity 1.6   pos (-0.6, 0.9, 1.0)
├── ambient       HemisphereLight    sky #B9DEE4, ground #A85A1E, intensity 0.45
└── windowGlow    PointLight         #E8B05A  intensity 2.2, distance 3.2, at the Window centre, z = -0.9
```

`PerspectiveCamera(38, aspect, 0.1, 20)` at `(0, 0, 3.2)`.
Renderer: `antialias: true`, `alpha: true`, `powerPreference: "high-performance"`, `outputColorSpace: SRGBColorSpace`, `toneMapping: ACESFilmicToneMapping`, `toneMappingExposure: 1.05`.
Clear colour: transparent. The CSS gradient fallback sits behind the canvas and is simply covered.

**Lattice geometry.**

Build from the same `{10/3}` decagram as section 9.2 - the geometry is generated in JS from the vertex table, not loaded from the SVG.

1. Lay decagrams on the 9.2 lattice: `R = 0.5` world units, horizontal period `1.0`, vertical period `0.95106`. Rings of decagrams outward from a chosen origin cell.
2. Each decagram is **10 separate edges** (vertex `k` to vertex `k+3`), not one path. Each edge becomes one ribbon.
3. Ribbon = `ExtrudeGeometry` of a rectangle `0.026` wide (cross-section `0.026 x 0.014`) swept along the edge, with `bevelEnabled: false`.
4. **Interlace:** edge index `i` sits at `z = 0.014` when `i` is even and `z = 0.000` when `i` is odd. Because a `{10/3}` path alternates naturally around its crossings, this produces correct-looking over/under weave with no crossing analysis.
5. Under-ribbons (`z = 0`) get `color` multiplied by `0.88` - faked ambient occlusion, cheaper and better-looking than a shadow map.
6. Material: `MeshStandardMaterial({ color: 0xFBF8F2, roughness: 0.82, metalness: 0.0 })`. Paper and plaster, not plastic. No shadow maps anywhere in this scene.

**Rings by tier:** 4 rings at Tier 1 desktop, 2 rings at Tier 1 mobile (see 13.2). Merge all ribbons of the same z-level into two `BufferGeometry` merges - two draw calls, not four hundred.

**Motion.**

| Beat | Behaviour |
|---|---|
| Entrance | The pattern draws itself outward from a single construction point at the upper left over `--dur-draw`. See below. |
| Idle | `backdrop` light drifts on a ~24s period (handled inside `field.frag`). The lattice itself does not move. |
| Pointer | Camera rotates a maximum of ±1.2 degrees and translates ±0.06 units, lerped at 0.06. Just enough for the weave to read as depth. Disabled on touch. |
| Scroll handoff | ScrollTrigger over the hero's height, `scrub: 0.6`: `camera.position.z` 3.2 → 4.6, lattice material `opacity` 1 → 0.15, backdrop uniform `uOpacity` 1 → 0.25. The field recedes as the first content section arrives. |

**The entrance draw.** Preferred technique: give each ribbon a per-vertex attribute `aPathT` (0 to 1 along the ribbon) and a per-mesh uniform `uDelay` set to the ribbon's normalised distance from the origin point. Patch the standard material with `onBeforeCompile` and `discard` fragments where `aPathT > clamp((uRevealGlobal - uDelay) / 0.25, 0.0, 1.0)`. GSAP tweens `uRevealGlobal` 0 → 1.25 over `--dur-draw` with `--ease-out`.

Documented fallback if `onBeforeCompile` fights the Three.js version: animate each decagram's `scale` 0.86 → 1 and `material.opacity` 0 → 1, staggered outward by ring and then by angle. Less magical, entirely acceptable, and explicitly permitted.

**Construction hairlines.** During the draw, thin `LineSegments` show the circumscribing circle and the ten radii of each decagram, in `--amber` at 0.35 opacity. They fade out over `--dur-slow` once `uRevealGlobal` passes 1.0.
Under `prefers-reduced-motion` they never fade - the hero is a still diagram of its own construction (5.4).

**Hero type sits over the canvas**, not inside it. See 14.1 for spans.

### 13.2 The Window - where the montage lives

The hero video montage and the 3D set-piece are **the same surface**. The set-piece is what a visitor sees before real footage exists; the montage takes over inside it when real video lands. Neither replaces the other.

**The DOM is the source of truth for the aperture, not the 3D projection.** Projecting a scene rect into screen space and positioning DOM against it is fragile across resize, DPR and font loading. Do it the other way round.

```
.hero-window   an empty, positioned DOM box. aspect-ratio: var(--ratio-window).
               On resize (and after fonts settle), read getBoundingClientRect(),
               normalise against the canvas rect, and push it to the shader and
               the lattice as uWindowRect = vec4(x, y, w, h).
```

Position of `.hero-window`, absolute within the hero:

| Breakpoint | Columns | Vertical |
|---|---|---|
| >= 1200px | grid columns `6 / 11` | centred at 54% of hero height |
| 768 - 1199px | grid columns `4 / 11` | below the headline, `margin-top: var(--s-8)` |
| < 768px | `1 / -1` | below the headline, `margin-top: var(--s-7)` |

**State A - today (`status: 'placeholder'`).**
No poster image, no video element. Inside `uWindowRect` the lattice ribbons are culled and the backdrop's light intensity is multiplied by `1.4`. The aperture is simply where the light comes through: brighter, warmer, alive. A `--shadow-glow` sits on the DOM box to bloom its edges into the surrounding pattern.
It must not read as an empty placeholder. It reads as a window.

**State B - real footage (`status: 'real'`).**
A `<video muted loop playsinline preload="metadata">` renders into `.hero-window`, `object-fit: cover`, with the `ink-duotone` treatment at 60% strength so the footage lives inside the palette instead of punching a full-colour hole in it. Poster is the slot's `poster` frame, same treatment.
The lattice does **not** get out of the way: the strapwork ribbons that border the aperture render **in front** of the video via an SVG overlay traced from the same geometry, in `--paper`, at full opacity. The footage sits *behind the screen*. That relationship is the entire idea and it is why the montage is a media slot rather than a hardcoded element.

The only code difference between A and B is the presence of the `<video>` element and the SVG border overlay. `uWindowRect` behaviour, the glow and the lattice cull are identical in both states, so shipping B is a data edit plus one conditional in the hero component.

**Tiers.** Applied independently of `prefers-reduced-motion`, which then applies on top of whichever tier resolved.

| Tier | Condition | Hero renders |
|---|---|---|
| 1 | WebGL2 available, viewport >= 600px, `navigator.hardwareConcurrency > 4` | Three.js Field, 4 rings (2 rings if viewport < 900px), DPR cap 2 (1.75 under 900px) |
| 2 | WebGL available but not Tier 1 | `field.frag` fullscreen quad, preset `home-flat`: the same light field with strapwork isolines at `uStrapWidth 0.014`, same `uWindowRect` cut. ~5KB. |
| 3 | No WebGL, or `webglcontextlost` | Layered CSS radial-gradient in `--slate-deep` → `--sienna` → `--amber`, plus `girih-tile.svg` at `--pattern-present` in `--paper`, plus the `.hero-window` box with a 1px `--rule-on-dark-strong` border. Static, and genuinely good-looking. Not an apology. |

### 13.3 `field.frag` - one shader, eight expressions

Every page except the homepage hero runs the same fragment shader on a fullscreen quad in a masthead band. One file, one compile, per-page uniforms.

The shader draws a **five-fold quasiperiodic field** - the sum of five plane waves at 72-degree increments. That sum is the standard construction of a quasicrystal, and it is the mathematics that underlies girih tiling. So the interior pages are not decorated with a pattern; they are lit by the same geometry the hero is built from, seen as light rather than as structure.

**Uniforms.**

```glsl
uniform float uTime;          // seconds
uniform vec2  uRes;           // canvas px
uniform vec4  uWindowRect;    // x,y,w,h normalised; w = 0.0 disables
uniform vec2  uLightOrigin;   // normalised; where light enters
uniform vec3  uPaletteA;      // dark end   (sRGB 0-1, converted to OKLab in shader)
uniform vec3  uPaletteB;      // mid
uniform vec3  uPaletteC;      // light end
uniform vec3  uStrapColor;
uniform float uDensity;       // 2.0 .. 6.0   frequency of the quasiperiodic field
uniform float uStrapWidth;    // 0.0 .. 0.035 ; 0.0 = pure light, no isolines
uniform float uGlow;          // 0.0 .. 1.0
uniform float uDrift;         // 0.0 .. 1.0   animation amplitude
uniform float uConstruction;  // 0.0 .. 1.0   secondary contour visibility
uniform float uGrain;         // 0.0 .. 0.05
uniform float uOpacity;       // 0.0 .. 1.0
```

**Core, as specification.**

```glsl
#define PI 3.14159265359

// --- five-fold quasiperiodic field -------------------------------------
float girihField(vec2 p, float density, float phase) {
  float s = 0.0;
  for (int k = 0; k < 5; k++) {
    float a = float(k) * (2.0 * PI / 5.0);          // 72 degrees
    vec2  d = vec2(cos(a), sin(a));
    s += cos(dot(p, d) * density + phase * (0.35 + 0.15 * float(k)));
  }
  return s * 0.2;                                    // -1 .. 1
}

// --- OKLab mixing -------------------------------------------------------
// sRGB midpoints between sienna and slate go grey and muddy. OKLab does not.
vec3 srgbToOklab(vec3 c) {
  c = pow(c, vec3(2.2));
  float l = 0.4122214708*c.r + 0.5363325363*c.g + 0.0514459929*c.b;
  float m = 0.2119034982*c.r + 0.6806995451*c.g + 0.1073969566*c.b;
  float s = 0.0883024619*c.r + 0.2817188376*c.g + 0.6299787005*c.b;
  l = pow(l, 1.0/3.0); m = pow(m, 1.0/3.0); s = pow(s, 1.0/3.0);
  return vec3(0.2104542553*l + 0.7936177850*m - 0.0040720468*s,
              1.9779984951*l - 2.4285922050*m + 0.4505937099*s,
              0.0259040371*l + 0.7827717662*m - 0.8086757660*s);
}
vec3 oklabToSrgb(vec3 c) {
  float l = c.x + 0.3963377774*c.y + 0.2158037573*c.z;
  float m = c.x - 0.1055613458*c.y - 0.0638541728*c.z;
  float s = c.x - 0.0894841775*c.y - 1.2914855480*c.z;
  l = l*l*l; m = m*m*m; s = s*s*s;
  vec3 rgb = vec3( 4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
                  -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
                  -0.0041960863*l - 0.7034186147*m + 1.7076147010*s);
  return pow(max(rgb, 0.0), vec3(1.0/2.2));
}
vec3 mixOk(vec3 a, vec3 b, float t) {
  return oklabToSrgb(mix(srgbToOklab(a), srgbToOklab(b), t));
}

// --- fBm for the light field -------------------------------------------
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0 - 2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv  = gl_FragCoord.xy / uRes;
  vec2 p   = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t  = uTime * 0.06 * uDrift;

  // 1. the light field: domain-warped fBm, very low frequency
  vec2  w = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t + 4.7));
  float L = fbm(p * 1.9 + w * 0.9);

  // 2. distance from where the light enters
  float d = distance(uv, uLightOrigin);
  L = clamp(L * 0.75 + (1.0 - smoothstep(0.05, 1.05, d)) * (0.55 + 0.45 * uGlow), 0.0, 1.0);

  // 3. colour, mixed in OKLab
  vec3 col = L < 0.5 ? mixOk(uPaletteA, uPaletteB, L * 2.0)
                     : mixOk(uPaletteB, uPaletteC, (L - 0.5) * 2.0);

  // 4. strapwork isolines of the quasiperiodic field
  if (uStrapWidth > 0.0001) {
    float f  = girihField(p * 3.0, uDensity, t * 4.0);
    float aa = fwidth(f) * 1.5;
    float strap = 1.0 - smoothstep(uStrapWidth, uStrapWidth + aa, abs(f));
    // secondary "construction" contours at |f| = 0.62
    float cons  = 1.0 - smoothstep(uStrapWidth * 0.45, uStrapWidth * 0.45 + aa, abs(abs(f) - 0.62));
    col = mix(col, uStrapColor, strap * 0.85);
    col = mix(col, uStrapColor, cons * 0.40 * uConstruction);
  }

  // 5. the Window: light opens, pattern gets out of the way
  if (uWindowRect.z > 0.0) {
    vec2 wmin = uWindowRect.xy, wmax = uWindowRect.xy + uWindowRect.zw;
    vec2 e = min(uv - wmin, wmax - uv);
    float inside = smoothstep(-0.02, 0.03, min(e.x, e.y));
    col = mixOk(col, uPaletteC, inside * 0.55);
  }

  // 6. grain
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * uGrain;

  gl_FragColor = vec4(col, uOpacity);
}
```

Vertex shader is the trivial fullscreen-quad pass-through. No scene graph, no Three.js. Raw WebGL2, one program, ~5KB.

**Per-page presets.** These are the complete uniform sets. Palette values are the token hexes converted to 0-1 vec3 in JS.

| Preset | Page | A | B | C | strap | density | width | glow | drift | construction | grain | opacity | light origin |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `home-backdrop` | Home hero (behind the 3D lattice) | `--slate-deep` | `--sienna` | `--amber` | - | - | `0.0` | `1.00` | `1.00` | `0.00` | `0.012` | `1.00` | Window centre |
| `home-flat` | Home hero, Tier 2 | `--slate-deep` | `--sienna` | `--amber` | `--paper` | `3.2` | `0.014` | `0.90` | `1.00` | `0.30` | `0.012` | `1.00` | Window centre |
| `story` | Our Story | `--paper` | `--paper-warm` | `--fill-sky` | `--ink` | `3.6` | `0.006` | `0.25` | `0.35` | `1.00` | `0.010` | `0.55` | `(0.22, 0.30)` |
| `program` | Program | `--paper-warm` | `--fill-apricot` | `--sienna` | `--paper` | `3.0` | `0.014` | `0.40` | `0.50` | `0.35` | `0.010` | `0.50` | `(0.50, 0.18)` |
| `calendar` | Calendar | `--paper-cool` | `--fill-sky` | `--slate` | `--paper` | `4.6` | `0.010` | `0.30` | `0.30` | `0.25` | `0.010` | `0.45` | `(0.78, 0.22)` |
| `enroll` | Enroll | `--paper` | `--amber` | `--sienna` | `--paper` | `2.6` | `0.016` | `0.60` | `0.60` | `0.30` | `0.010` | `0.55` | `(0.30, 0.55)` |
| `faqs` | FAQs | `--paper` | `--paper-cool` | `--paper-warm` | `--ink` | `5.2` | `0.008` | `0.15` | `0.25` | `0.20` | `0.008` | `0.35` | `(0.50, 0.10)` |
| `give` | Give | `--ink` | `--sienna` | `--amber` | `--paper` | `3.2` | `0.012` | `0.90` | `0.70` | `0.30` | `0.014` | `1.00` | `(0.50, 0.02)` |
| `contact` | Contact | `--slate-deep` | `--slate` | `--fill-sky` | `--paper` | `2.2` | `0.010` | `0.50` | `0.40` | `0.30` | `0.012` | `1.00` | `(0.50, 0.62)` |
| `notfound` | 404 | `--paper` | `--amber` | `--sienna` | `--paper` | `2.6` | `0.016` | `0.60` | `0.60` | `0.30` | `0.010` | `0.40` | `(0.50, 0.50)` |

`uWindowRect` is `vec4(0.0)` on every preset except the two homepage ones.

**The masthead band.** On every interior page the shader occupies a band, never the full page: `min-height: 52svh` at >=768px, `44svh` below, `--ratio-band` maximum. The page title sits over it. Six of the eight bands are light (`--text` over them); Give and Contact are dark (`--text-on-dark`). That is the site's rhythm: an overture on every page, a full-viewport hero on exactly one.

`give` reads as light rising from the bottom edge - `uLightOrigin.y = 0.02` - and its `uLightOrigin.y` scrubs from `0.02` to `0.5` across the page's scroll. Light rises as you read about supporting the school. It is one line of scroll-linked code and it is the only interior page with scrubbed shader motion.

### 13.4 The other four set-pieces

**The Three Doors** (homepage, after the hero). The multi-audience routing moment, and the reason it is not three cards: three cards make the reader choose between equals. Three full-width rows make the reader *recognise themselves*.

Three rows, each spanning `1 / 11`, `min-height: 132px`, separated by `--rule` hairlines. Each row: a `.t-label` index on the left (`01`, `02`, `03`), a `.t-title` line, a one-line `.t-small` under it, and an `arrow-right` at the right edge.
On hover or focus: the row's ground fills with that door's tint (`--tint-sienna`, `--tint-slate`, `--tint-amber`) over `--dur-base`, the title translates 12px right, the arrow translates 8px right, and a `strap-draw` rule draws along the row's bottom edge in the door's accent colour.
Entrance: `line-rise` per row, `--stagger-slow`.

**The Homework** (homepage, dark). Described in 12.3. `--section-y-lg`, ground `--ink`, `girih-tile.svg` behind at `--pattern-whisper`.
The setup line spans `2 / 8` as a `.t-subtitle` in `--text-on-dark-soft`. The punchline spans `2 / 10` as `.t-hero`, `--text-on-dark`, four lines. Behind it, centred on the line break, a single decagram at 62% of the section height in `--paper` stroke at 0.22 opacity, with one chord absent.
Scroll timeline, `scrub: 0.6` across the section: the setup line `line-rise` in the first 20%; the decagram `strap-draw` from 20% to 70%; the missing chord draws in `--amber` at full opacity from 70% to 90%; the four punchline lines `line-rise` at 75%. The exclamation mark is a `<span>` in `--amber`.

**The Year** (Calendar page, and a reduced version on the homepage). 33 Sundays as a continuous horizontal band of `tile-in` cells, filling along the 36-degree vector. On the Calendar page the band wraps into a grid at `<1024px`; on the homepage it is a horizontally scrollable strip with a visible edge fade and a `.t-label` affordance reading `SCROLL THE YEAR`. After the fill completes, the `NEXT CLASS` cell blooms: `scale 1 → 1.06 → 1` over `--dur-slow`, and its outline draws.

**The Program sequence** (Program page). Three sections, sequenced vertically, never side by side. As each enters, the page's shader tweens `uDensity` - `4.6` under Arabic, `3.2` under Deen, `2.0` under `...and in between` - over `--dur-slow`. The pattern loosens as the content loosens. Nobody will consciously notice it and everybody will feel it.

---

## 14. Pages

Column spans are given as `start / end` on the ten-column grid, for >=1024px.
At 768-1023px, halve the offset and widen by two columns.
Below 768px every span is `1 / -1` unless stated.

Copy is in `COPY.md` and is used verbatim. The structures below say where it goes, not what it says.

### 14.1 Home - `/`

| # | Section | Ground | Structure |
|---|---|---|---|
| 1 | **The Field** | canvas | Full viewport, `100svh`, `min-height: 640px`. Type block spans `1 / 6`, vertically centred, `padding-block-end: var(--s-9)`. `.t-label` eyebrow, then `.t-hero` headline (3 lines), then `.t-lead` at `--measure-lead`, then `.btn-primary` + `.btn-quiet`. `.hero-window` per 13.2. Scroll cue at the bottom: `.t-label` plus a 40px `arrow-down` whose stroke draws on a 2.4s loop. Hero type is `--text-on-dark`; the backdrop's dark end guarantees contrast at the type's position. |
| 2 | **The Three Doors** | `--paper` | Per 13.4. `--section-y-sm`. |
| 3 | **More than a Sunday School** | `--paper-warm` | The manifesto beat. `.t-label` spans `1 / 4`; `.t-display` spans `4 / 11` set to `--measure-display`; `.t-lead` spans `4 / 9`. Below, spanning `1 / 11`, the Arabic epigraph in `.t-arabic` right-aligned with the English translation in Literata italic beneath it, left-aligned, and `20:114` in `.t-label`. `--section-y-lg`. |
| 4 | **The Homework** | `--ink` | Per 13.4 and 12.3. `--section-y-lg`. |
| 5 | **The Program in brief** | `--paper` | Three stacked editorial blocks, not cards. Each: `.t-label` index spans `1 / 3`; `.t-title` + `.t-body` span `3 / 8`; one `4/5` photo spans `8 / 11` on blocks 1 and 3, and the block 2 photo column is left empty so the rhythm breaks. `.btn-quiet` to `/program` after the third. |
| 6 | **This year** | `--paper-cool` | The band from 13.4, plus the three named events as three `1/1` milestone cards spanning `1 / 4`, `4 / 7`, `8 / 11` - note the deliberate gap at column 7, which is what stops it reading as a three-up grid. `.btn-quiet` to `/calendar` and a `download` link for the `.ics`. |
| 7 | **Standing behind the school** | `--paper` | Asymmetric: `.t-display` spans `1 / 6`, `.t-body` spans `1 / 5`, `.btn-primary` to `/give`. A `21/9` photo bleeds off the **right** viewport edge from column 6. `--section-y-lg`. |
| 8 | Footer | `--ink` | 7.2 |

Exactly two dark sections (4 and the footer). Exactly one `.btn-primary` in view at a time.

### 14.2 Our Story - `/our-story`

| # | Section | Ground | Structure |
|---|---|---|---|
| 1 | Masthead | shader `story` | `.t-label`, `.t-hero` spanning `1 / 8`. |
| 2 | The founding commitment | `--paper` | `.t-lead` spanning `2 / 8`, then two `.t-body` columns spanning `2 / 6` and `6 / 10`. The school's founding line is pulled out between them as a `.t-title` in Literata italic spanning `2 / 10`, with a `--rule-accent` hairline above. |
| 3 | A community, not a school | `--paper-warm` | `21/9` photo bleeding **left**; text spans `6 / 11`. |
| 4 | What a Sunday is | `--paper` | A vertical sequence of four moments, each a `.t-label` time marker plus a `.t-subtitle` line plus `.t-body`, on hairline rows spanning `2 / 9`. `strap-draw` divider before it. **No specific clock times beyond the confirmed 10:00 AM start and the Dhuhr close.** |
| 5 | Volunteers | `--paper` | Text spans `1 / 5`; `4/5` photo spans `6 / 9`, offset downward by `var(--s-8)`. |
| 6 | CTA | `--paper-cool` | `.t-display` + `.btn-primary` to `/enroll`, `.btn-quiet` to `/program`. |

### 14.3 Program - `/program`

| # | Section | Ground | Structure |
|---|---|---|---|
| 1 | Masthead | shader `program` | `.t-label`, `.t-hero` spanning `1 / 8`. The epigraph sits here in `.t-arabic` + italic English, spanning `6 / 11`, right-aligned. |
| 2 | How the program is built | `--paper` | `.t-lead` spanning `2 / 8`. |
| 3 | **Arabic** | `--paper` | `.t-label` `01` spans `1 / 2`. `.t-arabic-kufi` `العربية` sits above the `.t-display`, `--sienna`, spanning `2 / 6`. Body spans `2 / 6`. A `4/5` photo spans `7 / 11`. Below the body, a four-item hairline list (Noorani method, Quranic vocabulary, memorisation of shorter suras, love for the Quran as a book of guidance) as `.t-subtitle` rows. |
| 4 | **Deen** | `--paper-warm` | Mirrored: photo spans `1 / 5`, text spans `6 / 10`. `.t-arabic-kufi` `الدين`. |
| 5 | **...and in between** | `--paper` | Text spans `2 / 7`, full width for the headline (`1 / 11`, `.t-display`, set in Literata italic - the one place a display headline is not Bricolage, because this section's name is a spoken aside, not a title). One `behind-screen` `5/4` photo spans `6 / 11`. No Arabic. |
| 6 | Placement | `--paper-cool` | Two hairline rows spanning `2 / 9`: Arabic placement by test, Deen placement by age. `.t-subtitle` + `.t-body`. |
| 7 | Homework, restated | `--ink` | The teaching-philosophy line again, smaller than the homepage treatment - `.t-display`, not `.t-mega` - with the parent-participation copy beneath. Spans `2 / 9`. No decagram animation here; the homepage owns that moment. |
| 8 | The year's three moments | `--paper` | Deen Showcase, Arabic Final Exams, Quran Competition, each with its date in mono and a link to `/calendar`. Hairline rows spanning `1 / 11`. |
| 9 | CTA | `--paper` | `.btn-primary` to `/enroll`. |

Two dark sections would be one too many here, so section 7 is the only one.

### 14.4 Calendar - `/calendar`

The page with the most operational value on the site, and the one a parent will return to. It is designed for scanning and for printing.

| # | Section | Ground | Structure |
|---|---|---|---|
| 1 | Masthead | shader `calendar` | `.t-label` `2026 - 2027`, `.t-hero` spanning `1 / 8`. Shorter than other mastheads: `44svh`. |
| 2 | **Next class** | `--paper` | Computed client-side. Spans `1 / 6`: `.t-label` `NEXT CLASS`, then the date in `--font-mono` at `--fs-display`, then the session title in `.t-title`, then days-away in `.t-body`. Spanning `7 / 11`: `.btn-primary` `Add the year to your calendar` (downloads the `.ics`) and a `.t-small` note about subscribing. If the year has ended, this block shows the closing message from `COPY.md` instead - never a broken or empty state. |
| 3 | **The year** | `--paper-cool` | The 33-cell band (13.4). Legend above it: four `.t-label` swatches - Class, No school, Milestone, Ramadan. `--section-y-sm`. |
| 4 | **Semester 1** | `--paper` | Full list, 14 rows. Section head carries a 3px `--sienna` top rule - their colour. Each row: date in mono spanning `1 / 3`, title spanning `3 / 8`, kind label spanning `8 / 11` right-aligned. Rows are hairline-separated; `no-school` rows set their title in `--text-faint`. |
| 5 | **Semester 2** | `--paper` | Same, 19 rows, 3px `--slate` top rule. The two Ramadan rows carry a `RAMADAN` `.t-label` in `--text-amber`. |
| 6 | The three moments | `--paper-warm` | Deen Showcase, Arabic Final Exams, Quran Competition. Three `1/1` photos with copy, spanning `1 / 4`, `4 / 7`, `8 / 11`. |
| 7 | Where and when | `--paper` | The confirmed logistics, in one block spanning `2 / 8`: Sundays, 10:00 AM until Salat al-Dhuhr, September through May, classes held at the Islamic Education Center. Both contact channels appear here in `--font-mono` at `--fs-lead`, because "is there class this Sunday" is the single most likely reason anyone reaches for a phone on this site, and this is the page they will already be on. Link to `/contact`. |
| 8 | CTA | `--paper` | `.btn-quiet` to `/enroll`. |

**Print stylesheet.** Parents will print this page and put it on a fridge. `@media print`: hide the header, footer, shader canvas, grain and all buttons; force `--paper` to white and all text to `--ink`; keep the semester fill colours (`print-color-adjust: exact`); set both semester lists side by side in two columns; add the school name and `ispmd.org` as a print-only header. It should fit on one sheet of US Letter.

### 14.5 Enroll - `/enroll`

The page does the persuading before it shows the form.

| # | Section | Ground | Structure |
|---|---|---|---|
| 1 | Masthead | shader `enroll` | `.t-label`, `.t-hero` spanning `1 / 8`. |
| 2 | What you are enrolling in | `--paper` | `.t-lead` spanning `2 / 8`. A `16/9` photo spans `1 / 11` beneath, `warm-grade`. |
| 3 | **Tuition** | `--paper-warm` | The clearest block on the site. Two figures set in `--font-mono` at `--fs-display`: `$60` and `$100`, spanning `2 / 5` and `5 / 8`, each with a `.t-label` beneath (`one student` / `a family`). Spanning `8 / 11`: the financial-assistance line in `.t-body`, in a `--vellum` card. Do not put a currency symbol in a different size or colour; set it at full size. |
| 4 | **Who it's for** | `--paper` | Three hairline rows spanning `2 / 9`: ages 5 through 18, kindergarten minimum at 5, Arabic placement by test and Deen placement by age. |
| 5 | **Steps** | `--paper` | Four numbered steps, mono index plus `.t-subtitle` plus `.t-body`, on a vertical hairline sequence spanning `2 / 8`. A `strap-draw` vertical rule connects the four indices. |
| 6 | **The form** | `--paper-cool` | `.t-label` `ENROLLMENT FORM` above a `--paper` frame: `max-width: 760px`, `--radius-lg`, `border: 1px solid var(--rule-strong)`, `padding: var(--s-5)`, `--shadow-md`. The JotForm iframe sits inside using JotForm's official embed handler for auto-resize. Beneath the frame, always visible and never conditional: a `.btn-quiet` linking directly to the JotForm URL, labelled per `COPY.md`. Do not attempt to restyle JotForm's internals. If the embed cannot be made to sit acceptably in the frame, drop it and ship the direct link as a `.btn-primary` in the same frame - that decision is delegated and needs no re-asking. |
| 7 | Questions | `--paper` | Two links: `/faqs` and `mailto:info@ispmd.org`. |

### 14.6 FAQs - `/faqs`

| # | Section | Ground | Structure |
|---|---|---|---|
| 1 | Masthead | shader `faqs` | The quietest masthead on the site. `.t-hero` spanning `1 / 7`. |
| 2 | The list | `--paper` | Accordion (7.6) in `.container-narrow`. Grouped under three `.t-label` headings - Enrolling, The program, Practical - with a `strap-draw` divider between groups. First item open. |
| 3 | Aside | `--paper-warm` | Halfway down, breaking the list: a `4/5` `cool-grade` photo spanning `7 / 11` with a short pull-quote spanning `2 / 6`. This is what stops the page reading as a support-ticket list. |
| 4 | Still asking | `--paper` | `.t-display` plus the email, plus `.btn-quiet` to `/contact`. |

### 14.7 Give - `/give`

| # | Section | Ground | Structure |
|---|---|---|---|
| 1 | Masthead | shader `give`, dark | `--text-on-dark`. `.t-hero` spanning `1 / 8`. Light rises through the section on scroll (13.3). |
| 2 | Why | `--paper` | `.t-lead` spanning `2 / 8`. A `21/9` `ink-duotone` photo spans `1 / 11`. |
| 3 | **What $60 means here** | `--paper-warm` | The honest-scale argument: tuition is $60 and the school is volunteer-run, so a gift is not marginal. Text spans `2 / 7`; a `--vellum` card spanning `7 / 11` carries the 501(c)(3) line and `EIN 52-1989063` in `--font-mono`. |
| 4 | **Give** | `--paper` | Three suggested-amount tiles spanning `1 / 4`, `4 / 7`, `8 / 11` - amounts in `--font-mono` at `--fs-title`, each with a one-line `.t-small` describing what it covers in plain, non-inflated terms. **Presentational only.** PayPal hosted buttons do not reliably accept amount parameters, so all three route to the same URL and none of them may imply the amount is pre-filled. Below them, `.btn-primary` `Give through PayPal` linking to `https://www.paypal.com/donate/?hosted_button_id=24GHPP5NMDF74`. Plain link, no SDK, no script tag. |
| 5 | **By cheque** | `--paper` | For this audience a mailed cheque is a real path, not a footnote, so it gets equal weight: a `--vellum` card spanning `2 / 7` with the payee name and the P.O. Box set in `--font-mono`, and the words `Mail only` in `.t-label`. |
| 6 | Other ways | `--paper-cool` | Volunteering and parent participation, linking to `/contact`. |

### 14.8 Contact - `/contact`

**The design problem.** ISP has a phone number and an email address, no street address of its own, no staff names, and an Instagram that last posted in May 2023. Classes are held in a building belonging to a different organisation.

A conventional contact page presents channels, which invites the reader to audit what is missing. This one is organised by **intent** - what a visitor actually arrived wanting to do - and by that measure it is complete rather than short.

**Both channels get equal typographic weight**, at `--fs-title`, side by side in the reading order rather than one above a smaller other. That is not a compromise; a phone and an email genuinely do different jobs here, and saying so plainly is more useful to a parent than picking a favourite. Each carries one line about when to use it.

The tone rule for this page: **set expectations without apologising.** Nobody staffs a phone at a school this size, and saying so warmly ("there is no phone tree and no office here") reads as honest rather than thin. Never write anything that promises a response time.

Layout is a single editorial column at `.container-narrow` - the colophon page of a book, where short is correct. Dark masthead, paper body, hairline rows.

| # | Section | Ground | Structure |
|---|---|---|---|
| 1 | Masthead | shader `contact`, dark | `.t-hero` spanning `1 / 8`, `--text-on-dark`. |
| 2 | **Reach us** | `--paper` | Two hairline rows, equal weight. Row one: `(301) 929-1441` as a `tel:+13019291441` link at `--fs-title` in `--font-display`, `--vf-title`, `--text-link-warm`, with a `.t-body` line beneath. Row two: `info@ispmd.org` as a `mailto:` link, identical treatment. Both carry the hooked underline drawn at rest, animating on hover. Display the number formatted as `(301) 929-1441`; the `href` is unformatted. Nested beneath the email row and indented by `var(--s-5)`, three `mailto:` links with pre-filled subjects as `.t-subtitle` hairline rows with `arrow-right`: `Enrolling a child` (`?subject=Enrolling%20a%20child`), `A question about the program`, `I'd like to volunteer`. They route intent and lower the cost of writing, so the page has five ways in rather than two. |
| 3 | **Where class meets** | `--paper-warm` | The venue, framed correctly per `COPY.md`: classes are *held at* the Islamic Education Center, 7917 Montrose Rd, Potomac, MD 20854, and ISP is a separate organisation. Address in `--font-mono`. Times beneath: Sundays, 10:00 AM until Salat al-Dhuhr, September through May. One text link `Open in maps` (a plain URL, no embedded map, no third-party script). A `5/4` `cool-grade` photo spans the right of the block at >=1024px. **The IEC's phone number does not appear on this page or anywhere on this site.** |
| 4 | **Post** | `--paper` | P.O. Box 833, Rockville, MD 20848-0833 in `--font-mono`, with the `Mail only` `.t-label`, and one sentence saying plainly that it is a mailbox rather than a classroom. Naming the limitation is what makes it read as deliberate, and it stops someone driving to a P.O. Box. |
| 5 | **Come on a Sunday** | `--paper-cool` | The third channel, and the best one. `.t-display` plus two paragraphs, one of which names the Deen Showcase as the morning to pick. This section is not compensating for anything now; it is the answer a small school can give that a large one cannot, and it stays exactly as generous as it was. |
| 6 | **Elsewhere** | `--paper` | Instagram and Facebook as two plain text links. No embedded feed - an embed would advertise how long it has been since the last post. No claims about activity. |

**No contact form.** There is no server, and a form that silently fails is worse than a channel that works. The three `mailto:` rows are the form. Do not build one.

**Schema.org** on this page only:

```
EducationalOrganization
  name        "Islamic School of Potomac"
  telephone   "+1-301-929-1441"
  email       "info@ispmd.org"
  url         site URL
  address     PostalAddress { postOfficeBoxNumber "833",
                              addressLocality "Rockville",
                              addressRegion "MD",
                              postalCode "20848-0833",
                              addressCountry "US" }
  location    Place { name "Islamic Education Center",
                      address PostalAddress { streetAddress "7917 Montrose Rd", ... } }
  nonprofitStatus  "Nonprofit501c3"
  taxID       "52-1989063"
```

`telephone` is ISP's own line. The Islamic Education Center's number must never appear in this block or anywhere else on the site - it belongs to a different legal entity and publishing it routes parents to the wrong organisation.

`address` is the P.O. Box and nothing else. The residential street address tied to ISP's phone number in third-party directories is **not** publishable in any form, including structured data.

`location` is a separate `Place` node and must never be written as the organisation's `address`; the two organisations are legally distinct.

### 14.9 404

Ground `--paper`, `girih-tile.svg` at `--pattern-quiet` behind, shader preset `notfound` in a short band.
The numeral `404` sits behind the text block in `.t-mega`, `--text` at 0.08 opacity, clipped by the left container edge - the only use of `--fs-mega` on the site. Over it: `.t-display` spanning `2 / 8`, one `.t-body` line, then four `.btn-quiet` links: Home, Program, Calendar, Contact.
Copy in `COPY.md`. Charming, plain, no joke that needs explaining.

---

## 15. Media slot registry

The complete inventory. Twenty slots. `src/data/media.ts` contains these and nothing else.
Every one is `status: 'placeholder'` today.

**This supersedes the illustrative `Treatment` union in the tech plan.** The mechanism is unchanged; the treatment names are design and are set here:

```ts
export type Treatment = 'ink-duotone' | 'warm-grade' | 'cool-grade' | 'behind-screen' | 'raw';
```

`minWidth` is the minimum acceptable pixel width for the file. `focal` is a CSS `object-position`.

| Slot id | Kind | Ratio | Treatment | minWidth | Focal | Alt (true of placeholder and of the real photo) | Shot note |
|---|---|---|---|---|---|---|---|
| `home.hero.montage` | video | `16/9` | `ink-duotone` | 2400 | `50% 40%` | *(decorative, `alt=""`)* | 8-12s of cut coverage, wide, natural light: arrival at the door, a classroom from the back, a child reading aloud, parents talking in a hallway. No faces held longer than 1.5s. |
| `home.community.wide` | image | `21/9` | `warm-grade` | 2400 | `50% 45%` | A room of children and adults together, seen wide | The whole community in one frame. Shoot from a doorway, not from the front of the room. |
| `home.program.arabic` | image | `4/5` | `behind-screen` | 1200 | `50% 35%` | Hands and an open book on a table | Close, top-down or over-shoulder. Hands and page only. |
| `home.calendar.room` | image | `5/4` | `cool-grade` | 1600 | `50% 50%` | An empty classroom with chairs set out | Before class. Empty rooms read as anticipation. |
| `story.opening` | image | `21/9` | `ink-duotone` | 2400 | `50% 40%` | A doorway with people arriving | The first thing that happens on a Sunday. |
| `story.families` | image | `4/5` | `warm-grade` | 1200 | `50% 30%` | An adult and a child seated together, reading | The founding claim is about families, so the photo has two generations in it. |
| `story.volunteers` | image | `5/4` | `warm-grade` | 1600 | `50% 45%` | Adults setting up a room | Volunteers doing something practical. Never posed. |
| `program.arabic` | image | `4/5` | `warm-grade` | 1200 | `50% 35%` | A child tracing letters on a page | Letterforms must be legible in frame. |
| `program.deen` | image | `4/5` | `warm-grade` | 1200 | `50% 30%` | Children seated in a circle, talking | Discussion, not instruction. Faces in profile is fine. |
| `program.between` | image | `5/4` | `behind-screen` | 1600 | `50% 50%` | Children between activities in a corridor | The in-between moment, literally. Slightly loose framing. |
| `program.showcase` | image | `16/9` | `cool-grade` | 2000 | `50% 40%` | A room set up for a presentation, with an audience | The Deen Showcase. Wide, from the back. |
| `calendar.milestone.showcase` | image | `1/1` | `cool-grade` | 1000 | `50% 40%` | A child standing to speak in front of others | |
| `calendar.milestone.exams` | image | `1/1` | `cool-grade` | 1000 | `50% 45%` | Papers and pencils on a desk | Objects, not faces. Exams should not look stressful. |
| `calendar.milestone.quran` | image | `1/1` | `cool-grade` | 1000 | `50% 35%` | A gathering at the front of a room | The last day of school. Warm, crowded. |
| `enroll.sunday` | image | `16/9` | `warm-grade` | 2000 | `50% 45%` | A Sunday morning in the building, wide | The single most useful photo on the site: it answers "what am I signing up for". |
| `enroll.classroom` | image | `4/5` | `warm-grade` | 1200 | `50% 35%` | A small class in progress | Six to ten children. Do not shoot an empty large room. |
| `faqs.aside` | image | `4/5` | `cool-grade` | 1200 | `50% 40%` | A child looking at something out of frame | Quiet, incidental. |
| `give.impact` | image | `21/9` | `ink-duotone` | 2400 | `50% 50%` | A full room seen from the back | Scale. This is the "your gift reaches this many people" frame. |
| `give.classroom` | image | `5/4` | `warm-grade` | 1600 | `50% 40%` | Books and materials on a shelf | What money actually buys. Objects, honest, unglamorous. |
| `contact.venue` | image | `5/4` | `cool-grade` | 1600 | `50% 50%` | The exterior of a building on a bright morning | The Islamic Education Center from the street, so a new family recognises it. |

**Placeholder sourcing rules.**

- Properly licensed free stock only (Unsplash, Pexels), stored in `public/media/placeholder/`.
- Never a photo that is recognisably a *different* institution, and never a photo with legible signage, logos or English classroom posters that contradict the setting.
- Prefer hands, objects, rooms, backs of heads and profiles over front-facing portraits of children who are not ISP students. The treatment system will carry it, and the swap will be less jarring.
- The build fails on a missing file, an image narrower than `minWidth`, a video without a poster, or an empty `alt`. That validation is what makes the registry trustworthy rather than aspirational.

**Video placeholder.** Until real footage exists, `home.hero.montage` stays `status: 'placeholder'` and the hero renders State A - the 3D field with the Window as pure light. **Do not source a stock video montage.** A stock hero video of somebody else's school is worse than no video, and the set-piece is designed to be complete without one.

---

## 16. Deliberately left to implementer judgment

Everything not on this list is specified. If you are about to make a judgment call that is not here, re-read the relevant section first.

1. **The hero entrance draw technique** (13.1). `onBeforeCompile` path-reveal is preferred; the staggered ring scale-in is an explicitly permitted fallback. Pick based on what the installed Three.js version cooperates with. Do not spend a day on it.
2. **The JotForm embed** (14.5). If it cannot be made to sit acceptably inside the frame, ship the direct link as a `.btn-primary` in the same frame. No re-asking.
3. **Exact ring count and DPR** in the Tier 1 hero. The values given are a starting point; if a mid-range phone drops below 50fps, reduce rings before reducing DPR.
4. **The grain PNG.** Any fine monochrome noise at 180x180 under 6KB is fine. Do not spend time tuning it.
5. **Stock photo selection** within the constraints in section 15. Taste applies; the treatment system will unify whatever you pick.
6. **Which FAQ sits in each of the three groups**, if `COPY.md`'s grouping does not map cleanly onto the final question set.
7. **Micro-copy on buttons that appear more than once** - use `COPY.md`'s wording; if a repeat needs a shorter label for space, shorten it rather than inventing a new phrase.

## 17. Things that will break this design

A short list of the specific failures most likely to happen with four implementers working in parallel.

- **Inventing a colour.** Every value is in section 1. A "slightly darker sienna for this one hover" is how a palette dies.
- **Reaching for a three-up card grid.** It is banned in 4.1, 7.5 and 12.4. When content comes in threes, sequence it or break the rhythm with a deliberate gap (14.1 section 6).
- **Using `--amber` as text on paper.** Use `--text-amber`.
- **Letting the pattern become wallpaper.** It appears in nine places (9.3) and nowhere else.
- **Centring everything.** The grid is ten columns so that thirds are impossible and asymmetry is the default. Centred display type appears exactly twice on this site: the footer epigraph and the 404.
- **Publishing the wrong number or any street address for ISP.** ISP's line is `(301) 929-1441` and it is publishable. The Islamic Education Center's `(301) 340-2070` is not - different organisation, different EIN. ISP has no street address at all: the P.O. Box is mail only, the residential address that third-party directories tie to ISP's number is off-limits, and the IEC's address is the venue, never "our address." Staff names do not exist. See 14.8.
- **Implementing `prefers-reduced-motion` in CSS only.** It must be checked in JS too, and it changes `uConstruction` (5.4).
- **Treating the montage and the 3D hero as alternatives.** They are one surface (13.2).









