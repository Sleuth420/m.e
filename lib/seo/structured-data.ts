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
      'A-Grade licensed electrician and full-stack developer in Melbourne. Electrical work, WordPress sites, and custom web apps.',
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
    worksFor: {
      '@type': 'Organization',
      '@id': orgId,
      name: 'OakCodeAndTechSolutions',
      description:
        'Professional electrical services and web development in Melbourne.',
    },
    description:
      'A-Grade licensed electrician and full-stack developer in Melbourne. Residential and commercial electrical work, WordPress sites, and custom web applications.',
    url: BASE_URL,
    address: melbourneAddress,
    knowsAbout: [
      'Licensed electrical work',
      'Residential and commercial electrical installations',
      'WordPress development',
      'React and Next.js applications',
      'Vue.js and Django backends',
      'Embedded systems and IoT',
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'A-Grade Licensed Electrician',
        description:
          'Residential, commercial, and light industrial electrical work in Melbourne. Urgent jobs by appointment via the contact form.',
      },
      {
        '@type': 'Occupation',
        name: 'Full-Stack Developer',
        description: 'Modern web applications and business websites in Melbourne.',
      },
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
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#electrician`,
    name: 'OakCodeAndTechSolutions — Licensed Electrician Melbourne',
    description:
      'Licensed electrician in Melbourne for residential and commercial work. Quotes and urgent jobs by appointment via the contact form.',
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.svg`,
    address: melbourneAddress,
    geo: melbourneGeo,
    areaServed: melbourneAreas,
    serviceType: [
      'Residential electrical',
      'Commercial electrical',
      'Switchboard upgrades',
      'Fault finding and repairs',
      'Smart home wiring',
      'Safety inspections',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Electrical Services Melbourne',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Urgent electrical work',
              description:
                'Urgent jobs handled when schedule allows. Submit the contact form and mark urgent.',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Residential electrical',
              description: 'Power points, lighting, switchboards, and compliance work.',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Commercial electrical',
              description: 'Fit-outs, maintenance, and small commercial installations.',
            },
          },
        },
      ],
    },
    priceRange: '$$',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    currenciesAccepted: 'AUD',
    openingHours: ['Mo-Fr 07:00-18:00', 'Sa 08:00-14:00'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#webdev`,
    name: 'OakCodeAndTechSolutions — Web Developer Melbourne',
    description:
      'WordPress development, custom web applications, and digital marketing in Melbourne.',
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.svg`,
    address: melbourneAddress,
    geo: melbourneGeo,
    areaServed: {
      '@type': 'City',
      name: 'Melbourne',
      addressCountry: 'Australia',
    },
    serviceType: [
      'WordPress development',
      'Custom web applications',
      'React and Next.js development',
      'E-commerce development',
      'SEO and digital marketing',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Development Services Melbourne',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'WordPress development',
              description: 'Custom themes, plugins, and WooCommerce integration.',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom web applications',
              description: 'Full-stack apps with modern JavaScript frameworks.',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'App development',
              description: 'Web and mobile app development for business workflows.',
            },
          },
        },
      ],
    },
    priceRange: '$$$',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, PayPal',
    currenciesAccepted: 'AUD',
    openingHours: ['Mo-Fr 09:00-17:00'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: 'OakCodeAndTechSolutions',
    legalName: 'OakCodeAndTechSolutions',
    description:
      'Melbourne-based electrical services and web development — licensed trade work and custom software.',
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
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are you a licensed electrician in Melbourne?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Yes. I hold an A-Grade electrician licence in Victoria for residential, commercial, and light industrial work.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you provide emergency electrician services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Urgent issues are handled when my schedule allows. Use the contact form and mark the job urgent. For immediate danger, call 000 and your electricity distributor first.',
        },
      },
      {
        '@type': 'Question',
        name: 'What areas of Melbourne do you service?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Melbourne CBD, western suburbs, and surrounding areas including Craigieburn, Caroline Springs, Port Melbourne, Essendon, St Kilda, Glenroy, Glen Waverley, and South Melbourne.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer both electrical and web development services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Yes. I am an A-Grade licensed electrician and a full-stack developer — useful when you need a trade website or internal tool alongside electrical work.',
        },
      },
      {
        '@type': 'Question',
        name: 'What web development services do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'WordPress development, custom apps with React/Next.js and Vue.js/Django, e-commerce, and full-stack projects built to your requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I get a quote?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Use the contact form on this site. For web projects, the pricing page lists package starting points.',
        },
      },
    ],
  },
];
