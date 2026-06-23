import type { Metadata } from 'next';
import ImmersiveHero from '@/components/sections/home/immersive-hero';
import DualTradeTeaser from '@/components/sections/home/dual-trade-teaser';
import FeaturedProjectsMarquee from '@/components/sections/home/featured-projects-marquee';
import ServicesPreview from '@/components/sections/home/services-preview';
import TrustStrip from '@/components/sections/home/trust-strip';
import ContactCta from '@/components/sections/home/contact-cta';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Licensed Electrician & Full-Stack Developer Melbourne | OakCodeAndTechSolutions',
  description:
    'A-Grade licensed electrician and full-stack developer in Melbourne. Electrical work, WordPress sites, and custom web apps. Quotes via the contact form.',
  type: 'website',
  canonical: BASE_URL,
});

export default function Home() {
  return (
    <>
      <ImmersiveHero />
      <TrustStrip />
      <DualTradeTeaser />
      <ServicesPreview />
      <FeaturedProjectsMarquee />
      <ContactCta />
    </>
  );
}
