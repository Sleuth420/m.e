import type { Metadata } from 'next';
import PricingPageClient from './PricingPageClient';

export const metadata: Metadata = {
  title: 'Pricing & Packages | Web Development & Electrical Services Melbourne',
  description: 'Transparent pricing for web development, WordPress, custom applications, and licensed electrical services in Melbourne. Get quotes for your project today.',
  keywords: [
    'pricing melbourne',
    'web development pricing',
    'wordpress pricing melbourne',
    'electrician pricing melbourne',
    'app development cost',
    'website development pricing',
    'custom web development pricing',
    'emergency electrician pricing',
    '24 hour electrician cost',
    'freelance developer rates melbourne',
    'web developer hourly rate melbourne',
    'electrician hourly rate melbourne',
    'affordable web development melbourne',
    'budget friendly electrician',
    'wordpress packages melbourne',
    'custom development pricing',
    'electrical services pricing',
    'development packages melbourne',
    'website cost melbourne',
    'app development pricing melbourne',
  ],
  openGraph: {
    title: 'Pricing & Packages | OakCodeAndTechSolutions Melbourne',
    description: 'Professional web development and electrical services pricing in Melbourne. WordPress, custom apps, emergency electrician services with transparent pricing.',
    type: 'website',
    images: [
      {
        url: 'https://www.oakcodeandtechsolutions.com/placeholder-user.jpg',
        width: 1200,
        height: 630,
        alt: 'OakCodeAndTechSolutions Pricing Melbourne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Packages | OakCodeAndTechSolutions Melbourne',
    description: 'Professional web development and electrical services pricing in Melbourne.',
    images: ['https://www.oakcodeandtechsolutions.com/placeholder-user.jpg'],
  },
  alternates: {
    canonical: 'https://www.oakcodeandtechsolutions.com/pricing',
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
