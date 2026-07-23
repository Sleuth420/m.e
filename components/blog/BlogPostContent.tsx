'use client';

import { useEffect, useState, useRef } from 'react';
import DOMPurify from 'dompurify';

interface BlogPostContentProps {
  content: string;
  className?: string;
}

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    's',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'pre',
    'code',
    'a',
    'img',
    'div',
    'span',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'hr',
  ],
  ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'class', 'id', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'],
  ADD_TAGS: [] as string[],
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
};

/**
 * Renders sanitized HTML blog content on the client only (avoids jsdom/undici at build time).
 */
export function BlogPostContent({ content, className = '' }: BlogPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    setSanitizedContent(DOMPurify.sanitize(content, PURIFY_CONFIG));
  }, [content]);

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

  if (!sanitizedContent) {
    return <div className={`blog-content ${className}`} aria-hidden />;
  }

  return (
    <div
      ref={contentRef}
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
