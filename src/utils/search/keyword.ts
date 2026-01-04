import Fuse from 'fuse.js';
import type { SearchResult } from '../../types';
import { getAllTabs } from '../storage/db';

export async function keywordSearch(
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  const allTabs = await getAllTabs();

  const fuse = new Fuse(allTabs, {
    keys: ['title', 'content', 'url', 'domain'],
    threshold: 0.4,
    includeScore: true,
  });

  const results = fuse.search(query, { limit });

  return results.map(result => ({
    ...result.item,
    similarity: 1 - (result.score || 0), // Invert score (lower is better in Fuse)
    relevanceScore: 1 - (result.score || 0),
  }));
}
