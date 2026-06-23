import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ServicePageLayout } from '@/components/layout/service-page-layout';
import {
  getAllServiceSlugs,
  getServicePageData,
  generateServiceMetadata,
} from '@/lib/services-data';
import { BASE_URL } from '@/lib/site';

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const metadata = generateServiceMetadata(slug);

  if (!metadata) {
    return { title: 'Service Not Found' };
  }

  return metadata;
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const serviceData = getServicePageData(slug);

  if (!serviceData) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Home', url: BASE_URL },
    { name: 'Services', url: `${BASE_URL}/services` },
    { name: serviceData.title, url: `${BASE_URL}/services/${slug}` },
  ];

  const allSlugs = getAllServiceSlugs().filter((s) => s !== slug);
  const sameCategory = allSlugs.filter(
    (s) => getServicePageData(s)?.category === serviceData.category
  );
  const otherCategory = allSlugs.filter(
    (s) => getServicePageData(s)?.category !== serviceData.category
  );
  const relatedSlugs = [...sameCategory.slice(0, 3), ...otherCategory].slice(0, 6);
  const relatedServices = relatedSlugs
    .map((s) => ({ slug: s, data: getServicePageData(s) }))
    .filter(
      (r): r is { slug: string; data: NonNullable<ReturnType<typeof getServicePageData>> } =>
        r.data !== null
    );

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceData.title.split('|')[0].trim(),
    description: serviceData.description,
    url: `${BASE_URL}/services/${slug}`,
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: serviceData.location
      ? { '@type': 'City', name: serviceData.location, addressCountry: 'AU' }
      : { '@type': 'City', name: 'Melbourne', addressCountry: 'AU' },
  };

  const faqSchema =
    serviceData.content.faqs && serviceData.content.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: serviceData.content.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ServicePageLayout
        serviceData={serviceData}
        relatedServices={relatedServices}
      />
    </>
  );
}
