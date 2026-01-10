import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/lib/blog/posts-data';

interface BlogPostCardProps {
  post: BlogPost;
}

/**
 * Component to display a blog post preview card
 * Used in blog listing pages
 */
export function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="h-full flex flex-col border-orange-500/20 hover:border-orange-500/40 transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-orange-500" />
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-orange-500" />
            <span>{post.author}</span>
          </div>
        </div>
        <CardTitle className="text-2xl hover:text-orange-600 transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="text-base mb-4 line-clamp-3">
          {post.excerpt}
        </CardDescription>
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
        >
          Read more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
