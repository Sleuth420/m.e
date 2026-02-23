import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import { getAllServiceSlugs, getServicePageData } from '@/lib/services-data';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const baseUrl = 'https://www.oakcodeandtechsolutions.com';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Services | Electrical & Web Development Melbourne | OakCodeAndTechSolutions',
  description:
    'Professional electrical services and web development in Melbourne. Licensed electrician, WordPress development, custom apps, IoT, SEO, cybersecurity, and CAD design. View all services.',
  canonical: `${baseUrl}/services`,
  keywords: [
    'electrician melbourne',
    'web developer melbourne',
    'wordpress developer melbourne',
    'electrical services melbourne',
    'website development melbourne',
    'seo services melbourne',
    'cybersecurity melbourne',
  ],
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
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                All Services
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Electrical, web development, and technology services across Melbourne. Choose a service to learn more.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-16">
              {(Object.entries(byCategory) as [keyof typeof byCategory, string[]][]).map(
                ([category, categorySlugs]) => {
                  if (categorySlugs.length === 0) return null;
                  return (
                    <div key={category}>
                      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                        {getCategoryLabel(category)}
                      </h2>
                      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categorySlugs.map((slug) => {
                          const data = getServicePageData(slug);
                          if (!data) return null;
                          return (
                            <li key={slug}>
                              <Link href={`/services/${slug}`} className="block h-full">
                                <Card className="h-full border-orange-500/20 hover:border-orange-500/50 transition-colors hover:shadow-md">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-semibold flex items-center justify-between gap-2">
                                      <span className="line-clamp-2">{data.title.split('|')[0].trim()}</span>
                                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-orange-500" />
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>
                                  </CardContent>
                                </Card>
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
      </main>
      <Footer />
    </>
  );
}
