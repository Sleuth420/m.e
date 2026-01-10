'use client';

import Link from 'next/link';
import { Github, Zap, Coffee, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllServiceSlugs } from '@/lib/services-data';

export default function Footer() {
  const serviceSlugs = getAllServiceSlugs();
  
  // Categorize services
  const electricalServices = serviceSlugs.filter(slug => 
    slug.includes('electrician') || slug.includes('electrical')
  );
  const webDevServices = serviceSlugs.filter(slug => 
    slug.includes('developer') || slug.includes('development') || slug.includes('web') || slug.includes('app')
  );
  const otherServices = serviceSlugs.filter(slug => 
    !electricalServices.includes(slug) && !webDevServices.includes(slug)
  );

  const triggerKonami = () => {
    if (typeof window !== 'undefined' && (window as any).triggerKonami) {
      (window as any).triggerKonami();
    }
  };

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Footer Content */}
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-full bg-orange-600 p-1">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="inline-block font-bold gradient-text">Ricky</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A-Grade licensed electrician and full-stack developer serving Melbourne. Professional electrical services and web development solutions.
            </p>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs"
                asChild
              >
                <Link
                  href="https://www.buymeacoffee.com/oakcodeandtechsolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Coffee className="mr-2 h-3 w-3" />
                  Buy Me a Coffee
                </Link>
              </Button>
              <Link
                href="https://github.com/Sleuth420"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted-foreground transition-colors p-2"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Electrical Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Electrical Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/electrician-melbourne" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  Electrician Melbourne
                </Link>
              </li>
              <li>
                <Link href="/services/emergency-electrician-melbourne" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  Emergency Electrician
                </Link>
              </li>
              <li>
                <Link href="/services/24-hour-electrician-melbourne" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  24 Hour Electrician
                </Link>
              </li>
              {electricalServices.slice(3, 6).map((slug) => {
                const serviceName = slug
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                return (
                  <li key={slug}>
                    <Link href={`/services/${slug}`} className="text-muted-foreground hover:text-orange-600 transition-colors">
                      {serviceName}
                    </Link>
                  </li>
                );
              })}
              {electricalServices.length > 6 && (
                <li>
                  <Link href="/#services" className="text-muted-foreground hover:text-orange-600 transition-colors text-xs">
                    View All Electrical Services →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Web Development Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Web Development</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/wordpress-developer-melbourne" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  WordPress Developer
                </Link>
              </li>
              <li>
                <Link href="/services/web-developer-melbourne" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  Web Developer
                </Link>
              </li>
              <li>
                <Link href="/services/app-developer-melbourne" className="text-muted-foreground hover:text-orange-600 transition-colors">
                  App Developer
                </Link>
              </li>
              {webDevServices.slice(3, 6).map((slug) => {
                const serviceName = slug
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                return (
                  <li key={slug}>
                    <Link href={`/services/${slug}`} className="text-muted-foreground hover:text-orange-600 transition-colors">
                      {serviceName}
                    </Link>
                  </li>
                );
              })}
              {webDevServices.length > 6 && (
                <li>
                  <Link href="/#services" className="text-muted-foreground hover:text-orange-600 transition-colors text-xs">
                    View All Web Services →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Konami Button & Social Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={triggerKonami}
              className="border-orange-500/30 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              <Gamepad2 className="mr-2 h-3 w-3" />
              <span className="text-xs">🎮 Konami Mode</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Built with ❤️ by{' '}
            <Link
              href="https://github.com/Sleuth420"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-orange-600"
            >
              OakCodeAndTechSolutions
            </Link>
          </p>
        </div>
      </div>

      {/* Legal Disclosure */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <p className="text-center text-xs text-muted-foreground">
            ABN: 48 113 774 962 | Legal Disclosure: In accordance with the Bankruptcy Act 1966, please be advised that the proprietor, Richard (Ricky) Oakley, is an undischarged bankrupt.
          </p>
        </div>
      </div>
    </footer>
  );
}
