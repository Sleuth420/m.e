'use client';

import Link from 'next/link';
import { Github, Zap, Coffee, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllServiceSlugs } from '@/lib/services-data';

export default function Footer() {
  const serviceSlugs = getAllServiceSlugs();

  const electricalServices = serviceSlugs.filter(
    (slug) => slug.includes('electrician') || slug.includes('electrical')
  );
  const webDevServices = serviceSlugs.filter(
    (slug) =>
      slug.includes('developer') ||
      slug.includes('development') ||
      slug.includes('web') ||
      slug.includes('app')
  );

  const triggerKonami = () => {
    window.triggerKonami?.();
  };

  return (
    <footer className="relative border-t border-border/50 bg-surface-1/80 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="absolute inset-0 retro-grid opacity-30 pointer-events-none" aria-hidden />
      <div className="container relative py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-full bg-primary p-1.5">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold gradient-text">Ricky</span>
            </Link>
            <p className="text-sm text-muted-foreground text-body">
              A-Grade licensed electrician and full-stack developer serving Melbourne. Professional
              electrical services and web development solutions.
            </p>
            <div className="flex items-center gap-3">
              <Button size="sm" className="gradient-bg text-primary-foreground text-xs min-h-10" asChild>
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
                className="rounded-md p-2.5 hover:bg-muted transition-colors touch-target min-h-11 min-w-11 inline-flex items-center justify-center"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm text-primary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/services', label: 'Services' },
                { href: '/projects', label: 'Projects' },
                { href: '/contact', label: 'Contact' },
                { href: '/publications', label: 'Publications' },
                { href: '/blog', label: 'Blog' },
                { href: '/pricing', label: 'Pricing' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm text-primary">Electrical Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/electrician-melbourne"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Electrician Melbourne
                </Link>
              </li>
              <li>
                <Link
                  href="/services/electrician-melbourne-cbd"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Electrician Melbourne CBD
                </Link>
              </li>
              <li>
                <Link
                  href="/services/electrician-western-suburbs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Western Suburbs
                </Link>
              </li>
              {electricalServices.slice(3, 6).map((slug) => {
                const serviceName = slug
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                return (
                  <li key={slug}>
                    <Link
                      href={`/services/${slug}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {serviceName}
                    </Link>
                  </li>
                );
              })}
              {electricalServices.length > 6 && (
                <li>
                  <Link
                    href="/services"
                    className="text-muted-foreground hover:text-primary transition-colors text-xs"
                  >
                    View All Electrical Services →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm text-primary">Web Development</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/wordpress-developer-melbourne"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  WordPress Developer
                </Link>
              </li>
              <li>
                <Link
                  href="/services/web-developer-melbourne"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Web Developer
                </Link>
              </li>
              <li>
                <Link
                  href="/services/app-development-melbourne"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  App Development
                </Link>
              </li>
              {webDevServices.slice(3, 6).map((slug) => {
                const serviceName = slug
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                return (
                  <li key={slug}>
                    <Link
                      href={`/services/${slug}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {serviceName}
                    </Link>
                  </li>
                );
              })}
              {webDevServices.length > 6 && (
                <li>
                  <Link
                    href="/services"
                    className="text-muted-foreground hover:text-primary transition-colors text-xs"
                  >
                    View All Web Services →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
          <Button
            size="sm"
            variant="outline"
            onClick={triggerKonami}
            className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
          >
            <Gamepad2 className="mr-2 h-3 w-3" />
            <span className="text-xs">Konami Mode</span>
          </Button>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Built with care by{' '}
            <Link
              href="https://github.com/Sleuth420"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              OakCodeAndTechSolutions
            </Link>
          </p>
        </div>
      </div>

      <div className="border-t border-border/50 bg-surface-0/80">
        <div className="container py-4">
          <p className="text-center text-xs text-muted-foreground">
            ABN: 48 113 774 962 | Legal Disclosure: In accordance with the Bankruptcy Act 1966,
            please be advised that the proprietor, Richard (Ricky) Oakley, is an undischarged
            bankrupt.
          </p>
        </div>
      </div>
    </footer>
  );
}
