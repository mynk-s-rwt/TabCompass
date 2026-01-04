import type { SearchResult } from '../../types';
import { getSettings, getApiKey } from '../storage/settings';
import { semanticSearch } from './semantic';
import { keywordSearch } from './keyword';

export async function search(query: string, limit: number = 10): Promise<SearchResult[]> {
  const settings = await getSettings();
  const apiKey = await getApiKey();

  // Only use semantic search if AI mode is enabled AND we have a valid API key
  if (settings.mode === 'ai' && apiKey) {
    return await semanticSearch(query, limit);
  } else {
    // Fallback to keyword search (Fuse.js)
    return await keywordSearch(query, limit);
  }
}

export * from './semantic';
export * from './keyword';
export * from './vector';
