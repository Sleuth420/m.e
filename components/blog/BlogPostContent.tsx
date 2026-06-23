'use client';

import { useEffect, useMemo, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface BlogPostContentProps {
  content: string;
  className?: string;
}

/**
 * Component to render sanitized HTML blog post content
 * Uses DOMPurify for client-side sanitization as a security layer
 * Handles code block styling and ensures proper formatting
 */
export function BlogPostContent({ content, className = '' }: BlogPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const sanitizedContent = useMemo(
    () =>
      DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'div', 'span',
          'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr',
        ],
        ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'class', 'id', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
        ADD_ATTR: ['target'],
        ADD_TAGS: [],
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
      }),
    [content]
  );

  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        if (!block.className) {
          block.className = 'language-text';
        }
      });
    }
  }, [sanitizedContent]);

  return (
    <div
      ref={contentRef}
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
