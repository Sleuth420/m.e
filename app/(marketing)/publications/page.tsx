import type { Metadata } from 'next';
import Link from 'next/link';
import { DepthCard } from '@/components/ui/depth-card';
import { PageHero } from '@/components/ui/page-hero';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { operatedPublications } from '@/lib/publications-data';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Publications | Independent Australian directories & guides | OakCodeAndTechSolutions',
  description:
    'Independent Australian directories and research sites built and maintained by OakCodeAndTechSolutions. Each property has its own editorial standards.',
  type: 'website',
  canonical: `${BASE_URL}/publications`,
});

export default function PublicationsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Publications operated by OakCodeAndTechSolutions',
    url: `${BASE_URL}/publications`,
    description:
      'Independent Australian directories and guides built and maintained by OakCodeAndTechSolutions.',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: { '@id': `${BASE_URL}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageHero
        badge="Operator portfolio"
        title="Publications"
        description="Independent Australian directories and research sites — each with its own name, editorial standards, and audience."
      />
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <p className="text-muted-foreground mb-10">
            These are reader-first resources, not a link network. Niche sites link here only via
            standard legal footer disclosure.
          </p>
          <ul className="grid gap-6">
            {operatedPublications.map((pub) => (
              <li key={pub.url}>
                <DepthCard className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="font-display text-xl font-semibold">{pub.name}</h2>
                    <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                  <p className="text-muted-foreground mb-2">{pub.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">Stack: {pub.stack}</p>
                  <Button asChild variant="outline" size="sm" className="chrome-border">
                    <Link href={pub.url} rel="noopener noreferrer">
                      Visit {pub.name}
                    </Link>
                  </Button>
                </DepthCard>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="gradient-bg text-primary-foreground">
              <Link href="/contact">Contact via form</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
