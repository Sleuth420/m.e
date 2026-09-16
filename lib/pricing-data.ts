export interface PricingTier {
  name: string;
  price: string;
  priceNote?: string;
  subtitle: string;
  features: string[];
  highlighted?: boolean;
}

export interface PricingPackageSection {
  id: string;
  badge: string;
  title: string;
  description: string;
  tiers: PricingTier[];
  callout?: {
    title: string;
    description: string;
    ctaLabel: string;
  };
  infoCards?: Array<{ title: string; items: string[] }>;
}

export interface ElectricalRate {
  label: string;
  rate: string;
}

export interface OtherServiceOffering {
  name: string;
  price: string;
  priceNote: string;
  icon: 'camera' | 'palette' | 'shield' | 'database' | 'microchip';
  features: string[];
}

export const pricingNavItems = [
  { id: 'wordpress', label: 'WordPress' },
  { id: 'custom-development', label: 'Custom Development' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'other-services', label: 'Other Services' },
] as const;

export const packageSections: PricingPackageSection[] = [
  {
    id: 'wordpress',
    badge: 'WordPress Development',
    title: 'WordPress Packages',
    description:
      'Packages for a single-page website, a growing business or a larger site with more features.',
    tiers: [
      {
        name: 'Single-page Website',
        price: '$1,200',
        subtitle: 'A simple online presence for your business',
        features: [
          'Single page WordPress site',
          'Layout for mobile and desktop',
          'Contact form',
          'Basic SEO setup',
          '1 week delivery',
          '30 days support',
        ],
      },
      {
        name: 'Business Website',
        price: '$2,800',
        subtitle: 'More pages, content and online selling',
        highlighted: true,
        features: [
          '5-8 page WordPress site',
          'Custom theme design',
          'WooCommerce integration',
          'Expanded on-page SEO setup',
          'Contact forms + newsletter',
          '2-3 weeks delivery',
          '60 days support',
        ],
      },
      {
        name: 'Larger Website',
        price: '$5,500',
        subtitle: 'More content and custom functionality',
        features: [
          '10+ page WordPress site',
          'Fully custom theme',
          'Advanced functionality',
          'E-commerce integration',
          'Advanced security features',
          'Performance improvements',
          '4-6 weeks delivery',
          '90 days support',
        ],
      },
    ],
    callout: {
      title: 'Custom Solutions',
      description:
        'Need something beyond these packages? Custom WordPress solutions starting from $8,000 AUD.',
      ctaLabel: 'Request Custom Quote',
    },
  },
  {
    id: 'custom-development',
    badge: 'Custom Development',
    title: 'Custom Development Rates',
    description:
      'Hourly rates for fixes, new features and application development. The rate depends on the complexity and responsibilities of the project.',
    tiers: [
      {
        name: 'Small Project',
        price: '$120',
        priceNote: 'per hour',
        subtitle: 'Fixes and small additions',
        features: [
          'Bug fixes',
          'Small feature additions',
          'Code reviews',
          'Simple integrations',
          'Quick consultations',
        ],
      },
      {
        name: 'Medium Project',
        price: '$140',
        priceNote: 'per hour',
        subtitle: 'Custom apps and integrations',
        highlighted: true,
        features: [
          'Custom applications',
          'API development',
          'Database design',
          'Complex integrations',
          'Performance improvements',
        ],
      },
      {
        name: 'Large Project',
        price: '$160',
        priceNote: 'per hour',
        subtitle: 'Complex systems and ongoing development',
        features: [
          'Full-stack applications',
          'Business software development',
          'System architecture and planning',
          'Technical team leadership',
          'Ongoing project coordination',
        ],
      },
    ],
    infoCards: [
      {
        title: 'Project Examples',
        items: [
          'E-commerce platforms',
          'Business management systems',
          'Web apps for desktop and mobile',
          'IoT and embedded systems',
        ],
      },
      {
        title: 'Technologies',
        items: ['React/Next.js', 'Vue.js/Django', 'Node.js/Python', 'Database design'],
      },
    ],
  },
];

export const electricalRates: ElectricalRate[] = [
  { label: 'Residential', rate: 'From $85/hour*' },
  { label: 'Commercial', rate: 'From $95/hour*' },
  { label: 'Industrial', rate: 'From $110/hour*' },
  { label: 'Urgent callouts (by appointment)', rate: 'From $120/hour*' },
];

export const electricalServicesList = [
  'Commercial installations and fit-outs',
  'Industrial systems and three-phase work',
  'Electrical maintenance',
  'Fault finding and repairs',
  'Switchboard upgrades',
  'New construction wiring',
  'Renovation projects',
  'Safety inspections',
  'Smart home integration',
];

export const otherServiceOfferings: OtherServiceOffering[] = [
  {
    name: 'Digital Marketing',
    price: 'From $800',
    priceNote: 'per month',
    icon: 'camera',
    features: [
      'Content planning',
      'Website copy',
      'Analytics and reporting',
      'Search visibility reviews',
    ],
  },
  {
    name: '3D Design & CAD',
    price: 'From $90',
    priceNote: 'per hour',
    icon: 'palette',
    features: [
      'Technical drawings',
      '3D modelling in Blender',
      'CAD designs',
      'Website and presentation assets',
    ],
  },
  {
    name: 'Cybersecurity',
    price: 'From $150',
    priceNote: 'per hour',
    icon: 'shield',
    features: [
      'Website security reviews',
      'Scoped vulnerability testing',
      'Access and backup checks',
      'Security fixes and advice',
    ],
  },
  {
    name: 'IT & Business Setup',
    price: 'From $120',
    priceNote: 'per hour',
    icon: 'database',
    features: ['Email setup', 'Domain management', 'Server configuration', 'Business systems'],
  },
  {
    name: 'Embedded Systems',
    price: 'From $100',
    priceNote: 'per hour',
    icon: 'microchip',
    features: [
      'IoT solutions',
      'Raspberry Pi projects',
      'Arduino development',
      'Hardware integration',
    ],
  },
];
