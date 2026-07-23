interface BlogPostContentProps {
  content: string;
  className?: string;
}

/** Renders author-controlled HTML blog content. */
export function BlogPostContent({ content, className = '' }: BlogPostContentProps) {
  return (
    <div
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
