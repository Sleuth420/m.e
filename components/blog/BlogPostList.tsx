import { BlogPostCard } from './BlogPostCard';
import type { BlogPost } from '@/lib/blog/posts-data';

interface BlogPostListProps {
  posts: BlogPost[];
}

/**
 * Component to display a grid of blog post cards
 */
export function BlogPostList({ posts }: BlogPostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogPostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
