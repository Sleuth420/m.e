import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AvailableForWorkPopup } from '@/components/ui/available-for-work-popup';
import { BuyMeCoffeePopup } from '@/components/ui/buy-me-coffee-popup';
import { ParticleBackground } from '@/components/ui/particle-background';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { KonamiEasterEgg } from '@/components/ui/konami-easter-egg';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = generateSeoMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Easter egg hint
  if (typeof window !== 'undefined') {
    console.log(
      '%c🎮 Try the Konami Code! (↑↑↓↓←→←→BA)',
      'color: #f97316; font-size: 14px; font-weight: bold;'
    );
  }

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ricky',
    alternateName: 'Ricky Oakley',
    jobTitle: 'Full-Stack Developer & Licensed Electrician',
    worksFor: {
      '@type': 'Organization',
      name: 'OakCodeAndTechSolutions',
    },
    description:
      'Dual trade professional: Full-stack developer and licensed electrician specializing in WordPress, custom web development, embedded systems, and electrical services.',
    url: 'https://profile.oakcodeandtechsolutions.com',
    image: 'https://profile.oakcodeandtechsolutions.com/placeholder-user.jpg',
    email: 'oakcodeandtechsolutions@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Melbourne',
      addressCountry: 'Australia',
    },
    knowsAbout: [
      'Web Development',
      'WordPress',
      'React',
      'Vue.js',
      'Django',
      'Python',
      'Node.js',
      'Embedded Systems',
      'IoT',
      'Electrical Services',
      'Digital Marketing',
      'Cybersecurity',
      'CAD Design',
      '3D Modeling',
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Full-Stack Developer',
        description: 'Specializing in modern web technologies and custom applications',
      },
      {
        '@type': 'Occupation',
        name: 'Licensed Electrician',
        description: 'Residential, commercial, and industrial electrical services',
      },
    ],
    sameAs: ['https://github.com/Sleuth420'],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* reCAPTCHA v3 */}
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
        />
      </head>
      <body className={inter.className}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ParticleBackground />
            <KonamiEasterEgg />
            {children}
            <AvailableForWorkPopup />
            <BuyMeCoffeePopup coffeeLink="https://www.buymeacoffee.com/oakcodeandtechsolutions" />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
