/**
 * Homepage media slots. DESIGN.md 15.
 *
 * OWNER: the homepage agent. Do not add entries for other pages here.
 */

import { defineMedia } from './types.ts';

export const homeMedia = defineMedia({
  /**
   * 13.2 - the Window. The hero montage and the 3D set-piece are the same
   * surface, not alternatives. While this slot is a placeholder the hero
   * renders State A: no video element, no poster, the aperture is simply
   * where the light comes through. DESIGN.md 15 is explicit that a stock
   * video montage of somebody else's school is worse than no video, so
   * there is deliberately no file here.
   */
  'home.hero.montage': {
    kind: 'video',
    ratio: '16/9',
    minWidth: 2400,
    minHeight: 1350,
    treatment: 'ink-duotone',
    focal: '50% 40%',
    status: 'placeholder',
    decorative: true,
    alt: '',
    shotNote:
      '8-12s of cut coverage, wide, natural light: arrival at the door, a classroom from the back, a child reading aloud, parents talking in a hallway. No faces held longer than 1.5s.',
  },

  'home.community.wide': {
    kind: 'image',
    ratio: '21/9',
    minWidth: 2400,
    minHeight: 1029,
    treatment: 'warm-grade',
    focal: '50% 45%',
    status: 'placeholder',
    src: 'placeholder/home-community-wide.jpg',
    alt: 'People working together around a table covered with paper and pens, seen wide',
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
    status: 'placeholder',
    src: 'placeholder/home-program-arabic.jpg',
    alt: 'A hand resting on an open book on a table',
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
    status: 'placeholder',
    src: 'placeholder/home-calendar-room.jpg',
    alt: 'An empty classroom of wooden desks and benches beneath tall windows',
    realAlt: 'An empty classroom with chairs set out',
    shotNote: 'Before class. Empty rooms read as anticipation.',
  },
});
