import type { SearchResult } from '../../types';
import { getAllTabs } from '../storage/db';
import { generateEmbedding } from '../api/gemini';
import { cosineSimilarity } from './vector';
import { searchCache } from '../storage/cache';

/**
 * Calculate keyword match score between query and tab content
 * Returns a score between 0 and 1 based on how many query words appear in the tab
 */
function calculateKeywordScore(
  query: string,
  tab: { title: string; url: string; content: string; domain: string }
): { score: number; titleMatch: boolean; urlMatch: boolean; hasAnyMatch: boolean } {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  const titleLower = (tab.title || '').toLowerCase();
  const urlLower = (tab.url || '').toLowerCase();
  const contentLower = (tab.content || '').toLowerCase();
  const domainLower = (tab.domain || '').toLowerCase();

  // Check for exact phrase match in title (highest value)
  const exactTitleMatch = titleLower.includes(queryLower);

  // Check for exact phrase match in URL
  const exactUrlMatch = urlLower.includes(queryLower);

  // Check individual word matches
  let titleWordMatches = 0;
  let urlWordMatches = 0;
  let contentWordMatches = 0;
  let domainWordMatches = 0;

  for (const word of queryWords) {
    if (titleLower.includes(word)) titleWordMatches++;
    if (urlLower.includes(word)) urlWordMatches++;
    if (contentLower.includes(word)) contentWordMatches++;
    if (domainLower.includes(word)) domainWordMatches++;
  }

  const totalWords = queryWords.length || 1;

  // Calculate weighted score
  // Title matches are most important, then URL, then domain, then content
  let score = 0;

  if (exactTitleMatch) {
    score += 0.5; // Big bonus for exact phrase in title
  } else {
    score += (titleWordMatches / totalWords) * 0.3;
  }

  if (exactUrlMatch) {
    score += 0.2;
  } else {
    score += (urlWordMatches / totalWords) * 0.15;
  }

  score += (domainWordMatches / totalWords) * 0.1;
  score += (contentWordMatches / totalWords) * 0.1;

  // Check if there's any match at all
  const hasAnyMatch = titleWordMatches > 0 || urlWordMatches > 0 ||
                       contentWordMatches > 0 || domainWordMatches > 0;

  return {
    score: Math.min(score, 1), // Cap at 1
    titleMatch: titleWordMatches > 0 || exactTitleMatch,
    urlMatch: urlWordMatches > 0 || exactUrlMatch,
    hasAnyMatch,
  };
}

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

  // Thresholds for hybrid search
  const MIN_SEMANTIC_THRESHOLD = 0.30; // Lower threshold since we combine with keyword
  const MIN_HYBRID_THRESHOLD = 0.35;   // Minimum combined score to show

  // Calculate hybrid scores for each tab
  const results: SearchResult[] = tabsWithEmbeddings.map(tab => {
    const semanticScore = cosineSimilarity(queryEmbedding, tab.embedding);
    const keywordResult = calculateKeywordScore(query, tab);

    // Hybrid scoring formula:
    // - 60% semantic similarity (understanding meaning)
    // - 25% keyword matching (precision)
    // - 15% recency boost
    const daysSinceVisit = (Date.now() - tab.lastVisited) / (1000 * 60 * 60 * 24);
    const recencyBoost = Math.max(0, 1 - daysSinceVisit / 30);

    // Calculate hybrid score
    const hybridScore = (semanticScore * 0.60) + (keywordResult.score * 0.25) + (recencyBoost * 0.15);

    // Bonus for title/URL matches (these are strong signals)
    const titleBonus = keywordResult.titleMatch ? 0.10 : 0;
    const urlBonus = keywordResult.urlMatch ? 0.05 : 0;

    const relevanceScore = hybridScore + titleBonus + urlBonus;

    return {
      ...tab,
      similarity: semanticScore,
      relevanceScore,
      _keywordScore: keywordResult.score,
      _hasKeywordMatch: keywordResult.hasAnyMatch,
    } as SearchResult & { _keywordScore: number; _hasKeywordMatch: boolean };
  });

  // Debug: Show top scores before filtering
  const sortedByRelevance = [...results].sort((a, b) => b.relevanceScore - a.relevanceScore);
  console.log('[Search] Top 5 hybrid scores:', sortedByRelevance.slice(0, 5).map(r => ({
    title: r.title?.substring(0, 30),
    semantic: r.similarity.toFixed(3),
    keyword: (r as any)._keywordScore?.toFixed(3),
    hybrid: r.relevanceScore.toFixed(3),
    hasKeyword: (r as any)._hasKeywordMatch,
  })));

  // Filter results:
  // 1. Must have either good semantic score OR keyword match
  // 2. Combined hybrid score must be above threshold
  const topResults = results
    .filter(r => {
      const hasGoodSemantic = r.similarity >= MIN_SEMANTIC_THRESHOLD;
      const hasKeywordMatch = (r as any)._hasKeywordMatch;
      const meetsHybridThreshold = r.relevanceScore >= MIN_HYBRID_THRESHOLD;

      // Must meet hybrid threshold AND have either semantic or keyword relevance
      // This filters out results with high semantic but zero keyword overlap
      return meetsHybridThreshold && (hasGoodSemantic || hasKeywordMatch) &&
             (hasKeywordMatch || r.similarity >= 0.40); // Require keyword match OR high semantic
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  console.log('[Search] Results after hybrid filtering:', topResults.length);

  // Clean up internal properties before returning
  const cleanResults = topResults.map(r => {
    const { _keywordScore, _hasKeywordMatch, ...clean } = r as any;
    return clean as SearchResult;
  });

  // Cache results
  searchCache.set(cacheKey, cleanResults);

  return cleanResults;
}
