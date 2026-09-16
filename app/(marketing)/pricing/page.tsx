import type { Metadata } from 'next';
import PricingPageClient from './PricingPageClient';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Pricing & Packages | Web Development & Electrical Services Melbourne',
  description:
    'Compare WordPress packages and hourly rates for web development, electrical work and technical services in Melbourne. Request a quote for your project.',
  type: 'website',
  canonical: `${BASE_URL}/pricing`,
});

export default function PricingPage() {
  return <PricingPageClient />;
}
