import type { Metadata } from 'next';
import { BlogPostList } from '@/components/blog/BlogPostList';
import { PageHero } from '@/components/ui/page-hero';
import { getAllPosts, getPostsByTag, generateBlogListMetadata } from '@/lib/blog/posts-data';

export const metadata: Metadata = generateBlogListMetadata();

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const tag = params.tag;

  const posts = tag ? getPostsByTag(tag) : getAllPosts();

  return (
    <>
      <PageHero
        badge="Insights"
        title="Blog"
        description={
          tag
            ? `Posts tagged with "${tag}"`
            : 'Project stories, electrical service guides and notes on building websites and software.'
        }
      />
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl">
          <BlogPostList posts={posts} />
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No articles match this selection. Visit the blog without a tag filter to see all
              articles.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
