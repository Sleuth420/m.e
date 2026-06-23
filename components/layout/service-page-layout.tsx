import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DepthCard } from '@/components/ui/depth-card';
import { PageHero } from '@/components/ui/page-hero';
import { ServiceLinkCard } from '@/components/services/service-link-card';
import { CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';
import type { ServicePageData } from '@/lib/services-data';

interface ServicePageLayoutProps {
  serviceData: ServicePageData;
  relatedServices: {
    slug: string;
    data: NonNullable<ReturnType<typeof import('@/lib/services-data').getServicePageData>>;
  }[];
}

export function ServicePageLayout({ serviceData, relatedServices }: ServicePageLayoutProps) {
  const { content, location } = serviceData;
  const paragraphs = content.paragraphs ?? [];
  const commonJobs = content.commonJobs ?? [];
  const faqs = content.faqs ?? [];

  return (
    <>
      <PageHero
        title={location ? `${content.heading} in ${location}` : content.heading}
        description={content.intro}
      >
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button asChild size="lg" className="gradient-bg text-primary-foreground w-full sm:w-auto min-h-11">
            <Link href="/contact">
              Request a quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="chrome-border w-full sm:w-auto min-h-11">
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </PageHero>

      {paragraphs.length > 0 && (
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container max-w-3xl prose prose-neutral dark:prose-invert">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
            {content.proofLink && (
              <p className="mt-6">
                <Link
                  href={content.proofLink.url}
                  className="text-primary font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content.proofLink.label} →
                </Link>
              </p>
            )}
          </div>
        </section>
      )}

      {commonJobs.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-1/50">
          <div className="container max-w-4xl">
            <h2 className="font-display text-3xl font-bold text-center mb-10 gradient-text">Common jobs</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {commonJobs.map((job, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{job}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-surface-1/50">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center mb-12 gradient-text">What I offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {content.features.map((feature, index) => (
              <DepthCard key={index} className="p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="font-medium">{feature}</p>
                </div>
              </DepthCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Why work with me</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.benefits.map((benefit, index) => (
              <DepthCard key={index} className="p-6 flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>{benefit}</p>
              </DepthCard>
            ))}
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-1/50 border-y border-border/50">
          <div className="container max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-center mb-10">Questions</h2>
            <dl className="space-y-6">
              {faqs.map((faq, index) => (
                <DepthCard key={index} className="p-6">
                  <dt className="font-display font-semibold text-lg mb-2">{faq.question}</dt>
                  <dd className="text-muted-foreground leading-relaxed">{faq.answer}</dd>
                </DepthCard>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="container max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold mb-6">Ready to start?</h2>
          <p className="text-lg text-muted-foreground mb-8">{content.cta}</p>
          <Button asChild size="lg" className="gradient-bg text-primary-foreground w-full sm:w-auto min-h-11">
            <Link href="/contact">
              <MessageSquare className="mr-2 h-5 w-5" />
              Contact via form
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-1/50">
        <div className="container max-w-6xl">
          <h2 className="font-display text-3xl font-bold mb-4 text-center">More services</h2>
          <p className="text-muted-foreground mb-10 text-center">
            Electrical, web development, apps, and related work across Melbourne.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {relatedServices.map(({ slug: relatedSlug, data: related }) => (
              <li key={relatedSlug}>
                <ServiceLinkCard
                  href={`/services/${relatedSlug}`}
                  title={related.title.split('|')[0].trim()}
                  description={related.description}
                />
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="chrome-border">
              <Link href="/services">All services</Link>
            </Button>
            <Button asChild variant="outline" className="chrome-border">
              <Link href="/pricing">Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
