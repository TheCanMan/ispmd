/**
 * The downloadable academic calendar.
 *
 * Class start is confirmed at 10:00 AM, but the END is not confirmed and
 * moves through the year because class runs "until Salat al-Dhuhr". Calendar
 * clients turn any duration into a precise end time, so all 33 Sundays are
 * date-only events. The confirmed start and variable close remain explicit in
 * the class-day description without becoming a false time block.
 *
 * No-school Sundays use their own description and never inherit class times or
 * venue details. COPY.md promises "all thirty-three Sundays in it", and a
 * parent who has the eight off-Sundays is as well served as one who has the
 * twenty-five class days.
 */

import type { APIRoute } from 'astro';
import { getCalendarYear, type Session } from '../data/calendar';

export const prerender = true;

/** Fixed so the file is byte-stable across builds rather than churning. */
const DTSTAMP = '20260803T000000Z';

const CLASS_DESCRIPTION =
  'Class begins at 10:00 AM and runs until Salat al-Dhuhr, so the exact ' +
  'finishing time shifts through the year. Classes are held at the Islamic ' +
  'Education Center, 7917 Montrose Rd, Potomac, MD 20854.';

/**
 * RFC 5545 line folding at 75 octets. Long DESCRIPTION lines are the usual
 * reason an .ics silently fails to import.
 */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(' ' + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) parts.push(' ' + rest);
  return parts.join('\r\n');
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

const compact = (iso: string) => iso.replace(/-/g, '');

function addDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return next.toISOString().slice(0, 10);
}

function summaryFor(session: Session): string {
  if (session.kind === 'no-school') return `No school: ${session.title}`;
  if (session.title === 'Class') return 'Islamic School of Potomac';
  return session.title;
}

function eventFor(session: Session, site: string): string[] {
  const uid = `${session.date}-isp@ispmd.org`;
  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${DTSTAMP}`,
    `SUMMARY:${escapeText(summaryFor(session))}`,
    `URL:${site}calendar`,
    `DTSTART;VALUE=DATE:${compact(session.date)}`,
    `DTEND;VALUE=DATE:${compact(addDay(session.date))}`,
  ];

  if (session.kind === 'no-school') {
    lines.push(
      'TRANSP:TRANSPARENT',
      fold(`DESCRIPTION:${escapeText('No class this Sunday. The full calendar is at ' + site + 'calendar')}`)
    );
  } else {
    const description = session.note
      ? `${session.note}. ${CLASS_DESCRIPTION}`
      : CLASS_DESCRIPTION;
    lines.push(
      fold(`DESCRIPTION:${escapeText(description)}`),
      fold(
        `LOCATION:${escapeText('Islamic Education Center, 7917 Montrose Rd, Potomac, MD 20854')}`
      )
    );
  }

  lines.push('END:VEVENT');
  return lines;
}

export const GET: APIRoute = async ({ site }) => {
  const { year, sessions } = await getCalendarYear();
  const base = site ? site.href : 'https://ispmd.pages.dev/';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Islamic School of Potomac//Academic Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Islamic School of Potomac ${year}`,
    ...sessions.flatMap((session) => eventFor(session, base)),
    'END:VCALENDAR',
  ];

  return new Response(lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="ispmd-${year}.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
