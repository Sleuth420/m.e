import { MetadataRoute } from 'next';
import { getAllServiceSlugs } from '@/lib/services-data';
import { getAllPosts } from '@/lib/blog/posts-data';
import { BASE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString().split('T')[0];

  const mainPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/publications`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const serviceSlugs = getAllServiceSlugs();
  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => {
    let priority = 0.7;
    if (
      slug.includes('electrician-melbourne') ||
      slug.includes('wordpress-developer-melbourne')
    ) {
      priority = 0.9;
    } else if (
      slug.includes('app-development') ||
      slug.includes('web-developer')
    ) {
      priority = 0.8;
    }

    return {
      url: `${BASE_URL}/services/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority,
    };
  });

  const blogPosts = await getAllPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const postDate = new Date(post.date).toISOString().split('T')[0];
    return {
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: postDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [...mainPages, ...servicePages, ...blogPages];
}
