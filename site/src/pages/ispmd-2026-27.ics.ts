/**
 * The downloadable academic calendar.
 *
 * Class start is confirmed at 10:00 AM, so DTSTART;TZID=America/New_York is
 * legitimate. The END is not confirmed and moves through the year, because
 * class runs "until Salat al-Dhuhr". So this emits DURATION:PT2H30M with a
 * DESCRIPTION saying so, rather than asserting a hard DTEND the school has
 * never published.
 *
 * No-school Sundays ship as all-day events. COPY.md promises "all thirty-three
 * Sundays in it", and a parent who has the eight off-Sundays in their calendar
 * is exactly as well served as one who has the twenty-five class days.
 */

import type { APIRoute } from 'astro';
import { getCalendarYear, type Session } from '../data/calendar';

export const prerender = true;

/** Fixed so the file is byte-stable across builds rather than churning. */
const DTSTAMP = '20260803T000000Z';

const CLASS_DESCRIPTION =
  'Class begins at 10:00 AM and runs until Salat al-Dhuhr, so the exact ' +
  'finishing time shifts through the year. Classes are held at the Islamic ' +
  'Education Center, 7917 Montrose Rd, Potomac, MD 20854. The Islamic School ' +
  'of Potomac is a separate organization and meets there.';

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
  ];

  if (session.kind === 'no-school') {
    lines.push(
      `DTSTART;VALUE=DATE:${compact(session.date)}`,
      `DTEND;VALUE=DATE:${compact(addDay(session.date))}`,
      'TRANSP:TRANSPARENT',
      fold(`DESCRIPTION:${escapeText('No class this Sunday. The full calendar is at ' + site + 'calendar')}`)
    );
  } else {
    const description = session.note
      ? `${session.note}. ${CLASS_DESCRIPTION}`
      : CLASS_DESCRIPTION;
    lines.push(
      `DTSTART;TZID=America/New_York:${compact(session.date)}T100000`,
      'DURATION:PT2H30M',
      fold(`DESCRIPTION:${escapeText(description)}`),
      fold(
        `LOCATION:${escapeText('Islamic Education Center, 7917 Montrose Rd, Potomac, MD 20854')}`
      )
    );
  }

  lines.push('END:VEVENT');
  return lines;
}

/**
 * Clients that honour TZID want the zone defined in the file. These are the
 * post-2007 US rules: DST starts the second Sunday in March, ends the first
 * Sunday in November.
 */
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:America/New_York',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:-0500',
  'TZOFFSETTO:-0400',
  'TZNAME:EDT',
  'DTSTART:20070311T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:-0400',
  'TZOFFSETTO:-0500',
  'TZNAME:EST',
  'DTSTART:20071104T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

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
    'X-WR-TIMEZONE:America/New_York',
    ...VTIMEZONE,
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
