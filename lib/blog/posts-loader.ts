import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const POSTS_DIRECTORY = join(process.cwd(), 'content', 'blog');

/**
 * Layer 1: File System Reader
 * Responsibility: Read HTML files from the filesystem
 * 
 * This layer handles all file I/O operations and returns raw file contents.
 * It does not process or parse the content - that's handled by Layer 2.
 */

/**
 * Get all HTML file names from the blog directory
 * @returns Array of file names (without .html extension)
 */
export async function getAllPostFileNames(): Promise<string[]> {
  try {
    const files = await readdir(POSTS_DIRECTORY);
    return files
      .filter((file) => file.endsWith('.html'))
      .map((file) => file.replace(/\.html$/, ''));
  } catch (error) {
    console.error('Error reading blog directory:', error);
    return [];
  }
}

/**
 * Read the raw HTML content of a blog post file
 * @param fileName - The file name without .html extension
 * @returns Raw HTML content as string, or null if file doesn't exist
 */
export async function getPostFileContent(fileName: string): Promise<string | null> {
  try {
    const filePath = join(POSTS_DIRECTORY, `${fileName}.html`);
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading post file ${fileName}:`, error);
    return null;
  }
}

/**
 * Get all post file contents
 * @returns Array of objects with fileName and content
 */
export async function getAllPostFileContents(): Promise<Array<{ fileName: string; content: string }>> {
  const fileNames = await getAllPostFileNames();
  const contents = await Promise.all(
    fileNames.map(async (fileName) => {
      const content = await getPostFileContent(fileName);
      return { fileName, content: content || '' };
    })
  );
  return contents.filter((item) => item.content.length > 0);
}
