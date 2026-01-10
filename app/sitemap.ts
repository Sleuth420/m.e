import { MetadataRoute } from 'next';
import { getAllServiceSlugs } from '@/lib/services-data';
import { getAllPosts } from '@/lib/blog/posts-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.oakcodeandtechsolutions.com';
  const currentDate = new Date().toISOString().split('T')[0];

  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Service pages - dynamically generated from services-data.ts
  const serviceSlugs = getAllServiceSlugs();
  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => {
    // Determine priority based on service type
    let priority = 0.7;
    if (
      slug.includes('electrician-melbourne') ||
      slug.includes('wordpress-developer-melbourne') ||
      slug.includes('emergency-electrician-melbourne')
    ) {
      priority = 0.9;
    } else if (
      slug.includes('app-developer') ||
      slug.includes('web-developer') ||
      slug.includes('24-hour-electrician')
    ) {
      priority = 0.8;
    }

    return {
      url: `${baseUrl}/services/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority,
    };
  });

  // Blog posts - dynamically generated from blog posts
  const blogPosts = await getAllPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const postDate = new Date(post.date).toISOString().split('T')[0];
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: postDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [...mainPages, ...servicePages, ...blogPages];
}

