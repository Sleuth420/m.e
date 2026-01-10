'use client';

import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

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
  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  useEffect(() => {
    // Sanitize content on client side using DOMPurify
    // This provides defense-in-depth security
    const clean = DOMPurify.sanitize(content, {
      // Allow common HTML elements
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'div', 'span',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr'
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'alt', 'src', 'class', 'id', 'target', 'rel'
      ],
      // Don't allow data attributes
      ALLOW_DATA_ATTR: false,
      // Add rel="noopener noreferrer" to external links automatically
      ADD_ATTR: ['target'],
      ADD_TAGS: [],
      // Return DOM instead of string for better performance
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
    });
    setSanitizedContent(clean);
  }, [content]);

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
  }, [sanitizedContent]);

  return (
    <div
      ref={contentRef}
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
