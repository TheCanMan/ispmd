/**
 * The site's motion system. DESIGN.md 5.
 *
 * GSAP, ScrollTrigger, SplitText, DrawSVG and Lenis are registered exactly
 * once here and imported from here everywhere else.
 *
 * Four named entrance patterns cover every animated element on this site and
 * nothing else is invented:
 *
 *   line-rise   display and title text, split into lines
 *   body-rise   paragraphs, buttons, small blocks
 *   tile-in     anything in a grid, staggered along a 36-degree vector
 *   strap-draw  dividers, underlines, the rosette, the footer lattice
 *
 * Reduced motion is a second design, not a fallback (5.4). It is checked in
 * JS as well as CSS, and re-checked on change: a CSS-only implementation is
 * explicitly not acceptable, because it cannot stop Lenis or the render loop.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };

/** 6 - the tokens, mirrored for JS. Keep in step with global.css. */
export const DUR = {
  instant: 0.12,
  fast: 0.22,
  base: 0.32,
  slow: 0.62,
  reveal: 0.9,
  draw: 1.9,
} as const;

export const EASE = {
  out: 'expo.out',
  entrance: 'power4.out',
  inOut: 'power2.inOut',
  exit: 'power2.in',
} as const;

export const STAGGER = 0.055;
export const STAGGER_SLOW = 0.09;
export const RISE = 24;

const reduceQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

export function prefersReducedMotion(): boolean {
  return reduceQuery?.matches ?? false;
}

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

/**
 * Orders elements along a 36-degree vector from the top-left of their grid,
 * so the grid fills at the pattern's own angle rather than row by row. It is
 * a small thing and it is the difference between a grid animation and this
 * site's grid animation (5.2 C).
 */
export function orderAlongPatternVector(elements: Element[]): Element[] {
  if (elements.length === 0) return elements;

  const boxes = elements.map((el) => {
    const r = el.getBoundingClientRect();
    return { el, x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });

  const originX = Math.min(...boxes.map((b) => b.x));
  const originY = Math.min(...boxes.map((b) => b.y));

  const a = (36 * Math.PI) / 180;
  const dir = { x: Math.cos(a), y: Math.sin(a) };

  return boxes
    .sort(
      (p, q) =>
        (p.x - originX) * dir.x + (p.y - originY) * dir.y -
        ((q.x - originX) * dir.x + (q.y - originY) * dir.y)
    )
    .map((b) => b.el);
}

/**
 * SplitText's `mask: "lines"` sizes each line's clip to the LINE BOX, and this
 * site sets line-heights below 1 (--lh-hero 0.92, --lh-title 1.06). Descenders
 * and the deeper italic forms fall outside and are shaved off.
 *
 * Measured at rest with the entrance complete, glyph pixels destroyed:
 *
 *              margin 0     0.06em   0.10em   0.14em
 *   /our-story  714          392      164        0
 *   /faqs       152           84       34        0
 *   /  hero      30            0        0        0
 *
 * 0.18em is 0.14 plus a little headroom. It is deliberately NOT larger: the
 * clip is also what stops a still-rising line painting over the paragraph
 * beneath it, so every extra em is spill during the scroll-in.
 *
 * overflow-clip-margin expands the clip WITHOUT touching layout, which is what
 * makes this safe between stacked lines - padding and a negative margin would
 * perturb the box model instead.
 */
const CLIP_MARGIN_EM = 0.18;

export function openMasks(lines: Element[]): void {
  const supported =
    typeof CSS !== 'undefined' && CSS.supports?.('overflow-clip-margin', '1px');

  for (const line of lines) {
    const mask = (line as HTMLElement).parentElement;
    if (!mask) continue;
    if (supported) {
      mask.style.overflowClipMargin = `${CLIP_MARGIN_EM}em`;
    } else {
      /* Pre-Safari-16. Losing the reveal edge on that line is a far smaller
         loss than shaving the glyphs. */
      mask.style.overflow = 'visible';
    }
  }
}

/**
 * Far enough that the line's ink starts fully below its own clip region.
 * 5.2's flat `yPercent: 108` assumed the clip equalled the line box; with the
 * clip opened it needs a little more, and computing it per line keeps it right
 * for every type role and every breakpoint rather than per-role constants.
 */
export function maskedTravel(line: Element): number {
  const el = line as HTMLElement;
  const mask = el.parentElement;
  const height = mask?.offsetHeight ?? el.offsetHeight;
  const fontSize = parseFloat(getComputedStyle(el).fontSize) || 0;
  return height + 2 * CLIP_MARGIN_EM * fontSize;
}

/** A. line-rise. Split into lines, each inside its own overflow: hidden box. */
export function lineRise(target: HTMLElement, trigger?: Element) {
  const split = new SplitText(target, {
    type: 'lines',
    linesClass: 'split-line',
    /* Without a wrapper the mask cannot clip; SplitText's own masking keeps
       the DOM cheaper than hand-wrapping. */
    mask: 'lines',
    /*
     * SplitText's default (aria: "auto") puts aria-hidden on every split line
     * and an aria-label on the element itself. On a <p> or a <div> - which
     * have no implicit ARIA role - aria-label is PROHIBITED, and axe flags it
     * as serious on every headline the entrance touches.
     *
     * "none" leaves aria alone entirely. The split lines still hold the real
     * text nodes and are read in order, which is why the deliberate space
     * before each <br> matters: it is what keeps the reading "We don't give
     * homework" rather than "givehomework".
     */
    aria: 'none',
  });

  openMasks(split.lines);

  /* The element itself is hidden by .js-motion until its entrance is wired,
     so a script that never loads cannot leave text invisible. */
  gsap.set(target, { opacity: 1 });

  /* fromTo, not from: the CSS start state is opacity 0, so a `from` tween
     would animate back to 0 and leave the line hidden forever. */
  return gsap.fromTo(
    split.lines,
    { y: (_i: number, el: Element) => maskedTravel(el), rotate: 1.4 },
    {
      y: 0,
      rotate: 0,
      duration: DUR.reveal,
      ease: EASE.out,
      stagger: STAGGER,
      scrollTrigger: { trigger: trigger ?? target, start: 'top 78%', once: true },
    }
  );
}

/** B. body-rise. */
export function bodyRise(targets: Element | Element[], trigger?: Element) {
  const list = Array.isArray(targets) ? targets : [targets];
  return gsap.fromTo(
    list,
    { y: RISE, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: DUR.reveal,
      ease: EASE.entrance,
      stagger: STAGGER,
      scrollTrigger: { trigger: trigger ?? list[0], start: 'top 78%', once: true },
    }
  );
}

/** C. tile-in, ordered along the 36-degree vector. */
export function tileIn(targets: Element[], trigger?: Element) {
  const ordered = orderAlongPatternVector(targets);
  return gsap.fromTo(
    ordered,
    { scale: 0.94, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: DUR.base,
      ease: EASE.out,
      stagger: STAGGER,
      scrollTrigger: { trigger: trigger ?? ordered[0], start: 'top 78%', once: true },
    }
  );
}

/**
 * D. strap-draw, ordered by each path's distance from a declared origin so
 * the pattern grows outward rather than left to right.
 */
export function strapDraw(paths: SVGElement[], origin: { x: number; y: number } = { x: 0, y: 0 }, trigger?: Element) {
  const ordered = [...paths].sort((p, q) => {
    const pb = (p as SVGGraphicsElement).getBBox();
    const qb = (q as SVGGraphicsElement).getBBox();
    const pd = Math.hypot(pb.x + pb.width / 2 - origin.x, pb.y + pb.height / 2 - origin.y);
    const qd = Math.hypot(qb.x + qb.width / 2 - origin.x, qb.y + qb.height / 2 - origin.y);
    return pd - qd;
  });

  return gsap.fromTo(
    ordered,
    { drawSVG: '0%' },
    {
      drawSVG: '100%',
      duration: DUR.draw,
      ease: EASE.out,
      stagger: STAGGER,
      scrollTrigger: { trigger: trigger ?? ordered[0], start: 'top 78%', once: true },
    }
  );
}

let started = false;

/**
 * Wires every [data-motion] element on the page and starts Lenis.
 *
 * Safe to call more than once; the second call is a no-op.
 */
export function initMotion(): void {
  if (started || typeof window === 'undefined') return;
  started = true;

  const reveal = () => document.documentElement.classList.remove('js-motion');

  if (prefersReducedMotion()) {
    /* 5.4 - the end state is SET, never skipped. Nothing is left hidden and
       nothing animates. Lenis is not created at all. */
    reveal();
    wireDividersStatic();
    return;
  }

  lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  reveal();

  /*
   * An element uses its nearest [data-motion-group] as its ScrollTrigger, so a
   * whole section enters together. That also closes a real trap: the hero's
   * buttons sat at y=728 in a 900px viewport, past the `top 78%` start, so they
   * stayed at opacity 0 until the visitor scrolled - content above the fold
   * waiting on a scroll it may never receive. Triggering on the section means
   * anything inside a group that is on screen at load animates at load.
   */
  const groupOf = (el: Element) => el.closest('[data-motion-group]') ?? undefined;

  for (const el of document.querySelectorAll<HTMLElement>('[data-motion="line-rise"]')) {
    lineRise(el, groupOf(el));
  }

  for (const el of document.querySelectorAll<HTMLElement>('[data-motion="body-rise"]')) {
    bodyRise(el, groupOf(el));
  }

  /* Tiles are grouped by their nearest [data-stagger-vector] container so the
     36-degree ordering is computed per grid, not across the whole page. */
  const groups = new Map<Element, Element[]>();
  for (const el of document.querySelectorAll<HTMLElement>('[data-motion="tile-in"]')) {
    const group = el.closest('[data-stagger-vector]') ?? el.parentElement ?? document.body;
    groups.set(group, [...(groups.get(group) ?? []), el]);
  }
  for (const [group, tiles] of groups) tileIn(tiles, group);

  wireDividers();

  /* 5.4 - re-check on change. Someone who turns reduced motion on mid-session
     gets the still site immediately rather than at the next navigation. */
  reduceQuery?.addEventListener('change', (event) => {
    if (!event.matches) return;
    lenis?.destroy();
    lenis = null;
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
    gsap.globalTimeline.progress(1);
  });
}

function wireDividers(): void {
  for (const divider of document.querySelectorAll<HTMLElement>('[data-divider]')) {
    const straps = Array.from(divider.querySelectorAll<SVGElement>('[data-divider-strap]'));
    const rule = divider.querySelector<HTMLElement>('[data-divider-rule]');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: divider, start: 'top 78%', once: true },
    });

    if (rule) {
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: DUR.reveal, ease: EASE.out }, 0);
    }
    if (straps.length) {
      tl.fromTo(
        straps,
        { drawSVG: '0%' },
        { drawSVG: '100%', duration: DUR.reveal, ease: EASE.out, stagger: STAGGER },
        0
      );
    }
  }
}

/** Under reduced motion the divider is simply already drawn. */
function wireDividersStatic(): void {
  for (const divider of document.querySelectorAll<HTMLElement>('[data-divider]')) {
    const rule = divider.querySelector<HTMLElement>('[data-divider-rule]');
    if (rule) rule.style.transform = 'scaleX(1)';
  }
}
