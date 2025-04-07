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
  title = 'Ricky - OakCodeAndTechSolutions',
  description = 'Full-stack developer specializing in modern web technologies',
  image = 'https://profile.oakcodeandtechsolutions.com/placeholder-user.jpg',
  type = 'profile',
  publishedTime,
  modifiedTime,
  author = 'Ricky',
  keywords = ['Full-stack developer',
    'Electrician',
    'Web Development',
    'OakCodeAndTechSolutions',
    'Ricky Oakley',
    'Wordpress Developer',
    'Wordpress',
    'Web Developer',
    'Web Design',
    'Full-stack Developer',
    'Full Stack',
    'Vue.js Developer',
    'Vue.js',
    'Vue',
    'React Developer',
    'React',
    'Node.js Developer',
    'Node.js',
    'Python Developer',
    'Python',
    'Django Developer',
    'Django',
    'Django Rest Framework',    
  ],
}: SeoProps = {}): Metadata => {
  const baseUrl = 'https://profile.oakcodeandtechsolutions.com';
  
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
  };
}; 