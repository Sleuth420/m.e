import { ServicePageData } from './services-data';

const baseUrl = 'https://www.oakcodeandtechsolutions.com';

export function generateBreadcrumbSchema(slug: string, title: string) {
  const serviceUrl = `${baseUrl}/services/${slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${baseUrl}/#services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: serviceUrl,
      },
    ],
  };
}

export function generateServiceSchema(data: ServicePageData) {
  const serviceUrl = `${baseUrl}/services/${data.slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${serviceUrl}#service`,
    name: data.title,
    description: data.description,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}#organization`,
      name: 'OakCodeAndTechSolutions',
      url: baseUrl,
      email: 'oakcodeandtechsolutions@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'Victoria',
        addressCountry: 'Australia',
        postalCode: '3000',
      },
    },
    areaServed: {
      '@type': 'City',
      name: data.location || 'Melbourne',
      addressCountry: 'Australia',
    },
    serviceType: data.content.features,
    category: data.category,
    url: serviceUrl,
    ...(data.location && {
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceLocation: {
          '@type': 'City',
          name: data.location,
          addressCountry: 'Australia',
        },
      },
    }),
  };
}

