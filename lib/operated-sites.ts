export interface OperatedSite {
  name: string;
  url: string;
  stack: string;
  portfolioDescription: string;
  publicationDescription: string;
}

/** Directories and guides operated by OakCodeAndTechSolutions. */
export const operatedSites: OperatedSite[] = [
  {
    name: 'Op Shops Hub',
    url: 'https://opshopshub.com',
    stack: 'WordPress, PHP, ACF',
    portfolioDescription:
      'Op shop directory helping shoppers find charity stores and opening hours across regions.',
    publicationDescription:
      'Australian directory of op shops, thrift stores, and charity retailers. Built for suburb-level discovery and donation guidance.',
  },
  {
    name: 'Dog Grooming Australia',
    url: 'https://dog-grooming.online',
    stack: 'WordPress, PHP, ACF',
    portfolioDescription:
      'Australia-wide dog groomer directory with location search and business listings.',
    publicationDescription:
      'Directory of mobile and salon dog groomers across Australia with price guides and location search.',
  },
  {
    name: 'Computer Repairs Near Me',
    url: 'https://computerrepairsnear.me',
    stack: 'WordPress, PHP, ACF',
    portfolioDescription:
      'Programmatic SEO directory for computer repair services with location-based landing pages.',
    publicationDescription:
      'Local computer repair directory with suburb pages, listing methodology, and practical repair guides.',
  },
  {
    name: 'Laundry Services Near Me',
    url: 'https://laundryservicesnear.me',
    stack: 'WordPress, PHP, ACF',
    portfolioDescription:
      'Programmatic SEO directory for laundry services with location-based pages and service listings.',
    publicationDescription:
      'Australian laundromat and dry-cleaner directory with suburb finders and service explainers.',
  },
  {
    name: 'The Granny Flat Guide',
    url: 'https://thegrannyflatguide.com',
    stack: 'WordPress, PHP',
    portfolioDescription:
      'Granny flat guide with builder listings, cost notes, and community reviews across Australia.',
    publicationDescription:
      'Independent research on granny flat costs, approval pathways, and state rules — not a builder.',
  },
  {
    name: 'Modern Home Tech',
    url: 'https://modernhome.cloud',
    stack: 'WordPress, PHP',
    portfolioDescription:
      'Curated smart home product guides with reviews and comparison tools.',
    publicationDescription:
      'Smart home guides focused on compatibility, privacy, and total cost of ownership in Australia.',
  },
];

export function operatedSiteProjects() {
  return operatedSites.map((site) => ({
    title: site.name,
    description: site.portfolioDescription,
    image: '/placeholder.svg?height=400&width=600',
    links: [{ type: 'external' as const, label: 'Visit Site', url: site.url }],
    technologies: site.stack.split(', '),
  }));
}
