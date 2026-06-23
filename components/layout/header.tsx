'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Menu, X, Code, Wrench, Building2, Globe } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useScrollPosition } from '@/lib/hooks';
import {
  mainNav,
  megaMenuSections,
  megaMenuAllLinks,
} from '@/lib/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const megaMenuIcons = {
  electrical: Wrench,
  'web-dev': Code,
  company: Building2,
} as const;

export default function Header() {
  const isScrolled = useScrollPosition();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-border/50 bg-background/90 backdrop-blur-md transition-shadow duration-300 pt-[env(safe-area-inset-top)]',
        isScrolled && 'shadow-glow'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="rounded-full bg-primary p-1.5 shadow-glow transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold gradient-text">Ricky</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                isActive(item.href) ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setIsMegaOpen(!isMegaOpen)}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1',
              isMegaOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground'
            )}
            aria-expanded={isMegaOpen}
            aria-controls="mega-menu"
          >
            <Globe className="h-4 w-4" />
            Explore
          </button>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2.5 text-foreground hover:bg-muted transition-colors touch-target min-h-11 min-w-11"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMegaOpen && (
        <div
          id="mega-menu"
          className="hidden lg:block border-t border-border/50 bg-surface-1/95 backdrop-blur-md"
        >
          <div className="container grid grid-cols-3 gap-8 py-8">
            {megaMenuSections.map((section) => {
              const Icon = megaMenuIcons[section.key];
              const allLink =
                section.key === 'electrical' || section.key === 'web-dev'
                  ? megaMenuAllLinks[section.key]
                  : null;

              return (
                <div key={section.key}>
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
                    <Icon className="h-4 w-4" />
                    {section.title}
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMegaOpen(false)}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {allLink && (
                      <li>
                        <Link
                          href={allLink.href}
                          onClick={() => setIsMegaOpen(false)}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {allLink.label}
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/98 backdrop-blur-md max-h-[80vh] overflow-y-auto">
          <nav className="container py-4 space-y-1" aria-label="Mobile navigation">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3.5 min-h-11 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-4 border-t border-border/50 pt-4">
              {megaMenuSections.map((section) => (
                <div key={section.key} className="mb-4">
                  <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-primary">
                    {section.title}
                  </p>
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 min-h-11 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
