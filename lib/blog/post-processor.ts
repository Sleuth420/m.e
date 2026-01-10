import DOMPurify from 'isomorphic-dompurify';
import type { BlogPost } from './posts-data';

/**
 * Layer 2: Content Processor
 * Responsibility: Parse HTML, extract metadata, sanitize content, transform data
 * 
 * This layer handles all the "dirty work":
 * - Extracts metadata from HTML comments
 * - Sanitizes HTML to prevent XSS attacks
 * - Generates slugs, excerpts, and formatted dates
 * - Transforms raw content into structured BlogPost objects
 */

interface RawMetadata {
  title?: string;
  date?: string;
  author?: string;
  tags?: string;
  excerpt?: string;
  published?: string;
}

/**
 * Parse metadata from HTML comment block at the top of the file
 * Expected format:
 * <!-- 
 * title: My Post Title
 * date: 2024-01-15
 * author: Author Name
 * tags: tag1, tag2, tag3
 * excerpt: Brief description
 * published: true
 * -->
 */
function parseMetadata(htmlContent: string): RawMetadata {
  const metadata: RawMetadata = {};
  
  // Extract the comment block (everything between <!-- and --> at the start)
  // Use multiline flag and match the first comment block
  const commentMatch = htmlContent.match(/<!--\s*([\s\S]*?)\s*-->/);
  if (!commentMatch) {
    return metadata;
  }

  const commentContent = commentMatch[1];
  
  // Parse each line in the comment
  const lines = commentContent.split('\n');
  for (const line of lines) {
    // Match key: value pattern, allowing for whitespace
    const match = line.match(/^\s*(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      const trimmedValue = value.trim();
      
      switch (key.toLowerCase()) {
        case 'title':
          metadata.title = trimmedValue;
          break;
        case 'date':
          metadata.date = trimmedValue;
          break;
        case 'author':
          metadata.author = trimmedValue;
          break;
        case 'tags':
          metadata.tags = trimmedValue;
          break;
        case 'excerpt':
          metadata.excerpt = trimmedValue;
          break;
        case 'published':
          metadata.published = trimmedValue.toLowerCase();
          break;
      }
    }
  }

  return metadata;
}

/**
 * Extract HTML content (everything after the metadata comment)
 */
function extractContent(htmlContent: string): string {
  // Remove the comment block at the start
  const content = htmlContent.replace(/^<!--[\s\S]*?-->\s*/, '');
  return content.trim();
}

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate an excerpt from content if not provided in metadata
 */
function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags for excerpt
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  // Find the last complete word before maxLength
  const truncated = textContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Parse tags string into array
 */
function parseTags(tagsString?: string): string[] {
  if (!tagsString) return [];
  return tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/**
 * Format date string to ISO format
 */
function formatDate(dateString?: string): string {
  if (!dateString) return new Date().toISOString();
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify to remove dangerous elements and attributes
 */
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    // Allow common HTML elements
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'div', 'span',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'class', 'id', 'target', 'rel'
    ],
    // Allow data attributes for code blocks
    ALLOW_DATA_ATTR: false,
    // Add rel="noopener noreferrer" to external links
    ADD_ATTR: ['target'],
    ADD_TAGS: [],
  });
}

/**
 * Process raw HTML content into a structured BlogPost object
 * @param fileName - The file name (without .html extension)
 * @param htmlContent - Raw HTML content from the file
 * @returns Processed BlogPost object or null if invalid
 */
export function processPost(fileName: string, htmlContent: string): BlogPost | null {
  // Parse metadata
  const rawMetadata = parseMetadata(htmlContent);
  
  // Skip unpublished posts
  if (rawMetadata.published !== 'true' && rawMetadata.published !== '1') {
    return null;
  }

  // Extract and sanitize content
  const rawContent = extractContent(htmlContent);
  const sanitizedContent = sanitizeHtml(rawContent);

  // Generate required fields
  const title = rawMetadata.title || fileName;
  // Use fileName as slug (it's already URL-friendly from the file name)
  const slug = fileName;
  const date = formatDate(rawMetadata.date);
  const author = rawMetadata.author || 'Ricky';
  const excerpt = rawMetadata.excerpt || generateExcerpt(rawContent);
  const tags = parseTags(rawMetadata.tags);

  // Validate required fields
  if (!title || !sanitizedContent) {
    console.warn(`Invalid post: ${fileName} - missing title or content`);
    return null;
  }

  return {
    slug,
    fileName,
    title,
    date,
    author,
    excerpt,
    content: sanitizedContent,
    tags,
    published: true,
  };
}
