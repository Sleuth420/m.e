import type { Metadata } from 'next';
import PricingPageClient from './PricingPageClient';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Pricing & Packages | Web Development & Electrical Services Melbourne',
  description: 'Transparent pricing for web development, WordPress, custom applications, and licensed electrical services in Melbourne. Get quotes for your project today.',
  type: 'website',
  canonical: `${BASE_URL}/pricing`,
});

export default function PricingPage() {
  return <PricingPageClient />;
}
