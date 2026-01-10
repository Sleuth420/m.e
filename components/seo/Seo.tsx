import { Metadata } from 'next';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  canonical?: string; // Dynamic canonical URL per page
}

export const generateSeoMetadata = ({
  title = 'Ricky - OakCodeAndTechSolutions | Full-Stack Developer & Electrician',
  description = 'OakCodeAndTechSolutions: A-Grade licensed electrician and full-stack developer in Melbourne. Professional electrical services and web development solutions. Specializing in WordPress, custom web applications, embedded systems, and electrical services.',
  image = 'https://www.oakcodeandtechsolutions.com/placeholder-user.jpg',
  type = 'profile',
  publishedTime,
  modifiedTime,
  author = 'Ricky',
  keywords = [
    // Brand-specific keywords (for brand recognition)
    'OakCodeAndTechSolutions',
    'OakCodeAndTechSolutions Melbourne',
    'OakCodeAndTechSolutions electrician',
    'OakCodeAndTechSolutions web developer',
    'OakCodeAndTechSolutions solutions',
    // High-value primary keywords (top priority for ranking)
    'electrician melbourne',
    'wordpress developer melbourne',
    'electrician melbourne cbd',
    'emergency electrician melbourne',
    'app developer melbourne',
    'web developer melbourne',
    '24 hour electrician melbourne',
    'licensed electrician melbourne',
    'full stack developer melbourne',
    'website developer melbourne',

    // Location-specific electrician suburbs (high search volume)
    'electrician craigieburn',
    'electrician caroline springs',
    'electrician port melbourne',
    'electrician essendon',
    'electrician st kilda',
    'electrician glenroy',
    'electrician glen waverley',
    'electrician south melbourne',
    'electrician western suburbs',

    // Core professional services
    'A-Grade Licensed Electrician Melbourne',
    'WordPress developer',
    'React developer Melbourne',
    'Vue.js developer Melbourne',
    'Django developer Melbourne',
    'custom web development melbourne',
    'app development melbourne',
    'website development melbourne',

    // Long-tail high-intent keywords
    'emergency electrician near me',
    '24 hour electrician near me',
    'licensed electrician near me',
    'wordpress developer near me',
    'web developer near me',
  ],
  canonical,
}: SeoProps = {}): Metadata => {
  const baseUrl = 'https://www.oakcodeandtechsolutions.com';
  const canonicalUrl = canonical || baseUrl;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    keywords,
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
    // Additional metadata for better SEO
    authors: [{ name: author }],
    creator: author,
    publisher: 'OakCodeAndTechSolutions',
    category: 'Technology',
    classification: 'Business',
  };
};
