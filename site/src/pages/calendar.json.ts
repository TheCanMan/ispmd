/**
 * The payload the next-class island reads. Small on purpose: 33 rows of four
 * short fields, which is cheaper than shipping the calendar page's markup to
 * a script that only needs dates.
 */

import type { APIRoute } from 'astro';
import { getCalendarYear } from '../data/calendar';

export const prerender = true;

export const GET: APIRoute = async () => {
  const { year, sessions } = await getCalendarYear();

  return new Response(JSON.stringify({ year, sessions }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
