/**
 * Our Story, Program, FAQs, Give and Contact media slots. DESIGN.md 15.
 *
 * OWNER: the content-pages agent. Seeded complete in Phase 1 with a committed
 * placeholder for every slot, so nothing here blocks page work. Editing
 * `focal`, `ratio` or the copy in `alt` is fair game; the files in
 * src/assets/media are not yours to replace.
 *
 * `behind-screen` is capped at one per page and two site-wide (8.4). Those
 * two are `program.between` here and `home.program.arabic` in home.ts. Do not
 * add a third.
 */

import { defineMedia } from './types.ts';

export const contentMedia = defineMedia({
  'story.opening': {
    kind: 'image',
    ratio: '21/9',
    minWidth: 2400,
    minHeight: 1029,
    treatment: 'ink-duotone',
    focal: '50% 40%',
    status: 'placeholder',
    src: 'placeholder/story-opening.jpg',
    alt: 'Two tall lit doorways in a dark wall',
    realAlt: 'A doorway with people arriving',
    shotNote: 'The first thing that happens on a Sunday.',
  },

  'story.families': {
    kind: 'image',
    ratio: '4/5',
    minWidth: 1200,
    minHeight: 1500,
    treatment: 'warm-grade',
    focal: '50% 30%',
    status: 'placeholder',
    src: 'placeholder/story-families.jpg',
    alt: 'An adult and a small child sitting together with an open picture book',
    realAlt: 'An adult and a child seated together, reading',
    shotNote:
      'The founding claim is about families, so the photo has two generations in it.',
  },

  'story.volunteers': {
    kind: 'image',
    ratio: '5/4',
    minWidth: 1600,
    minHeight: 1280,
    treatment: 'warm-grade',
    focal: '50% 45%',
    status: 'placeholder',
    src: 'placeholder/story-volunteers.jpg',
    alt: 'A volunteer handing over supplies across a table stacked with boxes',
    realAlt: 'Adults setting up a room',
    shotNote: 'Volunteers doing something practical. Never posed.',
  },

  'program.arabic': {
    kind: 'image',
    ratio: '4/5',
    minWidth: 1200,
    minHeight: 1500,
    treatment: 'warm-grade',
    focal: '50% 35%',
    status: 'placeholder',
    src: 'placeholder/program-arabic.jpg',
    alt: "A child's hand tracing letters along a ruled line on a page",
    realAlt: 'A child tracing letters on a page',
    shotNote: 'Letterforms must be legible in frame.',
  },

  'program.deen': {
    kind: 'image',
    ratio: '4/5',
    minWidth: 1200,
    minHeight: 1500,
    treatment: 'warm-grade',
    focal: '50% 30%',
    status: 'placeholder',
    src: 'placeholder/program-deen.jpg',
    alt: 'An open book on a desk, with a classroom out of focus behind it',
    realAlt: 'Children seated in a circle, talking',
    shotNote: 'Discussion, not instruction. Faces in profile is fine.',
  },

  'program.between': {
    kind: 'image',
    ratio: '5/4',
    minWidth: 1600,
    minHeight: 1280,
    treatment: 'behind-screen',
    focal: '50% 50%',
    status: 'placeholder',
    src: 'placeholder/program-between.jpg',
    alt: 'A long empty corridor with a row of windows down one side',
    realAlt: 'Children between activities in a corridor',
    shotNote: 'The in-between moment, literally. Slightly loose framing.',
  },

  'program.showcase': {
    kind: 'image',
    ratio: '16/9',
    minWidth: 2000,
    minHeight: 1125,
    treatment: 'cool-grade',
    focal: '50% 40%',
    status: 'placeholder',
    src: 'placeholder/program-showcase.jpg',
    alt: 'Rows of empty seats in a hall, seen from behind',
    realAlt: 'A room set up for a presentation, with an audience',
    shotNote: 'The Deen Showcase. Wide, from the back.',
  },

  'faqs.aside': {
    kind: 'image',
    ratio: '4/5',
    minWidth: 1200,
    minHeight: 1500,
    treatment: 'cool-grade',
    focal: '50% 40%',
    status: 'placeholder',
    src: 'placeholder/faqs-aside.jpg',
    alt: 'Someone sitting alone reading in a pool of light from a tall window',
    realAlt: 'A child looking at something out of frame',
    shotNote: 'Quiet, incidental.',
  },

  'give.impact': {
    kind: 'image',
    ratio: '21/9',
    minWidth: 2400,
    minHeight: 1029,
    treatment: 'ink-duotone',
    focal: '50% 50%',
    status: 'placeholder',
    src: 'placeholder/give-impact.jpg',
    alt: 'A theatre auditorium of empty seats seen from the stage',
    realAlt: 'A full room seen from the back',
    shotNote: 'Scale. This is the "your gift reaches this many people" frame.',
  },

  'give.classroom': {
    kind: 'image',
    ratio: '5/4',
    minWidth: 1600,
    minHeight: 1280,
    treatment: 'warm-grade',
    focal: '50% 40%',
    status: 'placeholder',
    src: 'placeholder/give-classroom.jpg',
    alt: 'A row of book spines standing on a shelf',
    realAlt: 'Books and materials on a shelf',
    shotNote: 'What money actually buys. Objects, honest, unglamorous.',
  },

  'contact.venue': {
    kind: 'image',
    ratio: '5/4',
    minWidth: 1600,
    minHeight: 1280,
    treatment: 'cool-grade',
    focal: '50% 50%',
    status: 'placeholder',
    src: 'placeholder/contact-venue.jpg',
    alt: 'The upper storeys of a plain modern building against a bright sky',
    realAlt: 'The exterior of a building on a bright morning',
    shotNote:
      'The Islamic Education Center from the street, so a new family recognises it.',
  },
});
