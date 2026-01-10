import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { BlogPostList } from '@/components/blog/BlogPostList';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  getAllPostSlugs,
  getPostBySlug,
  getAllPosts,
  generatePostMetadata,
} from '@/lib/blog/posts-data';

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const metadata = await generatePostMetadata(slug);

  if (!metadata) {
    return {
      title: 'Post Not Found',
    };
  }

  return metadata;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (excluding current post)
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const baseUrl = 'https://www.oakcodeandtechsolutions.com';
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Blog', url: `${baseUrl}/blog` },
    { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Blog Post Content */}
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <div className="mb-8">
                <Button asChild variant="ghost" className="gap-2">
                  <Link href="/blog">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                  </Link>
                </Button>
              </div>

              {/* Post Header */}
              <BlogPostHeader post={post} showExcerpt />

              {/* Post Content */}
              <div className="mb-12">
                <BlogPostContent content={post.content} />
              </div>

              {/* Post Footer */}
              <div className="border-t pt-8 mt-12">
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div>
                    <strong className="text-foreground">Published:</strong>{' '}
                    {new Date(post.date).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div>
                    <strong className="text-foreground">Author:</strong> {post.author}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Related Posts
                </h2>
                <BlogPostList posts={relatedPosts} />
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Interested in Working Together?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Let's discuss your next project or electrical needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/#contact">Get in Touch</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8">
                  <Link href="/blog">View More Posts</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
