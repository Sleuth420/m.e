export interface NavLink {
  href: string;
  label: string;
}

export const mainNav: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export const featuredElectricalLinks: NavLink[] = [
  { href: '/services/electrician-melbourne', label: 'Licensed Electrician' },
  { href: '/services/electrician-melbourne-cbd', label: 'CBD & Apartments' },
];

export const featuredWebDevLinks: NavLink[] = [
  { href: '/services/web-developer-melbourne', label: 'Web Developer' },
  { href: '/services/iot-solutions-melbourne', label: 'IoT' },
  { href: '/services/app-development-melbourne', label: 'Apps' },
];

export const companyLinks: NavLink[] = [
  { href: '/publications', label: 'Publications' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export const footerQuickLinks: NavLink[] = [
  ...mainNav,
  { href: '/publications', label: 'Publications' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
];

export const megaMenuSections = [
  { key: 'electrical' as const, title: 'Electrical', links: featuredElectricalLinks },
  { key: 'web-dev' as const, title: 'Digital', links: featuredWebDevLinks },
  { key: 'company' as const, title: 'Company', links: companyLinks },
];

export const megaMenuAllLinks: Record<'electrical' | 'web-dev', NavLink> = {
  electrical: { href: '/services', label: 'All Electrical Services' },
  'web-dev': { href: '/services', label: 'All digital services' },
};

export function formatServiceSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function isElectricalSlug(slug: string): boolean {
  return slug.includes('electrician') || slug.includes('electrical');
}

export function isWebDevSlug(slug: string): boolean {
  return (
    slug.includes('developer') ||
    slug.includes('development') ||
    slug.includes('web') ||
    slug.includes('app')
  );
}

export function serviceNavLink(slug: string): NavLink {
  return { href: `/services/${slug}`, label: formatServiceSlug(slug) };
}
