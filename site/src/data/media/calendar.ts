/**
 * Calendar and Enroll media slots. DESIGN.md 15.
 *
 * OWNER: the calendar / enroll agent. Seeded complete in Phase 1 with a
 * committed placeholder for every slot, so nothing here blocks page work.
 * Editing `focal`, `ratio` or the copy in `alt` is fair game; the files in
 * src/assets/media are not yours to replace.
 */

import { defineMedia } from './types.ts';

export const calendarMedia = defineMedia({
  'calendar.milestone.showcase': {
    kind: 'image',
    ratio: '1/1',
    minWidth: 1000,
    minHeight: 1000,
    treatment: 'cool-grade',
    focal: '50% 40%',
    status: 'placeholder',
    src: 'placeholder/calendar-milestone-showcase.jpg',
    alt: 'A microphone on a stand in a bright room',
    realAlt: 'A child standing to speak in front of others',
    shotNote: '',
  },

  'calendar.milestone.exams': {
    kind: 'image',
    ratio: '1/1',
    minWidth: 1000,
    minHeight: 1000,
    treatment: 'cool-grade',
    focal: '50% 45%',
    status: 'placeholder',
    src: 'placeholder/calendar-milestone-exams.jpg',
    alt: 'A pencil and shavings on a lined notebook',
    realAlt: 'Papers and pencils on a desk',
    shotNote: 'Objects, not faces. Exams should not look stressful.',
  },

  'calendar.milestone.quran': {
    kind: 'image',
    ratio: '1/1',
    minWidth: 1000,
    minHeight: 1000,
    treatment: 'cool-grade',
    focal: '50% 35%',
    status: 'placeholder',
    src: 'placeholder/calendar-milestone-quran.jpg',
    alt: 'A long table laid with cloth, flowers and place settings for an event',
    realAlt: 'A gathering at the front of a room',
    shotNote: 'The last day of school. Warm, crowded.',
  },

  'enroll.sunday': {
    kind: 'image',
    ratio: '16/9',
    minWidth: 2000,
    minHeight: 1125,
    treatment: 'warm-grade',
    focal: '50% 45%',
    status: 'placeholder',
    src: 'placeholder/enroll-sunday.jpg',
    alt: 'An empty mirrored studio with a wooden floor and a ballet barre',
    realAlt: 'A Sunday morning in the building, wide',
    shotNote:
      'The single most useful photo on the site: it answers "what am I signing up for".',
  },

  'enroll.classroom': {
    kind: 'image',
    ratio: '4/5',
    minWidth: 1200,
    minHeight: 1500,
    treatment: 'warm-grade',
    focal: '50% 35%',
    status: 'placeholder',
    src: 'placeholder/enroll-classroom.jpg',
    alt: 'A small group seated around a table, working on paper',
    realAlt: 'A small class in progress',
    shotNote: 'Six to ten children. Do not shoot an empty large room.',
  },
});
