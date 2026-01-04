import type { SearchResult } from '../../types';
import { getAllTabs } from '../storage/db';
import { generateEmbedding } from '../api/gemini';
import { cosineSimilarity } from './vector';
import { searchCache } from '../storage/cache';

export async function semanticSearch(
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  console.log('[Search] semanticSearch called for:', query);

  // Check cache
  const cacheKey = `search_${query}_${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached) {
    console.log('[Search] Returning cached results:', cached.length);
    return cached;
  }

  // Generate query embedding
  const embeddingResult = await generateEmbedding(query);
  if (!embeddingResult.success || !embeddingResult.data) {
    console.error('[Search] Embedding generation failed:', embeddingResult.error);
    throw new Error(embeddingResult.error || 'Failed to generate query embedding');
  }

  const queryEmbedding = embeddingResult.data;
  console.log('[Search] Query embedding generated, dimensions:', queryEmbedding.length);

  // Get all indexed tabs
  const allTabs = await getAllTabs();
  console.log('[Search] Total tabs in IndexedDB:', allTabs.length);

  // Filter tabs with embeddings
  const tabsWithEmbeddings = allTabs.filter(tab => tab.embedding && tab.embedding.length > 0);
  console.log('[Search] Tabs with embeddings:', tabsWithEmbeddings.length);

  // Calculate similarity for each tab
  const results: SearchResult[] = tabsWithEmbeddings.map(tab => {
    const similarity = cosineSimilarity(queryEmbedding, tab.embedding);

    // Calculate relevance (similarity + recency boost)
    const daysSinceVisit = (Date.now() - tab.lastVisited) / (1000 * 60 * 60 * 24);
    const recencyBoost = Math.max(0, 1 - daysSinceVisit / 30); // Decay over 30 days
    const relevanceScore = similarity * 0.8 + recencyBoost * 0.2;

    return {
      ...tab,
      similarity,
      relevanceScore,
    };
  });

  // Sort by relevance and take top N
  const topResults = results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  console.log('[Search] Returning top results:', topResults.length);

  // Cache results
  searchCache.set(cacheKey, topResults);

  return topResults;
}
