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
}

export const generateSeoMetadata = ({
  title = 'Ricky - OakCodeAndTechSolutions | Full-Stack Developer & Electrician',
  description = 'Dual trade professional: Full-stack developer and licensed electrician. Specializing in WordPress, custom web development, embedded systems, and electrical services. Bridge the gap between traditional trades and modern technology.',
  image = 'https://oakcodeandtechsolutions.com/placeholder-user.jpg',
  type = 'profile',
  publishedTime,
  modifiedTime,
  author = 'Ricky',
  keywords = [
    // Core identity
    'OakCode',
    'OakCodeAndTechSolutions',
    'Oak Code and Tech Solutions',
    'Oak Code and Tech',
    'Oak Code',
    'Tech Solutions',
    'Tech',
    'Code',
    'Code and Tech',
    'Code and Tech Solutions',
    'Code and Tech',
    'Code and Tech Solutions',
    'Code and Tech',
    'Code and Tech Solutions',
    'Ricky',
    'Ricky Oakley',

    // Professional roles
    'Full-stack developer',
    'Full stack developer',
    'Electrician',
    'Licensed electrician',
    'Dual trade',
    'Business owner',
    'A-Grade Licensed Electrician',
    'A-Grade Licensed Electrician Melbourne',
    'A-Grade Licensed Electrician Australia',


    // Web development
    'Web developer',
    'Web development',
    'WordPress developer',
    'WordPress',
    'WooCommerce',
    'Custom web development',
    'React developer',
    'React',
    'Next.js',
    'Vue.js developer',
    'Vue.js',
    'Django developer',
    'Django',
    'Python developer',
    'Python',
    'Node.js developer',
    'Node.js',

    // Services
    'Embedded systems',
    'Raspberry Pi',
    'IoT solutions',
    'Electrical services',
    'Residential electrical',
    'Commercial electrical',
    'Industrial electrical',
    'Smart home integration',
    'Digital marketing',
    'SEO services',
    'Content writing',
    'IT setup',
    'Business infrastructure',
    'Cybersecurity',
    'Penetration testing',
    'CAD drawings',
    '3D modeling',
    'Blender',
    'AI workflows',

    // Location
    'Melbourne',
    'Australia',
    'Melbourne developer',
    'Melbourne electrician',

    // Industry terms
    'Technology solutions',
    'Business solutions',
    'Problem solving',
    'Customer focused',
    'Practical solutions',
    'Real-world experience',

    // Long-tail keywords
    'WordPress developer Melbourne',
    'Electrician who codes',
    'Developer electrician',
    'Custom website development',
    'Business website design',
    'E-commerce development',
    'WordPress WooCommerce',
    'Embedded systems development',
    'IoT project development',
    'Electrical contracting services',
    'Smart home automation',
    'Digital marketing Melbourne',
    'SEO optimization services',
    'Business IT setup',
    'Cybersecurity consulting',
    '3D modeling services',
    'CAD design services',
  ],
}: SeoProps = {}): Metadata => {
  const baseUrl = 'https://oakcodeandtechsolutions.com';

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: baseUrl,
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
      canonical: baseUrl,
    },
    // Additional metadata for better SEO
    authors: [{ name: author }],
    creator: author,
    publisher: 'OakCodeAndTechSolutions',
    category: 'Technology',
    classification: 'Business',
    // other: {
    //   'google-site-verification': 'your-verification-code', // Add your Google Search Console verification
    //   'msvalidate.01': 'your-bing-verification-code', // Add your Bing Webmaster Tools verification
    // },
  };
};
