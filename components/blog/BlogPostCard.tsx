import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { DepthCard } from '@/components/ui/depth-card';
import type { BlogPost } from '@/lib/blog/posts-data';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <DepthCard className="h-full flex flex-col p-0 overflow-hidden">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-primary" />
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-primary" />
            <span>{post.author}</span>
          </div>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mt-3 mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="brand-chip">
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors min-h-11"
        >
          Read more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </DepthCard>
  );
}
