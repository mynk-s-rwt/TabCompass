import type { IndexedTab, SearchResult } from '../../types';

class MemoryCache<T> {
  private cache: Map<string, { data: T; timestamp: number }>;
  private maxAge: number;

  constructor(maxAge: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  set(key: string, value: T): void {
    this.cache.set(key, { data: value, timestamp: Date.now() });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const tabCache = new MemoryCache<IndexedTab[]>();
export const searchCache = new MemoryCache<SearchResult[]>();
export const embeddingCache = new MemoryCache<number[]>();
