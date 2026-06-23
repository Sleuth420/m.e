import { Metadata } from 'next';
import { BASE_URL, DEFAULT_OG_IMAGE } from '@/lib/site';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  canonical?: string;
}

export const generateSeoMetadata = ({
  title = 'Ricky | OakCodeAndTechSolutions — Electrician & Web Developer Melbourne',
  description =
    'A-Grade licensed electrician and full-stack developer in Melbourne. Electrical work, WordPress sites, and custom web apps. Quotes via the contact form.',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Ricky',
  canonical,
}: SeoProps = {}): Metadata => {
  const canonicalUrl = canonical || BASE_URL;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'OakCodeAndTechSolutions',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      publishedTime,
      modifiedTime,
      authors: [author],
      locale: 'en_AU',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: author }],
    creator: author,
    publisher: 'OakCodeAndTechSolutions',
    category: 'Technology',
    classification: 'Business',
  };
};
