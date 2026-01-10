import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero-section';
import AboutSection from '@/components/sections/about-section';
import ServicesSection from '@/components/sections/services-section';
import ProjectsSection from '@/components/sections/projects-section';
import ContactSection from '@/components/sections/contact-section';
import { generateSeoMetadata } from '@/components/seo/Seo';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Licensed Electrician & Full-Stack Developer Melbourne | OakCodeAndTechSolutions',
  description: 'A-Grade licensed electrician and full-stack developer in Melbourne. Professional electrical services (residential, commercial, emergency) and web development (WordPress, React, Vue.js, custom applications). Dual trade expert serving Melbourne.',
  type: 'website',
  canonical: 'https://www.oakcodeandtechsolutions.com',
  keywords: [
    'licensed electrician melbourne',
    'electrician melbourne',
    'emergency electrician melbourne',
    '24 hour electrician melbourne',
    'A-Grade licensed electrician melbourne',
    'residential electrician melbourne',
    'commercial electrician melbourne',
    'full stack developer melbourne',
    'wordpress developer melbourne',
    'react developer melbourne',
    'vue.js developer melbourne',
    'custom web development melbourne',
    'app development melbourne',
    'web developer electrician melbourne',
    'dual trade professional melbourne',
    'electrician and developer melbourne',
  ],
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
