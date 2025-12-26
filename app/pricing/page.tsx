import type { Metadata } from 'next';
import PricingPageClient from './PricingPageClient';
import { generateSeoMetadata } from '@/components/seo/Seo';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Pricing & Packages | Web Development & Electrical Services Melbourne',
  description: 'Transparent pricing for web development, WordPress, custom applications, and licensed electrical services in Melbourne. Get quotes for your project today.',
  type: 'website',
  canonical: 'https://www.oakcodeandtechsolutions.com/pricing',
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
});

export default function PricingPage() {
  return <PricingPageClient />;
}
