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
  title: 'Full-Stack Developer & Licensed Electrician Melbourne | OakCodeAndTechSolutions',
  description: 'Dual trade professional: Full-stack developer and licensed electrician in Melbourne. Specializing in WordPress, React, Vue.js, custom web applications, and electrical services. Get professional development and electrical work from one expert.',
  type: 'website',
  keywords: [
    'full stack developer melbourne',
    'licensed electrician melbourne',
    'wordpress developer melbourne',
    'react developer melbourne',
    'vue.js developer melbourne',
    'custom web development melbourne',
    'app development melbourne',
    'emergency electrician melbourne',
    'web developer electrician',
    'dual trade professional melbourne',
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
