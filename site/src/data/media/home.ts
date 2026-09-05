/**
 * Homepage media slots. DESIGN.md 15.
 *
 * OWNER: the homepage agent. Do not add entries for other pages here.
 */

import { defineMedia } from './types.ts';

export const homeMedia = defineMedia({
  /**
   * 13.2 - the Window. State B: the montage is live.
   *
   * DESIGN.md 15 forbids a stock montage of somebody else's school, and that
   * still holds. This is not stock: it is footage generated for this project,
   * which is a different thing from a library clip of strangers - but it is
   * also NOT a recording of the Islamic School of Potomac, and nothing in the
   * markup claims otherwise. The element is decorative and aria-hidden, so it
   * makes no assertion to a screen reader at all.
   *
   * treatment is 'raw' rather than a grade because the grade is baked into
   * the ENCODE (scripts/build-montage.mjs lifts gamma and saturation, taking
   * mean Y from 95.9 to 121.8). Layering a CSS grade on top would process the
   * footage twice and put back the dimness the lift just removed. The
   * ink-duotone this slot used to specify was written for a bistre palette;
   * on green it crushes colour footage into a single dark wash, which is the
   * opposite of what the school asked for.
   */
  'home.hero.montage': {
    kind: 'video',
    ratio: '16/9',
    minWidth: 1280,
    minHeight: 720,
    treatment: 'raw',
    focal: '50% 40%',
    status: 'real',
    provenance: 'generated',
    src: 'real/hero-montage.mp4',
    poster: 'real/hero-montage-poster.jpg',
    decorative: true,
    alt: '',
    shotNote:
      'GENERATED FOOTAGE, not ISP. Two 10s clips crossfaded into an 18.5s ' +
      'seamless loop, 1280x720. Replace with real footage when it exists: ' +
      'arrival at the door, a classroom from the back, a child reading aloud, ' +
      'parents talking in a hallway. No faces held longer than 1.5s.',
  },

  'home.community.wide': {
    kind: 'image',
    ratio: '21/9',
    minWidth: 2400,
    minHeight: 1029,
    treatment: 'warm-grade',
    focal: '50% 45%',
    status: 'real',
    provenance: 'generated',
    src: 'real/home-community-wide.jpg',
    alt: 'Illustration: a room of children and adults together, seen wide',
    realAlt: 'A room of children and adults together, seen wide',
    shotNote:
      'The whole community in one frame. Shoot from a doorway, not from the front of the room.',
  },

  'home.program.arabic': {
    kind: 'image',
    ratio: '4/5',
    minWidth: 1200,
    minHeight: 1500,
    treatment: 'behind-screen',
    focal: '50% 35%',
    status: 'real',
    provenance: 'generated',
    src: 'real/home-program-arabic.jpg',
    alt: 'Illustration: hands and an open book on a table',
    realAlt: 'Hands and an open book on a table',
    shotNote: 'Close, top-down or over-shoulder. Hands and page only.',
  },

  'home.calendar.room': {
    kind: 'image',
    ratio: '5/4',
    minWidth: 1600,
    minHeight: 1280,
    treatment: 'cool-grade',
    focal: '50% 50%',
    status: 'real',
    provenance: 'generated',
    src: 'real/home-calendar-room.jpg',
    alt: 'Illustration: an empty classroom with chairs set out',
    realAlt: 'An empty classroom with chairs set out',
    shotNote: 'Before class. Empty rooms read as anticipation.',
  },
});
