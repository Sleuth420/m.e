import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { BlogPostList } from '@/components/blog/BlogPostList';
import { getAllPosts, getPostsByTag, generateBlogListMetadata } from '@/lib/blog/posts-data';

export const metadata: Metadata = generateBlogListMetadata();

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const tag = params.tag;

  let posts;
  if (tag) {
    posts = await getPostsByTag(tag);
  } else {
    posts = await getAllPosts();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent leading-tight pb-2">
                Blog
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {tag
                  ? `Posts tagged with "${tag}"`
                  : 'Articles about web development, electrical services, and technology'}
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <BlogPostList posts={posts} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {posts.length === 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-lg text-muted-foreground mb-8">
                  No posts found. Check back soon for new content!
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
