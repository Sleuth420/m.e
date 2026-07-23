import type { Metadata } from 'next';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';
import { servicePagesContent } from './services-content';

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

export const servicePages: Record<string, ServicePageData> = servicePagesContent;

export function getAllServiceSlugs(): string[] {
  return Object.keys(servicePages);
}

export function getServicePageData(slug: string): ServicePageData | null {
  return servicePages[slug] ?? null;
}

export function generateServiceMetadata(slug: string): Metadata | null {
  const data = getServicePageData(slug);
  if (!data) return null;

  return generateSeoMetadata({
    title: data.title,
    description: data.description,
    type: 'website',
    canonical: `${BASE_URL}/services/${slug}`,
  });
}
