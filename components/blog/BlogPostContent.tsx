'use client';

import { useEffect, useRef } from 'react';

interface BlogPostContentProps {
  content: string;
  className?: string;
}

/**
 * Component to render sanitized HTML blog post content
 * Handles code block styling and ensures proper formatting
 */
export function BlogPostContent({ content, className = '' }: BlogPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add syntax highlighting classes to code blocks if needed
    // This can be extended later with a syntax highlighter library
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        if (!block.className) {
          block.className = 'language-text';
        }
      });
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
