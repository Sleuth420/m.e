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
    console.log(
      '%c📱 On mobile: Tap up-up-down-down-left-right-left-right-center-center',
      'color: #f97316; font-size: 12px;'
    );
  }

  // Enhanced structured data for SEO with LocalBusiness schema
  const structuredData = [
    // Person schema
    {
    '@context': 'https://schema.org',
    '@type': 'Person',
      '@id': 'https://oakcodeandtechsolutions.com/#person',
    name: 'Ricky',
    alternateName: 'Ricky Oakley',
    jobTitle: 'Full-Stack Developer & Licensed Electrician',
    worksFor: {
      '@type': 'Organization',
        '@id': 'https://oakcodeandtechsolutions.com/#organization',
      name: 'OakCodeAndTechSolutions',
    },
    description:
        'Dual trade professional: Full-stack developer and licensed electrician specializing in WordPress, custom web development, embedded systems, and electrical services in Melbourne.',
    url: 'https://oakcodeandtechsolutions.com',
    image: 'https://oakcodeandtechsolutions.com/placeholder-user.jpg',
    email: 'oakcodeandtechsolutions@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Melbourne',
        addressRegion: 'Victoria',
      addressCountry: 'Australia',
        postalCode: '3000',
    },
    knowsAbout: [
        'Web Development Melbourne',
        'WordPress Developer Melbourne',
        'App Developer Melbourne',
        'Electrician Melbourne',
        'Emergency Electrician Melbourne',
        'React Developer Melbourne',
        'Vue.js Developer Melbourne',
        'Django Developer Melbourne',
        'Python Developer Melbourne',
        'Node.js Developer Melbourne',
        'Embedded Systems Melbourne',
        'IoT Solutions Melbourne',
        'Electrical Services Melbourne',
        '24 Hour Electrician Melbourne',
        'Digital Marketing Melbourne',
        'SEO Services Melbourne',
        'Cybersecurity Melbourne',
        'CAD Design Melbourne',
        '3D Modeling Melbourne',
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Full-Stack Developer',
          description: 'Specializing in modern web technologies and custom applications in Melbourne',
          skills: 'React, Vue.js, Django, Python, Node.js, WordPress, Next.js',
          areaServed: {
            '@type': 'City',
            name: 'Melbourne',
            addressCountry: 'Australia',
          },
      },
      {
        '@type': 'Occupation',
        name: 'Licensed Electrician',
          description: 'Residential, commercial, and industrial electrical services in Melbourne',
          skills: 'Electrical installations, repairs, smart home integration, emergency services',
          areaServed: {
            '@type': 'City',
            name: 'Melbourne',
            addressCountry: 'Australia',
          },
        },
      ],
      sameAs: [
        'https://github.com/Sleuth420',
      ],
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Licensed Electrician Training',
        description: 'A-Grade Licensed Electrician qualification',
      },
    },
    // LocalBusiness schema for electrician services
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://oakcodeandtechsolutions.com/#electrician',
      name: 'OakCodeAndTechSolutions - Licensed Electrician Melbourne',
      alternateName: 'OakCode Electrical Services Melbourne',
      description: 'Professional licensed electrician services in Melbourne. Emergency electrician, residential, commercial, and industrial electrical work. 24/7 emergency services available.',
      url: 'https://oakcodeandtechsolutions.com',
      telephone: '+61-XXX-XXX-XXX', // Add actual phone number
      email: 'oakcodeandtechsolutions@gmail.com',
      image: 'https://oakcodeandtechsolutions.com/placeholder-user.jpg',
      logo: 'https://oakcodeandtechsolutions.com/placeholder-logo.png',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'Victoria',
        addressCountry: 'Australia',
        postalCode: '3000',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '-37.8136', // Melbourne CBD coordinates
        longitude: '144.9631',
      },
      areaServed: [
        {
          '@type': 'City',
          name: 'Melbourne',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'Melbourne CBD',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'Craigieburn',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'Caroline Springs',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'Port Melbourne',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'Essendon',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'St Kilda',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'Glenroy',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'Glen Waverley',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'South Melbourne',
          addressCountry: 'Australia',
        },
        {
          '@type': 'City',
          name: 'Western Suburbs',
          addressCountry: 'Australia',
        },
      ],
      serviceType: [
        'Emergency Electrician Services',
        '24 Hour Electrician',
        'Residential Electrical',
        'Commercial Electrical',
        'Industrial Electrical',
        'Smart Home Integration',
        'Electrical Repairs',
        'Electrical Installations',
        'Safety Inspections',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Electrical Services Melbourne',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Emergency Electrician Melbourne',
              description: '24/7 emergency electrical services in Melbourne',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Residential Electrical Services',
              description: 'Complete residential electrical work in Melbourne',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Commercial Electrical Services',
              description: 'Professional commercial electrical installations and maintenance',
            },
          },
        ],
      },
      priceRange: '$$',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer',
      currenciesAccepted: 'AUD',
      openingHours: [
        'Mo-Su 00:00-24:00', // 24/7 emergency services
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: '1',
        bestRating: '5',
        worstRating: '1',
      },
    },
    // LocalBusiness schema for web development services
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://oakcodeandtechsolutions.com/#webdev',
      name: 'OakCodeAndTechSolutions - Web Developer Melbourne',
      alternateName: 'OakCode Web Development Melbourne',
      description: 'Professional web development services in Melbourne. WordPress developer, custom web applications, app development, and digital marketing services.',
      url: 'https://oakcodeandtechsolutions.com',
      telephone: '+61-XXX-XXX-XXX', // Add actual phone number
      email: 'oakcodeandtechsolutions@gmail.com',
      image: 'https://oakcodeandtechsolutions.com/placeholder-user.jpg',
      logo: 'https://oakcodeandtechsolutions.com/placeholder-logo.png',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'Victoria',
        addressCountry: 'Australia',
        postalCode: '3000',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '-37.8136',
        longitude: '144.9631',
      },
      areaServed: {
        '@type': 'City',
        name: 'Melbourne',
        addressCountry: 'Australia',
      },
      serviceType: [
        'WordPress Development',
        'Custom Web Development',
        'App Development',
        'React Development',
        'Vue.js Development',
        'Django Development',
        'Python Development',
        'Node.js Development',
        'E-commerce Development',
        'Website Design',
        'Digital Marketing',
        'SEO Services',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Web Development Services Melbourne',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'WordPress Developer Melbourne',
              description: 'Custom WordPress development and WooCommerce integration',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom Web Applications',
              description: 'Full-stack web applications with modern technologies',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'App Development Melbourne',
              description: 'Mobile and web app development services',
            },
          },
        ],
      },
      priceRange: '$$$',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer, PayPal',
      currenciesAccepted: 'AUD',
      openingHours: [
        'Mo-Fr 09:00-17:00', // Standard business hours for development
      ],
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        {/* Enhanced Structured Data for SEO */}
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
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
