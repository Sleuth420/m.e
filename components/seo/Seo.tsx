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
    // High-value primary keywords (based on research data)
    'electrician melbourne',
    'wordpress developer melbourne',
    'electrician melbourne cbd',
    'emergency electrician melbourne',
    'app developer melbourne',
    'website developer melbourne',
    'web developer melbourne',
    'software developer melbourne',
    '24 hour electrician melbourne',
    'website development melbourne',
    'app development melbourne',

    // Location-specific electrician suburbs (high search volume areas)
    'electrician craigieburn',
    'electrician caroline springs',
    'electrician port melbourne',
    'electrician essendon',
    'electrician st kilda',
    'electrician glenroy',
    'electrician glen waverley',
    'electrician south melbourne',
    'electrician western suburbs',
    'electrician near me melbourne',

    // Core identity
    'OakCode',
    'OakCodeAndTechSolutions',
    'Oak Code and Tech Solutions',
    'Oak Code and Tech',
    'Oak Code',
    'Tech Solutions',
    'Ricky',
    'Ricky Oakley',

    // Professional roles (enhanced with location)
    'Full-stack developer Melbourne',
    'Full stack developer Melbourne',
    'Electrician Melbourne',
    'Licensed electrician Melbourne',
    'Dual trade Melbourne',
    'Business owner Melbourne',
    'A-Grade Licensed Electrician Melbourne',
    'A-Grade Licensed Electrician Australia',
    'WordPress developer',
    'React developer Melbourne',
    'Vue.js developer Melbourne',
    'Django developer Melbourne',

    // Web development services
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
    'Shopify developer',
    'E-commerce development',
    'Custom website development',

    // App development
    'App developer',
    'App development',
    'Mobile app developer',
    'iOS developer Melbourne',
    'Android developer Melbourne',
    'React Native developer',
    'Flutter developer',

    // Services
    'Embedded systems',
    'Raspberry Pi',
    'IoT solutions',
    'Electrical services',
    'Residential electrical',
    'Commercial electrical',
    'Industrial electrical',
    'Emergency electrical',
    '24/7 electrical services',
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

    // Emergency and urgent services
    'Emergency electrician',
    '24 hour electrician',
    'Urgent electrical repairs',
    'After hours electrician',
    'Weekend electrician',

    // Location terms
    'Melbourne',
    'Australia',
    'Melbourne developer',
    'Melbourne electrician',
    'Melbourne web developer',
    'Melbourne app developer',
    'Melbourne CBD electrician',
    'Western suburbs electrician',
    'Inner west electrician',
    'North Melbourne electrician',
    'South Melbourne electrician',

    // Industry terms
    'Technology solutions',
    'Business solutions',
    'Problem solving',
    'Customer focused',
    'Practical solutions',
    'Real-world experience',

    // Long-tail keywords (expanded with research data)
    'WordPress developer Melbourne',
    'Electrician who codes',
    'Developer electrician',
    'Custom website development Melbourne',
    'Business website design Melbourne',
    'E-commerce development Melbourne',
    'WordPress WooCommerce Melbourne',
    'Embedded systems development Melbourne',
    'IoT project development Melbourne',
    'Electrical contracting services Melbourne',
    'Smart home automation Melbourne',
    'Digital marketing Melbourne',
    'SEO optimization services Melbourne',
    'Business IT setup Melbourne',
    'Cybersecurity consulting Melbourne',
    '3D modeling services Melbourne',
    'CAD design services Melbourne',
    'Emergency electrician near me',
    '24 hour electrician near me',
    'Local electrician Melbourne',
    'Affordable electrician Melbourne',
    'Licensed electrician near me',
    'Professional web developer Melbourne',
    'Custom app development Melbourne',
    'Mobile app development Melbourne',
    'Website design Melbourne',
    'React development Melbourne',
    'Vue.js development Melbourne',
    'Django development Melbourne',
    'Python development Melbourne',
    'Node.js development Melbourne',
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
