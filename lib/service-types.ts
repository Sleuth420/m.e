export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePageData {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  content: {
    heading: string;
    intro: string;
    paragraphs?: string[];
    commonJobs?: string[];
    features: string[];
    benefits: string[];
    faqs?: ServiceFaq[];
    proofLink?: { label: string; url: string };
    cta: string;
  };
  category: 'electrical' | 'web-dev' | 'app-dev' | 'other';
  location?: string;
}
