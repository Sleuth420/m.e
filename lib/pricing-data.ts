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
      'Professional WordPress solutions from simple starter sites to complex enterprise applications.',
    tiers: [
      {
        name: 'Simple Starter',
        price: '$1,200',
        subtitle: 'Perfect for small businesses',
        features: [
          'Single page WordPress site',
          'Basic responsive design',
          'Contact form',
          'Basic SEO setup',
          '1 week delivery',
          '30 days support',
        ],
      },
      {
        name: 'Medium Business',
        price: '$2,800',
        subtitle: 'Ideal for growing businesses',
        highlighted: true,
        features: [
          '5-8 page WordPress site',
          'Custom theme design',
          'WooCommerce integration',
          'Advanced SEO optimization',
          'Contact forms + newsletter',
          '2-3 weeks delivery',
          '60 days support',
        ],
      },
      {
        name: 'Large Enterprise',
        price: '$5,500',
        subtitle: 'For established businesses',
        features: [
          '10+ page WordPress site',
          'Fully custom theme',
          'Advanced functionality',
          'E-commerce integration',
          'Advanced security features',
          'Performance optimization',
          '4-6 weeks delivery',
          '90 days support',
        ],
      },
    ],
    callout: {
      title: 'Custom Solutions',
      description: 'Need something beyond these packages? Custom WordPress solutions starting from $8,000 AUD.',
      ctaLabel: 'Request Custom Quote',
    },
  },
  {
    id: 'custom-development',
    badge: 'Custom Development',
    title: 'Custom Code Solutions',
    description: 'Full-stack development with modern technologies. Complex projects require custom solutions.',
    tiers: [
      {
        name: 'Small Project',
        price: '$120',
        priceNote: 'per hour',
        subtitle: 'Quick fixes and small scope',
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
          'Performance optimization',
        ],
      },
      {
        name: 'Large Project',
        price: '$160',
        priceNote: 'per hour',
        subtitle: 'Enterprise and long-term work',
        features: [
          'Full-stack applications',
          'Enterprise solutions',
          'Complex systems architecture',
          'Team lead responsibilities',
          'Long-term project management',
        ],
      },
    ],
    infoCards: [
      {
        title: 'Project Examples',
        items: [
          'E-commerce platforms',
          'Business management systems',
          'Mobile applications',
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
  'Smart home integration',
  'Commercial installations',
  'Industrial systems',
  'Electrical maintenance',
  'Safety inspections',
  'Fault finding and repairs',
  'New construction wiring',
  'Renovation projects',
];

export const otherServiceOfferings: OtherServiceOffering[] = [
  {
    name: 'Digital Marketing',
    price: 'From $800',
    priceNote: 'per month',
    icon: 'camera',
    features: ['SEO optimization', 'Content creation', 'Social media management', 'Marketing strategies'],
  },
  {
    name: '3D Design & CAD',
    price: 'From $90',
    priceNote: 'per hour',
    icon: 'palette',
    features: ['Technical drawings', '3D modeling (Blender)', 'CAD designs', 'AI-powered workflows'],
  },
  {
    name: 'Cybersecurity',
    price: 'From $150',
    priceNote: 'per hour',
    icon: 'shield',
    features: ['Security audits', 'Penetration testing', 'Network security', 'Security consulting'],
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
    features: ['IoT solutions', 'Raspberry Pi projects', 'Arduino development', 'Hardware integration'],
  },
];
