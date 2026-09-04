import type { Metadata } from 'next';
import ImmersiveHero from '@/components/sections/home/immersive-hero';
import SwitchboardShowcase from '@/components/sections/home/switchboard-showcase';
import DualTradeTeaser from '@/components/sections/home/dual-trade-teaser';
import FeaturedProjectsMarquee from '@/components/sections/home/featured-projects-marquee';
import TrustStrip from '@/components/sections/home/trust-strip';
import ContactCta from '@/components/sections/home/contact-cta';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'A-Grade Electrician & Web Developer Melbourne | OakCodeAndTechSolutions',
  description:
    'A-Grade Electrician in Melbourne for residential, commercial, and industrial work, plus data and smart home. Websites, apps, cybersecurity, and marketing.',
  type: 'website',
  canonical: BASE_URL,
});

export default function Home() {
  return (
    <>
      <ImmersiveHero />
      <SwitchboardShowcase />
      <TrustStrip />
      <DualTradeTeaser />
      <FeaturedProjectsMarquee />
      <ContactCta />
    </>
  );
}
