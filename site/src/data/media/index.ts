/**
 * The aggregated media slot registry.
 *
 * FROZEN. This file was written once in Phase 1 with all three imports
 * pre-wired and is not edited again. Add slots to home.ts, calendar.ts or
 * content.ts - whichever your pages own - and they appear here automatically.
 *
 * The split exists because three agents inserting into the interior of one
 * object literal, in one checkout, at the same anchor is not a merge conflict.
 * The second writer silently wins and one set of entries vanishes with no
 * error at all.
 */

import type { MediaSlot } from './types.ts';
import { homeMedia } from './home.ts';
import { calendarMedia } from './calendar.ts';
import { contentMedia } from './content.ts';

const parts = [homeMedia, calendarMedia, contentMedia] as const;

/**
 * A duplicated id across two files would be silently overwritten by the
 * spread below - the exact failure the split was made to prevent. Fail loudly
 * at build time instead.
 */
const seen = new Set<string>();
for (const part of parts) {
  for (const id of Object.keys(part)) {
    if (seen.has(id)) {
      throw new Error(
        `Media slot "${id}" is defined in more than one file under src/data/media. ` +
          `Slot ids are global; pick a different one.`
      );
    }
    seen.add(id);
  }
}

export const media = {
  ...homeMedia,
  ...calendarMedia,
  ...contentMedia,
} as Record<string, MediaSlot> & typeof homeMedia & typeof calendarMedia & typeof contentMedia;

export type SlotId = keyof typeof homeMedia | keyof typeof calendarMedia | keyof typeof contentMedia;

export function getSlot(id: SlotId | string): MediaSlot {
  const slot = media[id as SlotId];
  if (!slot) {
    throw new Error(
      `Unknown media slot "${id}". Slots are declared in src/data/media/{home,calendar,content}.ts.`
    );
  }
  return slot;
}

export type { MediaSlot, Treatment, MediaStatus, Ratio } from './types.ts';
export { ratioValue } from './types.ts';
