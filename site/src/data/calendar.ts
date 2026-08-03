/**
 * The one way to read the calendar collection.
 *
 * Everything that touches calendar data goes through here so the non-empty
 * assertion runs on every build. A silently empty collection has to fail as
 * loudly as a missing image does; see the note in content.config.ts.
 */

import { getCollection } from 'astro:content';

export type SessionKind = 'class' | 'no-school' | 'milestone';

export interface Session {
  /** ISO date, always a Sunday. */
  date: string;
  kind: SessionKind;
  title: string;
  note?: string;
  semester: 1 | 2;
}

export interface CalendarYear {
  /** e.g. "2026-2027" */
  year: string;
  sessions: Session[];
}

let cached: CalendarYear | null = null;

export async function getCalendarYear(): Promise<CalendarYear> {
  if (cached) return cached;

  const entries = await getCollection('calendar');

  if (entries.length === 0) {
    throw new Error(
      'The "calendar" collection is empty. Every calendar surface on this site - the ' +
        'calendar page, the homepage band, the next-class island and the .ics download - ' +
        'would render blank and the build would still pass. Check that ' +
        'src/content/calendar/*.json exists and that content.config.ts uses a glob loader.'
    );
  }

  const entry = entries.find((e) => e.id === '2026-2027') ?? entries[0];
  const data = entry.data as CalendarYear;

  if (!data.sessions?.length) {
    throw new Error(`Calendar year "${entry.id}" has no sessions.`);
  }

  cached = {
    year: data.year,
    sessions: [...data.sessions].sort((a, b) => a.date.localeCompare(b.date)),
  };

  return cached;
}

/** Sessions on which the school actually meets: class plus milestone days. */
export function instructionalSessions(sessions: Session[]): Session[] {
  return sessions.filter((s) => s.kind !== 'no-school');
}

export function sessionsBySemester(sessions: Session[], semester: 1 | 2): Session[] {
  return sessions.filter((s) => s.semester === semester);
}

/** 7.7 - Ramadan classes carry an annotation at the cell's bottom edge. */
export function isRamadan(session: Session): boolean {
  return session.note === 'Ramadan';
}
