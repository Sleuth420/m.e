import type { Metadata } from 'next';
import Link from 'next/link';
import { DepthCard } from '@/components/ui/depth-card';
import { PageHero } from '@/components/ui/page-hero';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { operatedPublications } from '@/lib/operated-sites';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Publications | Independent Australian directories & guides | OakCodeAndTechSolutions',
  description:
    'Australian directories and guides built and maintained by OakCodeAndTechSolutions, covering local services, shopping, housing and home technology.',
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
        badge="Directories & guides"
        title="Publications"
        description="Alongside client work, I build and maintain Australian directories and guides that help people find local services and research everyday decisions."
      />
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <p className="text-muted-foreground mb-10">
            Each site focuses on a different subject, from finding an op shop to comparing home
            technology. I handle the websites and their ongoing development. Explore them below to
            see the content and features.
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
                  <p className="text-xs text-muted-foreground mb-4">Built with: {pub.stack}</p>
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
              <Link href="/contact">Discuss a website project</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
