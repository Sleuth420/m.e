'use client';

import Link from 'next/link';
import { Zap, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useScrollPosition, useSmoothScroll } from '@/lib/hooks';
import { useState } from 'react';

export default function Header() {
  const isScrolled = useScrollPosition();
  const scrollToSection = useSmoothScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    scrollToSection(e, section);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];

  const externalNavItems = [
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="rounded-full bg-orange-600 p-1">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="inline-block font-bold gradient-text">Ricky</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href.slice(1))}
              className="px-4 py-2 text-sm font-medium transition-colors hover:text-orange-600"
            >
              {item.label}
            </Link>
          ))}
          {externalNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium transition-colors hover:text-orange-600"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground hover:text-orange-600 transition-colors rounded-md hover:bg-orange-50 dark:hover:bg-orange-950/20"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href.slice(1))}
                className="block px-4 py-3 text-sm font-medium transition-colors hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-md"
              >
                {item.label}
              </Link>
            ))}
            {externalNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium transition-colors hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-md"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
