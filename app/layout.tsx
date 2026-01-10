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
import { KonamiTrigger } from '@/components/ui/konami-trigger';

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
      '@id': 'https://www.oakcodeandtechsolutions.com/#person',
    name: 'Ricky',
    alternateName: 'Ricky Oakley',
    jobTitle: 'A-Grade Licensed Electrician & Full-Stack Developer',
    worksFor: {
      '@type': 'Organization',
        '@id': 'https://www.oakcodeandtechsolutions.com/#organization',
      name: 'OakCodeAndTechSolutions',
      description: 'OakCodeAndTechSolutions provides professional electrical services and web development solutions in Melbourne.',
    },
    description:
        'A-Grade licensed electrician and full-stack developer in Melbourne. Professional electrical services (residential, commercial, emergency) and web development (WordPress, React, Vue.js, custom applications).',
    url: 'https://www.oakcodeandtechsolutions.com',
    image: 'https://www.oakcodeandtechsolutions.com/placeholder-user.jpg',
    email: 'oakcodeandtechsolutions@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Melbourne',
        addressRegion: 'Victoria',
      addressCountry: 'Australia',
        postalCode: '3000',
    },
    knowsAbout: [
        'Electrician Melbourne',
        'Licensed Electrician Melbourne',
        'Emergency Electrician Melbourne',
        '24 Hour Electrician Melbourne',
        'A-Grade Electrician Melbourne',
        'Residential Electrician Melbourne',
        'Commercial Electrician Melbourne',
        'Electrical Services Melbourne',
        'Web Development Melbourne',
        'WordPress Developer Melbourne',
        'App Developer Melbourne',
        'React Developer Melbourne',
        'Vue.js Developer Melbourne',
        'Django Developer Melbourne',
        'Python Developer Melbourne',
        'Node.js Developer Melbourne',
        'Embedded Systems Melbourne',
        'IoT Solutions Melbourne',
        'Digital Marketing Melbourne',
        'SEO Services Melbourne',
        'Cybersecurity Melbourne',
        'CAD Design Melbourne',
        '3D Modeling Melbourne',
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'A-Grade Licensed Electrician',
        description: 'Residential, commercial, and industrial electrical services in Melbourne. 24/7 emergency electrician services available.',
      },
      {
        '@type': 'Occupation',
        name: 'Full-Stack Developer',
        description: 'Specializing in modern web technologies and custom applications in Melbourne',
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
      '@id': 'https://www.oakcodeandtechsolutions.com/#electrician',
      name: 'OakCodeAndTechSolutions - Licensed Electrician Melbourne',
      alternateName: 'OakCodeAndTechSolutions Electrical Services',
      description: 'OakCodeAndTechSolutions provides professional licensed electrician services and solutions in Melbourne. Emergency electrician, residential, commercial, and industrial electrical work. 24/7 emergency services available.',
      url: 'https://www.oakcodeandtechsolutions.com',
      // telephone: '+61-XXX-XXX-XXX', // Removed - invalid placeholder causes validation errors
      email: 'oakcodeandtechsolutions@gmail.com',
      image: 'https://www.oakcodeandtechsolutions.com/placeholder-user.jpg',
      logo: 'https://www.oakcodeandtechsolutions.com/placeholder-logo.png',
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
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Emergency Electrician Melbourne',
                description: '24/7 emergency electrical services in Melbourne',
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Residential Electrical Services',
                description: 'Complete residential electrical work in Melbourne',
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Commercial Electrical Services',
                description: 'Professional commercial electrical installations and maintenance',
              },
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
      // aggregateRating removed - requires actual reviews to be valid
    },
    // LocalBusiness schema for web development services
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://www.oakcodeandtechsolutions.com/#webdev',
      name: 'OakCodeAndTechSolutions - Web Developer Melbourne',
      alternateName: 'OakCodeAndTechSolutions Web Development',
      description: 'OakCodeAndTechSolutions provides professional web development services and solutions in Melbourne. WordPress developer, custom web applications, app development, and digital marketing services.',
      url: 'https://www.oakcodeandtechsolutions.com',
      // telephone: '+61-XXX-XXX-XXX', // Removed - invalid placeholder causes validation errors
      email: 'oakcodeandtechsolutions@gmail.com',
      image: 'https://www.oakcodeandtechsolutions.com/placeholder-user.jpg',
      logo: 'https://www.oakcodeandtechsolutions.com/placeholder-logo.png',
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
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'WordPress Developer Melbourne',
                description: 'Custom WordPress development and WooCommerce integration',
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Custom Web Applications',
                description: 'Full-stack web applications with modern technologies',
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'App Development Melbourne',
                description: 'Mobile and web app development services',
              },
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
    // Organization schema for brand recognition
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://www.oakcodeandtechsolutions.com/#organization',
      name: 'OakCodeAndTechSolutions',
      legalName: 'OakCodeAndTechSolutions',
      description: 'OakCodeAndTechSolutions is a Melbourne-based business providing professional electrical services and web development solutions. Specializing in licensed electrical work and custom web applications.',
      url: 'https://www.oakcodeandtechsolutions.com',
      logo: 'https://www.oakcodeandtechsolutions.com/placeholder-logo.png',
      image: 'https://www.oakcodeandtechsolutions.com/placeholder-user.jpg',
      email: 'oakcodeandtechsolutions@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'Victoria',
        addressCountry: 'Australia',
        postalCode: '3000',
      },
      sameAs: [
        'https://github.com/Sleuth420',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'oakcodeandtechsolutions@gmail.com',
        contactType: 'Customer Service',
        areaServed: 'AU',
        availableLanguage: 'English',
      },
    },
    // FAQ Schema for common questions
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Are you a licensed electrician in Melbourne?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, I am an A-Grade licensed electrician in Melbourne, qualified to perform all types of electrical work including residential, commercial, and industrial installations and repairs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide emergency electrician services?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, I offer 24/7 emergency electrician services throughout Melbourne. Available for urgent electrical repairs, power outages, and electrical emergencies at any time.',
          },
        },
        {
          '@type': 'Question',
          name: 'What areas of Melbourne do you service?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'I service all areas of Melbourne including CBD, Craigieburn, Caroline Springs, Port Melbourne, Essendon, St Kilda, Glenroy, Glen Waverley, South Melbourne, and the Western Suburbs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you offer both electrical and web development services?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, I am a dual trade professional offering both A-Grade licensed electrical services and full-stack web development. This unique combination allows me to provide comprehensive solutions for businesses needing both technical and digital services.',
          },
        },
        {
          '@type': 'Question',
          name: 'What web development services do you offer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'I offer WordPress development, custom web applications using React/Next.js and Vue.js/Django, e-commerce solutions, and full-stack development services. All projects are custom-built to meet your specific business needs.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote for electrical work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can contact me through the contact form on this website, email me directly at oakcodeandtechsolutions@gmail.com, or call for emergency services. I provide free quotes for all electrical work.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote for web development?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can contact me through the contact form, email me at oakcodeandtechsolutions@gmail.com, or visit the pricing page for package information. I provide detailed quotes for all web development projects.',
          },
        },
      ],
    },
  ];

  // Google Analytics ID from Vercel environment variables (defaults to provided GA ID)
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-LPYYS7GJ17';
  const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

  return (
    <html lang="en-AU" suppressHydrationWarning className={inter.className}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Google Search Console Verification */}
        {gscVerification && (
          <meta name="google-site-verification" content={gscVerification} />
        )}
        
        {/* Enhanced Structured Data for SEO */}
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        
        {/* Google tag (gtag.js) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `,
          }}
        />
        
        {/* reCAPTCHA v3 */}
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            async
            defer
          />
        )}
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
            <KonamiTrigger />
            {children}
            <AvailableForWorkPopup />
            <BuyMeCoffeePopup coffeeLink="https://www.buymeacoffee.com/oakcodeandtechsolutions" />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
