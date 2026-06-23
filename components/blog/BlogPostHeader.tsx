import { Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog/posts-data';

interface BlogPostHeaderProps {
  post: BlogPost;
  showExcerpt?: boolean;
}

/**
 * Component to display blog post header with title, date, author, and tags
 */
export function BlogPostHeader({ post, showExcerpt = false }: BlogPostHeaderProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="mb-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 gradient-text glow-text text-balance">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-muted-foreground mb-4 text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <time dateTime={post.date}>{formattedDate}</time>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary shrink-0" />
          <span>{post.author}</span>
        </div>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-primary shrink-0" />
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="brand-chip text-sm">
              {tag}
            </Link>
          ))}
        </div>
      )}

      {showExcerpt && post.excerpt && (
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
      )}
    </header>
  );
}
