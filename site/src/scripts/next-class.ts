/**
 * Which Sunday is next, computed against the VISITOR's clock.
 *
 * This is a client-side island on purpose. A static site that bakes "next
 * class" at build time is wrong by the following Sunday and there is no
 * scheduled rebuild. The full calendar renders statically; this only ever
 * decorates readable content, so a visitor with a wrong clock gets a wrong
 * highlight over a correct list rather than a blank page.
 *
 * Three corrections that are easy to get wrong and expensive when wrong:
 *
 * 1. TIMEZONE. `new Date('2026-09-13')` parses as UTC midnight, so a parent in
 *    Maryland at 8pm on Saturday would be told the class had already passed.
 *    Today's date is resolved through Intl in America/New_York and then
 *    compared as a string, which keeps timezones out of the arithmetic
 *    entirely.
 *
 * 2. END OF DAY. Classes run "until Salat al-Dhuhr", which moves through the
 *    year, so no fixed end time exists. A session counts as current through
 *    the end of its local day. That degrades in the safe direction: showing
 *    today's class all day beats retiring it at a guessed hour.
 *
 * 3. THE YEAR ENDS. On 2027-05-17 there is no future session. This buys
 *    correctness within a published year - nine months, not forever - so the
 *    ended state is a first-class result, never a stale date and never blank.
 */

export type SessionKind = 'class' | 'no-school' | 'milestone';

export interface Session {
  date: string;
  kind: SessionKind;
  title: string;
  note?: string;
  semester: 1 | 2;
}

export type NextClassState =
  | {
      state: 'upcoming';
      session: Session;
      daysAway: number;
      /** COPY.md, Calendar section 2. */
      daysLine: string;
    }
  | {
      state: 'after-break';
      session: Session;
      daysAway: number;
      daysLine: string;
      /** The no-school Sunday immediately before the next class. */
      offSession: Session;
      offLine: string;
    }
  | { state: 'ended' };

const TIME_ZONE = 'America/New_York';

/** Today in America/New_York as YYYY-MM-DD. en-CA formats as ISO. */
export function todayInSchoolTime(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** Whole days between two ISO dates. Pure calendar arithmetic, no timezone. */
export function daysBetween(fromISO: string, toISO: string): number {
  const [fy, fm, fd] = fromISO.split('-').map(Number);
  const [ty, tm, td] = toISO.split('-').map(Number);
  const MS_PER_DAY = 86_400_000;
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / MS_PER_DAY);
}

export function daysLineFor(daysAway: number): string {
  if (daysAway === 0) return 'That is today.';
  if (daysAway === 1) return 'That is 1 day from today.';
  return `That is ${daysAway} days from today.`;
}

export function resolveNextClass(sessions: Session[], today = todayInSchoolTime()): NextClassState {
  const upcoming = sessions
    .filter((s) => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const nextClass = upcoming.find((s) => s.kind !== 'no-school');
  if (!nextClass) return { state: 'ended' };

  const daysAway = daysBetween(today, nextClass.date);
  const daysLine = daysLineFor(daysAway);

  /* If the very next dated Sunday is a no-school day, name it rather than
     letting a parent wonder why the highlighted date is two weeks out. */
  const nextAny = upcoming[0];
  if (nextAny && nextAny.kind === 'no-school') {
    const offSession = [...upcoming]
      .filter((s) => s.kind === 'no-school' && s.date < nextClass.date)
      .pop()!;
    return {
      state: 'after-break',
      session: nextClass,
      daysAway,
      daysLine,
      offSession,
      offLine: `The Sunday before is off: ${offSession.title}.`,
    };
  }

  return { state: 'upcoming', session: nextClass, daysAway, daysLine };
}

/** "September 13, 2026" - the format COPY.md uses throughout. */
export function formatSessionDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** "SEP" / "13" for a calendar cell (7.7). */
export function cellParts(iso: string): { month: string; day: string } {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return {
    month: new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short' })
      .format(date)
      .toUpperCase(),
    day: String(d),
  };
}
