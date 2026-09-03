/**
 * Every publishable fact about the school, in one place.
 *
 * Nothing here is retyped anywhere else on the site. A phone number that
 * exists in one constant cannot be got wrong on page six.
 *
 * ------------------------------------------------------------------------
 * THE TWO ORGANIZATIONS
 *
 * The Islamic School of Potomac and the Islamic Education Center are legally
 * separate 501(c)(3)s with different EINs. ISP MEETS AT the IEC. It does not
 * own that building and is not that organization.
 *
 *   - ISP's phone is (301) 929-1441 and it is the ONLY telephone number that
 *     appears anywhere on this site, including structured data.
 *   - The IEC's number, (301) 340-2070, must never appear. Publishing it as
 *     the school's number routes parents to a different organization.
 *   - ISP has NO street address of its own. The P.O. Box is mail and
 *     donations only. Third-party directories tie ISP's number to a
 *     residential address in Rockville; the number was cleared for
 *     publication and the address was not, in any form, including JSON-LD
 *     and Open Graph tags.
 *   - The IEC address below is the VENUE. Copy says "classes are held at",
 *     never "our address", never "visit us at".
 *
 * See DESIGN.md 14.8 and 17, and COPY.md "Facts this copy must never state".
 * ------------------------------------------------------------------------
 */

export const site = {
  name: 'Islamic School of Potomac',
  shortName: 'ISP',

  /** Two lines, per DESIGN.md 7.1. */
  wordmark: ['Islamic School', 'of Potomac'] as const,

  /** ISP's own line. The only telephone number on this site. */
  phone: {
    display: '(301) 929-1441',
    href: 'tel:+13019291441',
    /** E.164, for schema.org. */
    schema: '+1-301-929-1441',
  },

  email: {
    display: 'info@ispmd.org',
    href: 'mailto:info@ispmd.org',
    address: 'info@ispmd.org',
  },

  /** Mail and donations only. Not a classroom, not a place to visit. */
  mail: {
    lines: ['Islamic School of Potomac', 'P.O. Box 833', 'Rockville, MD 20848-0833'] as const,
    postOfficeBoxNumber: '833',
    addressLocality: 'Rockville',
    addressRegion: 'MD',
    postalCode: '20848-0833',
    addressCountry: 'US',
  },

  /**
   * Where class meets.
   * Never written as the school's own address.
   */
  venue: {
    name: 'Islamic Education Center',
    lines: ['Islamic Education Center', '7917 Montrose Rd', 'Potomac, MD 20854'] as const,
    streetAddress: '7917 Montrose Rd',
    addressLocality: 'Potomac',
    addressRegion: 'MD',
    postalCode: '20854',
    addressCountry: 'US',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=7917+Montrose+Rd+Potomac+MD+20854',
  },

  nonprofit: {
    ein: '52-1989063',
    statement: 'Islamic School of Potomac is a 501(c)(3) non-profit organization.',
  },

  social: {
    instagram: 'https://www.instagram.com/ispmd/',
    facebook: 'https://www.facebook.com/Islamic-School-of-Potomac-100899361744812',
  },

  /** Third-party destinations. No SDKs, no script tags. */
  enrollFormUrl: 'https://form.jotform.com/261994492004057',
  enrollFormId: '261994492004057',
  donateUrl: 'https://www.paypal.com/donate/?hosted_button_id=24GHPP5NMDF74',

  /** The .ics route, so the download link is never hand-typed. */
  icsPath: '/ispmd-2026-27.ics',

  academicYear: '2026-2027',
} as const;

/**
 * The Quranic epigraph. Copied, never retyped (COPY.md, implementer note 4).
 * Appears in exactly four places site-wide.
 */
export const epigraph = {
  arabic: 'وَقُلْ رَبِّ زِدْنِي عِلْمًا',
  english: "“…and say, ‘My Lord, increase me in knowledge.’”",
  reference: '20:114',
} as const;

export type NavLink = { label: string; href: string };

/** DESIGN.md 7.1. Five links plus one CTA at >=1024px. */
export const primaryNav: NavLink[] = [
  { label: 'Our Story', href: '/our-story' },
  { label: 'Program', href: '/program' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Give', href: '/give' },
];

/** Contact and Enroll are reachable from the footer, inline copy and mobile. */
export const secondaryNav: NavLink[] = [
  { label: 'Enroll', href: '/enroll' },
  { label: 'Contact', href: '/contact' },
];

export const allNav: NavLink[] = [
  { label: 'Home', href: '/' },
  ...primaryNav,
  ...secondaryNav,
];

/** DESIGN.md 7.2, footer link columns. */
export const footerNav = {
  primary: primaryNav.filter((l) => l.label !== 'Give'),
  secondary: [{ label: 'Enroll', href: '/enroll' }, { label: 'Give', href: '/give' }, { label: 'Contact', href: '/contact' }],
};

/** COPY.md, recurring buttons and links. Use these labels verbatim. */
export const labels = {
  enrollPrimary: 'Enroll your child',
  enrollSecondary: 'Start enrollment',
  program: 'See the program',
  calendar: 'See the full year',
  calendarDownload: 'Add the year to your calendar',
  give: 'Support the school',
  paypal: 'Give through PayPal',
  contact: 'Get in touch',
  jotformDirect: 'Open the enrollment form in a new tab',
  home404: 'Go to the homepage',
  skip: 'Skip to main content',
  menuOpen: 'Menu',
  menuClose: 'Close',
} as const;
