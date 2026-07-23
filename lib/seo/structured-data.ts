import { BASE_URL } from '@/lib/site';

const orgId = `${BASE_URL}/#organization`;
const personId = `${BASE_URL}/#person`;

const melbourneAddress = {
  '@type': 'PostalAddress' as const,
  addressLocality: 'Melbourne',
  addressRegion: 'Victoria',
  addressCountry: 'Australia',
  postalCode: '3000',
};

const melbourneGeo = {
  '@type': 'GeoCoordinates' as const,
  latitude: '-37.8136',
  longitude: '144.9631',
};

const melbourneAreas = [
  'Melbourne',
  'Melbourne CBD',
  'Craigieburn',
  'Caroline Springs',
  'Port Melbourne',
  'Essendon',
  'St Kilda',
  'Glenroy',
  'Glen Waverley',
  'South Melbourne',
  'Western Suburbs',
].map((name) => ({
  '@type': 'City' as const,
  name,
  addressCountry: 'Australia',
}));

export const rootStructuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'OakCodeAndTechSolutions',
    url: BASE_URL,
    description:
      'A-Grade licensed electrician and full-stack developer in Melbourne. Electrical work, WordPress sites, and custom web apps for residential, commercial, and industrial clients.',
    publisher: { '@id': orgId },
    inLanguage: 'en-AU',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: 'Ricky',
    alternateName: 'Ricky Oakley',
    jobTitle: 'A-Grade Licensed Electrician & Full-Stack Developer',
    worksFor: { '@id': orgId },
    description:
      'A-Grade licensed electrician and full-stack developer in Melbourne. Residential, commercial, and industrial electrical work, WordPress sites, and custom web applications.',
    url: BASE_URL,
    address: melbourneAddress,
    knowsAbout: [
      'Licensed electrical work',
      'Residential, commercial, and industrial electrical installations',
      'WordPress development',
      'React and Next.js applications',
      'Vue.js and Django backends',
      'Embedded systems and IoT',
    ],
    sameAs: ['https://github.com/Sleuth420'],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'A-Grade Electrician Licence',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Energy Safe Victoria',
      },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: 'OakCodeAndTechSolutions',
    legalName: 'OakCodeAndTechSolutions',
    description:
      'Melbourne-based electrical services and web development - licensed trade work and custom software.',
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.svg`,
    address: melbourneAddress,
    sameAs: ['https://github.com/Sleuth420'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${BASE_URL}/contact`,
      areaServed: 'AU',
      availableLanguage: 'English',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Electrician'],
    '@id': `${BASE_URL}/#electrician`,
    name: 'OakCodeAndTechSolutions',
    description:
      'Licensed electrician in Melbourne for residential, commercial, and industrial work. Quotes and urgent jobs by appointment via the contact form.',
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.svg`,
    address: melbourneAddress,
    geo: melbourneGeo,
    areaServed: melbourneAreas,
    priceRange: '$$',
    currenciesAccepted: 'AUD',
    openingHours: ['Mo-Fr 07:00-18:00', 'Sa 08:00-14:00'],
    parentOrganization: { '@id': orgId },
  },
];
