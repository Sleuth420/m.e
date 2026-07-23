import type { Metadata } from 'next';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';
import { blogPosts, type BlogPost } from './posts';

export type { BlogPost };

export function getAllPosts(): BlogPost[] {
  return [...blogPosts]
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function generatePostMetadata(slug: string): Metadata | null {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const publishedTime = new Date(post.date).toISOString();

  return generateSeoMetadata({
    title: `${post.title} | Blog | OakCodeAndTechSolutions`,
    description: post.excerpt,
    type: 'article',
    publishedTime,
    modifiedTime: publishedTime,
    author: post.author,
    canonical: `${BASE_URL}/blog/${slug}`,
  });
}

export function generateBlogListMetadata(): Metadata {
  return generateSeoMetadata({
    title: 'Blog | Web Development & Electrical Services | OakCodeAndTechSolutions',
    description:
      'Notes on electrical work, web development, and running a dual trade business in Melbourne.',
    type: 'website',
    canonical: `${BASE_URL}/blog`,
  });
}
