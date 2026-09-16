import { PROJECT_IMAGE_PLACEHOLDER } from '@/lib/site';

export interface OperatedSite {
  name: string;
  url: string;
  stack: string;
  portfolioDescription: string;
  publicationDescription: string;
}

export interface Publication {
  name: string;
  url: string;
  description: string;
  stack: string;
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
      'Australian directory of op shops, thrift stores, and charity retailers. Find stores by suburb and read donation guidance.',
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
      'A directory of computer repair services, organised by location to help people find nearby businesses.',
    publicationDescription:
      'Find local computer repair businesses and read guides to common repair questions.',
  },
  {
    name: 'Laundry Services Near Me',
    url: 'https://laundryservicesnear.me',
    stack: 'WordPress, PHP, ACF',
    portfolioDescription:
      'A directory for finding laundromats, dry cleaners and laundry services by location.',
    publicationDescription:
      'Find Australian laundromats and dry cleaners, with guides to the services they offer.',
  },
  {
    name: 'EV Charger Near Me',
    url: 'https://evchargernear.me',
    stack: 'WordPress, PHP, ACF',
    portfolioDescription:
      'A directory of public EV charging stations with location search and station details.',
    publicationDescription:
      'Australian EV charger finder with suburb and station pages covering networks across the country.',
  },
  {
    name: 'The Granny Flat Guide',
    url: 'https://thegrannyflatguide.com',
    stack: 'WordPress, PHP',
    portfolioDescription:
      'Granny flat guide with builder listings, cost notes, and community reviews across Australia.',
    publicationDescription:
      'An Australian guide to granny flat costs, planning considerations and builder listings.',
  },
  {
    name: 'Modern Home Tech',
    url: 'https://modernhome.cloud',
    stack: 'WordPress, PHP',
    portfolioDescription: 'Curated smart home product guides with reviews and comparison tools.',
    publicationDescription:
      'Smart home guides focused on compatibility, privacy, and total cost of ownership in Australia.',
  },
];

export const operatedPublications: Publication[] = operatedSites.map((site) => ({
  name: site.name,
  url: site.url,
  description: site.publicationDescription,
  stack: site.stack,
}));

export function operatedSiteProjects() {
  return operatedSites.map((site) => ({
    title: site.name,
    description: site.portfolioDescription,
    image: PROJECT_IMAGE_PLACEHOLDER,
    links: [{ type: 'external' as const, label: 'Visit Site', url: site.url }],
    technologies: site.stack.split(', '),
    category: 'web' as const,
  }));
}
