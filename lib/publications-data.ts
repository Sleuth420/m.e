import { operatedSites } from './operated-sites';

export interface Publication {
  name: string;
  url: string;
  description: string;
  stack: string;
}

export const operatedPublications: Publication[] = operatedSites.map((site) => ({
  name: site.name,
  url: site.url,
  description: site.publicationDescription,
  stack: site.stack,
}));
