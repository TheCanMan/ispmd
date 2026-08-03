/**
 * Structured data.
 *
 * DESIGN.md 14.8 puts the EducationalOrganization block on the Contact page
 * and nowhere else, so this is a builder rather than something Base.astro
 * emits by default. Pass the result to <Base jsonLd={...}>.
 *
 * `location` is a separate Place node and must NEVER be written as the
 * organization's `address`. The two organizations are legally distinct, and
 * `address` is the P.O. Box and nothing else. The residential street address
 * that third-party directories tie to ISP's phone number is not publishable
 * in any form, structured data included.
 */

import { site } from './site';

export function educationalOrganization(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: site.name,
    telephone: site.phone.schema,
    email: site.email.address,
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      postOfficeBoxNumber: site.mail.postOfficeBoxNumber,
      addressLocality: site.mail.addressLocality,
      addressRegion: site.mail.addressRegion,
      postalCode: site.mail.postalCode,
      addressCountry: site.mail.addressCountry,
    },
    location: {
      '@type': 'Place',
      name: site.venue.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.venue.streetAddress,
        addressLocality: site.venue.addressLocality,
        addressRegion: site.venue.addressRegion,
        postalCode: site.venue.postalCode,
        addressCountry: site.venue.addressCountry,
      },
    },
    nonprofitStatus: 'Nonprofit501c3',
    taxID: site.nonprofit.ein,
    sameAs: [site.social.instagram, site.social.facebook],
  };
}
