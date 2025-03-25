import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AvailableForWorkPopup } from '@/components/ui/available-for-work-popup';
import { BuyMeCoffeePopup } from '@/components/ui/buy-me-coffee-popup';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Ricky - OakCodeAndTechSolutions',
  description: 'Full-stack developer & electrician specializing in modern web technologies',
  metadataBase: new URL('https://profile.oakcodeandtechsolutions.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <AvailableForWorkPopup />
          <BuyMeCoffeePopup coffeeLink="https://www.buymeacoffee.com/oakcodeandtechsolutions" />
        </ThemeProvider>
      </body>
    </html>
  );
}
