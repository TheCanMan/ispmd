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
    /* Was 'ink-duotone'. This frame is people arriving, not texture, and a
       duotone flattens faces to a single-hue wash - the opposite of what the
       school asked for. Duotone remains available for textural slots.
       Cool rather than warm: the corridor is lit by fluorescent tubes, and
       the bluer pull keeps its wood on the green axis instead of gold. */
    treatment: 'cool-grade',
    focal: '50% 45%',
    status: 'real',
    src: 'real/story-opening.jpg',
    alt: 'Illustration: a doorway with people arriving',
    realAlt: 'A doorway with people arriving',
    shotNote:
      'The first thing that happens on a Sunday. The previous placeholder here was a ' +
      'stereoscopic card (the same doorway photographed twice, side by side) that read as a ' +
      'duplicated-frame rendering bug rather than a photograph - checked for that specifically ' +
      'this time.',
  },

  'story.families': {
    kind: 'image',
    ratio: '4/5',
    minWidth: 1200,
    minHeight: 1500,
    treatment: 'warm-grade',
    focal: '50% 30%',
    status: 'real',
    src: 'real/story-families.jpg',
    alt: 'Illustration: an adult and a child seated together, reading',
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
    status: 'real',
    src: 'real/story-volunteers.jpg',
    alt: 'Illustration: adults setting up a room',
    realAlt: 'Adults setting up a room',
    shotNote: 'Volunteers doing something practical. Never posed.',
  },

  'program.arabic': {
    kind: 'image',
    ratio: '5/4',
    minWidth: 1080,
    minHeight: 864,
    treatment: 'warm-grade',
    focal: '50% 55%',
    status: 'real',
    src: 'real/program-arabic.jpg',
    alt: 'Illustration: a child tracing letters on a page',
    realAlt: 'A child tracing letters on a page',
    shotNote:
      'Letterforms must be legible in frame - but only if they are genuinely Arabic. The ' +
      'previous placeholder here showed a child writing Latin cursive under an Arabic heading, ' +
      'which is a wrong-language claim, not a stand-in. This placeholder shows blank pages ' +
      'instead: no legible text in any language, so nothing false is asserted while the slot ' +
      'waits for a real photo of a child actually tracing Arabic letters. Ratio changed from ' +
      '4/5 to 5/4 and minWidth lowered to 1080/864 to match the honest replacement - the ' +
      'available CC0 source for this content topped out at 1300px wide; raise both back once a ' +
      'higher-resolution or real photo lands.',
  },

  'program.deen': {
    kind: 'image',
    ratio: '4/5',
    minWidth: 1200,
    minHeight: 1500,
    treatment: 'warm-grade',
    focal: '50% 30%',
    status: 'real',
    src: 'real/program-deen.jpg',
    alt: 'Illustration: children seated in a circle, talking',
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
    status: 'real',
    src: 'real/program-between.jpg',
    alt: 'Illustration: children between activities in a corridor',
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
    status: 'real',
    src: 'real/program-showcase.jpg',
    alt: 'Illustration: a room set up for a presentation, with an audience',
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
    status: 'real',
    src: 'real/faqs-aside.jpg',
    alt: 'Illustration: a child looking at something out of frame',
    realAlt: 'A child looking at something out of frame',
    shotNote: 'Quiet, incidental.',
  },

  'give.impact': {
    kind: 'image',
    ratio: '21/9',
    minWidth: 2400,
    minHeight: 1029,
    /* Was 'ink-duotone'. A full room of people is a subject too. */
    treatment: 'cool-grade',
    focal: '50% 55%',
    status: 'real',
    src: 'real/give-impact.jpg',
    alt: 'Illustration: a full room seen from the back',
    realAlt: 'A full room seen from the back',
    shotNote:
      'Scale. This is the "your gift reaches this many people" frame - but it has to read as ' +
      'modest scale, not grand scale. The previous placeholder here was the Hollywood Pantages, ' +
      'an ornate Art Deco movie palace, directly above copy that says there is no endowment and ' +
      'no marketing budget. This placeholder is a plain multi-purpose hall with stacking chairs: ' +
      'restraint over subject-matter literalism. Do not source a grand auditorium, theatre or ' +
      'anything ornate for this slot, whatever the real photo ends up being.',
  },

  'give.classroom': {
    kind: 'image',
    ratio: '5/4',
    minWidth: 1600,
    minHeight: 1280,
    treatment: 'warm-grade',
    focal: '50% 40%',
    status: 'real',
    src: 'real/give-classroom.jpg',
    alt: 'Illustration: books and materials on a shelf',
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
    status: 'real',
    src: 'real/contact-venue.jpg',
    alt: 'Illustration: an ordinary room, seen in morning light',
    realAlt: 'An ordinary room, seen in morning light',
    shotNote:
      'This slot sits directly beside the IEC street address, so a photo here reads as "this ' +
      'is that building" to any sighted visitor - a real risk given how carefully the rest of ' +
      'the site handles the two-organisation problem. The previous placeholder was a generic ' +
      'office block that asserted exactly that. Do not source an exterior "the IEC from the ' +
      'street" photo unless it is verified to actually be the Islamic Education Center - a wrong ' +
      'specific building is worse than a neutral room. This placeholder is deliberately an ' +
      'interior with no identifying architecture. If no verified photo of the real building ever ' +
      'arrives, dropping this slot entirely is preferable to guessing.',
  },
});
