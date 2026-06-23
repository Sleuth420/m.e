export interface Publication {
  name: string;
  url: string;
  description: string;
  stack: string;
}

/** Independent directories and guides operated by OakCodeAndTechSolutions. */
export const operatedPublications: Publication[] = [
  {
    name: 'Op Shops Hub',
    url: 'https://opshopshub.com',
    description:
      'Australian directory of op shops, thrift stores, and charity retailers. Built for suburb-level discovery and donation guidance.',
    stack: 'WordPress, PHP, ACF',
  },
  {
    name: 'Dog Grooming Australia',
    url: 'https://dog-grooming.online',
    description:
      'Directory of mobile and salon dog groomers across Australia with price guides and location search.',
    stack: 'WordPress, PHP, ACF',
  },
  {
    name: 'Computer Repairs Near Me',
    url: 'https://computerrepairsnear.me',
    description:
      'Local computer repair directory with suburb pages, listing methodology, and practical repair guides.',
    stack: 'WordPress, PHP, ACF',
  },
  {
    name: 'Laundry Services Near Me',
    url: 'https://laundryservicesnear.me',
    description:
      'Australian laundromat and dry-cleaner directory with suburb finders and service explainers.',
    stack: 'WordPress, PHP, ACF',
  },
  {
    name: 'The Granny Flat Guide',
    url: 'https://thegrannyflatguide.com',
    description:
      'Independent research on granny flat costs, approval pathways, and state rules — not a builder.',
    stack: 'WordPress, PHP',
  },
  {
    name: 'Modern Home Tech',
    url: 'https://modernhome.cloud',
    description:
      'Smart home guides focused on compatibility, privacy, and total cost of ownership in Australia.',
    stack: 'WordPress, PHP',
  },
];
