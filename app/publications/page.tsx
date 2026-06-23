import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { operatedPublications } from '@/lib/publications-data';

const baseUrl = 'https://www.oakcodeandtechsolutions.com';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Publications | Independent Australian directories & guides | OakCodeAndTechSolutions',
  description:
    'Independent Australian directories and research sites built and maintained by OakCodeAndTechSolutions. Each property has its own editorial standards.',
  type: 'website',
  canonical: `${baseUrl}/publications`,
  keywords: [
    'OakCodeAndTechSolutions publications',
    'Australian web directories',
    'independent publisher Melbourne',
  ],
});

export default function PublicationsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Publications operated by OakCodeAndTechSolutions',
    url: `${baseUrl}/publications`,
    description:
      'Independent Australian directories and guides built and maintained by OakCodeAndTechSolutions.',
    isPartOf: { '@id': `${baseUrl}/#website` },
    publisher: { '@id': `${baseUrl}/#organization` },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main className="flex-1">
        <section className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-sm font-medium text-orange-600 mb-3">Operator portfolio</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Publications</h1>
            <p className="text-lg text-muted-foreground mb-4">
              I build and maintain a small set of independent Australian directories and research
              sites. Each has its own name, editorial standards, and audience. I am the operator —
              not the businesses listed on directory sites.
            </p>
            <p className="text-muted-foreground mb-10">
              These are reader-first resources, not a link network. Niche sites link here only via
              standard legal footer disclosure.
            </p>

            <ul className="grid gap-6">
              {operatedPublications.map((pub) => (
                <li key={pub.url}>
                  <Card className="border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl flex items-center justify-between gap-4">
                        <span>{pub.name}</span>
                        <ArrowRight className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">{pub.description}</p>
                      <p className="text-xs text-muted-foreground">Stack: {pub.stack}</p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={pub.url} rel="noopener noreferrer">
                          Visit {pub.name}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>

            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link href="/#contact">Contact via form</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
