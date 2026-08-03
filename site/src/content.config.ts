import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

/**
 * The academic calendar.
 *
 * `loader:` is load-bearing, not stylistic. `defineCollection({ type: 'data' })`
 * is the legacy API: on Astro 7 it does not error, it returns ZERO ENTRIES and
 * the build exits 0. That produces an empty calendar page, an empty .ics and a
 * next-class island with no data, on the one surface families cannot get from
 * the current site at all - and it produces them silently.
 *
 * src/data/calendar.ts carries the non-empty assertion that turns the residual
 * risk into a loud build failure.
 */
const calendar = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/calendar' }),
  schema: z.object({
    year: z.string(),
    sessions: z
      .array(
        z.object({
          date: z.string().date(),
          kind: z.enum(['class', 'no-school', 'milestone']),
          title: z.string().min(1),
          note: z.string().optional(),
          semester: z.union([z.literal(1), z.literal(2)]),
        })
      )
      .min(1)
      /**
       * The school meets on Sundays and only on Sundays. A transcription slip
       * of one day is invisible in a list of 33 dates and very visible to a
       * parent who drives to a closed building, so it fails the build.
       */
      .refine(
        (sessions) =>
          sessions.every((s) => new Date(`${s.date}T12:00:00Z`).getUTCDay() === 0),
        { message: 'Every session date must fall on a Sunday.' }
      )
      .refine(
        (sessions) => new Set(sessions.map((s) => s.date)).size === sessions.length,
        { message: 'Two sessions share a date.' }
      ),
  }),
});

export const collections = { calendar };
