import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllServiceSlugs, getServicePageData } from '@/lib/services-data';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PageHero } from '@/components/ui/page-hero';
import { DepthCard } from '@/components/ui/depth-card';
import { ArrowRight } from 'lucide-react';

const baseUrl = 'https://www.oakcodeandtechsolutions.com';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Services | Electrical & Web Development Melbourne | OakCodeAndTechSolutions',
  description:
    'Professional electrical services and web development in Melbourne. Licensed electrician, WordPress development, custom apps, IoT, SEO, cybersecurity, and CAD design. View all services.',
  canonical: `${baseUrl}/services`,
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
    { name: 'Home', url: baseUrl },
    { name: 'Services', url: `${baseUrl}/services` },
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
          url: `${baseUrl}/services/${s}`,
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
                              <Link href={`/services/${slug}`} className="block h-full group">
                                <DepthCard className="h-full p-5">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-display font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                      {data.title.split('|')[0].trim()}
                                    </h3>
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>
                                </DepthCard>
                              </Link>
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
