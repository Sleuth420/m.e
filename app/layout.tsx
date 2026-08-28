import type React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AvailableForWorkPopup } from '@/components/ui/available-for-work-popup';
import { BuyMeCoffeePopup } from '@/components/ui/buy-me-coffee-popup';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { rootStructuredData } from '@/lib/seo/structured-data';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-display',
});

export const metadata: Metadata = generateSeoMetadata();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f5' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-LPYYS7GJ17';
  const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

  return (
    <html
      lang="en-AU"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />

        {gscVerification && (
          <meta name="google-site-verification" content={gscVerification} />
        )}

        {rootStructuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}

        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
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

        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            async
            defer
          />
        )}
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <AvailableForWorkPopup />
            <BuyMeCoffeePopup coffeeLink="https://www.buymeacoffee.com/oakcodeandtechsolutions" />
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
