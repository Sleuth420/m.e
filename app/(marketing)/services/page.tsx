import type { Metadata } from 'next';
import { getAllServiceSlugs, getServicePageData } from '@/lib/services-data';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PageHero } from '@/components/ui/page-hero';
import { ServiceLinkCard } from '@/components/services/service-link-card';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Services | Electrical & Web Development Melbourne | OakCodeAndTechSolutions',
  description:
    'Professional electrical services and web development in Melbourne. Licensed electrician, WordPress development, custom apps, IoT, SEO, cybersecurity, and CAD design. View all services.',
  canonical: `${BASE_URL}/services`,
});

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'electrical':
      return 'Electrical';
    case 'web-dev':
      return 'Web Development';
    case 'app-dev':
      return 'App & Software';
    case 'other':
      return 'Other Services';
    default:
      return 'Services';
  }
}

export default function ServicesIndexPage() {
  const slugs = getAllServiceSlugs();
  const byCategory = {
    electrical: slugs.filter((s) => getServicePageData(s)?.category === 'electrical'),
    'web-dev': slugs.filter((s) => getServicePageData(s)?.category === 'web-dev'),
    'app-dev': slugs.filter((s) => getServicePageData(s)?.category === 'app-dev'),
    other: slugs.filter((s) => getServicePageData(s)?.category === 'other'),
  };

  const breadcrumbItems = [
    { name: 'Home', url: BASE_URL },
    { name: 'Services', url: `${BASE_URL}/services` },
  ];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'OakCodeAndTechSolutions Services',
    description: 'Professional electrical and web development services in Melbourne.',
    numberOfItems: slugs.length,
    itemListElement: slugs.map((s, i) => {
      const data = getServicePageData(s);
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: data?.title.split('|')[0].trim() ?? s,
          url: `${BASE_URL}/services/${s}`,
        },
      };
    }),
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageHero
        title="All Services"
        description="Electrical, web development, and technology services across Melbourne. Choose a service to learn more."
      />
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-6xl mx-auto space-y-16">
              {(Object.entries(byCategory) as [keyof typeof byCategory, string[]][]).map(
                ([category, categorySlugs]) => {
                  if (categorySlugs.length === 0) return null;
                  return (
                    <div key={category}>
                      <h2 className="font-display text-2xl font-bold mb-6 text-foreground">
                        {getCategoryLabel(category)}
                      </h2>
                      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categorySlugs.map((slug) => {
                          const data = getServicePageData(slug);
                          if (!data) return null;
                          return (
                            <li key={slug}>
                              <ServiceLinkCard
                                href={`/services/${slug}`}
                                title={data.title.split('|')[0].trim()}
                                description={data.description}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                }
              )}
            </div>
          </div>
      </section>
    </>
  );
}
