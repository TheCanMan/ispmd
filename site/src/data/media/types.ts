/**
 * The media slot registry - DESIGN.md 15, tech plan Decision 1.
 *
 * Every photo and video position on the site is a named entry here. No
 * component references a media file path directly; everything resolves
 * through <Media slotId="..."> which reads this registry.
 *
 * The point of the indirection: aspect ratio is declared by the SLOT, not by
 * the file. When real photography arrives, swapping it in is three field
 * edits (status, src, promote realAlt to alt) and no layout changes. If a
 * real photo genuinely wants a different shape, changing `ratio` is also a
 * one-field edit and the page reflows - that is often the right move.
 *
 * The registry is split across home.ts / calendar.ts / content.ts by owning
 * agent. index.ts aggregates them and is frozen. Three agents inserting into
 * one object literal in a shared checkout is a silent clobber, not a merge
 * conflict.
 */

/** DESIGN.md 15. Supersedes the illustrative union in the tech plan. */
export type Treatment =
  | 'ink-duotone'
  | 'warm-grade'
  | 'cool-grade'
  | 'behind-screen'
  | 'raw';

export type MediaStatus = 'placeholder' | 'real';

/** One of the five ratios in DESIGN.md 1.8. No others exist on this site. */
export type Ratio = '16/9' | '21/9' | '5/4' | '4/5' | '1/1';

export interface MediaSlot {
  kind: 'image' | 'video';

  /** Enforced by the slot, never read from the file. */
  ratio: Ratio;

  /** Minimum acceptable pixel dimensions for the file (DESIGN.md 15). */
  minWidth: number;
  minHeight: number;

  treatment: Treatment;

  /** CSS object-position. */
  focal: string;

  status: MediaStatus;

  /**
   * Path under src/assets/media, resolved through import.meta.glob.
   *
   * Absent only for `home.hero.montage` while it is a placeholder: DESIGN.md
   * 15 forbids sourcing a stock video montage, and 13.2 State A renders the
   * aperture as pure light with no video element at all.
   */
  src?: string;

  /** Required for a video slot that has a src. */
  poster?: string;

  /**
   * True of the image ACTUALLY RENDERED TODAY. While status is 'placeholder'
   * the file is not a photograph of ISP, so the alt text must not say it is.
   * Shipping "Students arriving on a Sunday morning at ISP" over stock is a
   * confident falsehood told to screen-reader users.
   */
  alt: string;

  /** The intended photograph. Promoted to `alt` when status flips to 'real'. */
  realAlt?: string;

  /** Decorative or purely textural media: alt="" and role="presentation". */
  decorative?: boolean;

  /** For the hand-written shot list. Never rendered. */
  shotNote: string;
}

/**
 * Keeps the literal slot keys while widening each value to MediaSlot.
 *
 * `as const satisfies Record<string, MediaSlot>` looks equivalent and is not:
 * it narrows `status` to whichever literal every entry happens to share, so
 * `slot.status === 'real'` fails to compile with TS2367 until the first real
 * photo lands. That is precisely the query the registry exists to support.
 */
export function defineMedia<T extends Record<string, MediaSlot>>(
  slots: T
): { [K in keyof T]: MediaSlot } {
  return slots;
}

/** Aspect ratio as a number, for validation. */
export function ratioValue(ratio: Ratio): number {
  const [w, h] = ratio.split('/').map(Number);
  return w / h;
}
