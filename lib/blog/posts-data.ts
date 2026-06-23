import type { Metadata } from 'next';
import { getAllPostFileContents } from './posts-loader';
import { processPost } from './post-processor';
import { generateSeoMetadata } from '@/components/seo/Seo';
import { BASE_URL } from '@/lib/site';

export interface BlogPost {
  slug: string;
  fileName: string;
  title: string;
  date: string; // ISO format
  author: string;
  excerpt: string;
  content: string; // Sanitized HTML
  tags: string[];
  published: boolean;
}

// Cache for processed posts (only populated at build time)
let postsCache: BlogPost[] | null = null;

/**
 * Get all blog posts, sorted by date (newest first)
 * Results are cached after first call
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  // In development, don't use cache to allow hot reloading
  if (postsCache !== null && process.env.NODE_ENV === 'production') {
    return postsCache;
  }

  const fileContents = await getAllPostFileContents();
  const posts: BlogPost[] = [];

  for (const { fileName, content } of fileContents) {
    const post = processPost(fileName, content);
    if (post) {
      posts.push(post);
    }
  }

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  postsCache = posts;
  return posts;
}

/**
 * Get all post slugs
 * @returns Array of post slugs
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

/**
 * Get a single post by slug
 * @param slug - The post slug
 * @returns BlogPost object or null if not found
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * Get posts by tag
 * @param tag - The tag to filter by
 * @returns Array of BlogPost objects
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

/**
 * Get all unique tags from all posts
 * @returns Array of unique tag strings
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/**
 * Generate SEO metadata for a blog post
 * @param slug - The post slug
 * @returns Metadata object or null if post not found
 */
export async function generatePostMetadata(slug: string): Promise<Metadata | null> {
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return null;
  }

  const canonicalUrl = `${BASE_URL}/blog/${slug}`;
  const publishedTime = new Date(post.date).toISOString();

  return generateSeoMetadata({
    title: `${post.title} | Blog | OakCodeAndTechSolutions`,
    description: post.excerpt,
    type: 'article',
    publishedTime,
    modifiedTime: publishedTime,
    author: post.author,
    canonical: canonicalUrl,
  });
}

/**
 * Generate SEO metadata for the blog listing page
 */
export function generateBlogListMetadata(): Metadata {
  return generateSeoMetadata({
    title: 'Blog | Web Development & Electrical Services | OakCodeAndTechSolutions',
    description:
      'Notes on electrical work, web development, and running a dual trade business in Melbourne.',
    type: 'website',
    canonical: `${BASE_URL}/blog`,
  });
}
