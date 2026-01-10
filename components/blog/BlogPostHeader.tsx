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
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-500" />
          <time dateTime={post.date}>{formattedDate}</time>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-orange-500" />
          <span>{post.author}</span>
        </div>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-orange-500" />
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="inline-block px-3 py-1 text-sm bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-500/20 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {showExcerpt && post.excerpt && (
        <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
      )}
    </header>
  );
}
