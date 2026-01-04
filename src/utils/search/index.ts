import type { SearchResult } from '../../types';
import { getSettings } from '../storage/settings';
import { semanticSearch } from './semantic';
import { keywordSearch } from './keyword';

export async function search(query: string, limit: number = 10): Promise<SearchResult[]> {
  const settings = await getSettings();

  if (settings.mode === 'ai' && settings.apiKey) {
    return await semanticSearch(query, limit);
  } else {
    return await keywordSearch(query, limit);
  }
}

export * from './semantic';
export * from './keyword';
export * from './vector';
