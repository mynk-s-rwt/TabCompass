import { useState, useCallback, useEffect } from 'react';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { search } from '../../utils/search';
import { getSettings, getApiKey, getCachedMode, updateModeCache } from '../../utils/storage/settings';
import type { SearchResult } from '../../types';

interface IndexingProgress {
  current: number;
  total: number;
  startedAt: number;
}

export function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'ai' | 'basic' | null>(() => getCachedMode());
  const [indexingProgress, setIndexingProgress] = useState<IndexingProgress | null>(null);

  useEffect(() => {
    async function verifyMode() {
      try {
        const settings = await getSettings();
        const apiKey = await getApiKey();
        const actualMode = settings.mode === 'ai' && apiKey ? 'ai' : 'basic';
        setSearchMode(actualMode);
        updateModeCache(actualMode);
      } catch {
        setSearchMode('basic');
      }
    }
    verifyMode();
  }, []);

  useEffect(() => {
    chrome.storage.local.get(['tabcompass_indexing_progress'], (result) => {
      const progress = result.tabcompass_indexing_progress as IndexingProgress | null | undefined;
      setIndexingProgress(progress || null);
    });

    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes.tabcompass_indexing_progress) {
        const progress = changes.tabcompass_indexing_progress.newValue as IndexingProgress | null | undefined;
        setIndexingProgress(progress || null);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    setError(null);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const searchResults = await search(searchQuery);
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOpenSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  const handleOpenAnalytics = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/analytics/index.html') });
  };

  return (
    <div className="w-[380px] min-h-[320px] bg-[#1C1C1E] text-[#F5F5F7]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#AF52DE] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
            </svg>
          </div>
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight">TabCompass</h1>
            {/* Mode Badge */}
            {searchMode && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  searchMode === 'ai'
                    ? 'bg-[#AF52DE]/20 text-[#AF52DE]'
                    : 'bg-white/10 text-[#98989D]'
                }`}>
                  {searchMode === 'ai' ? (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                        <path d="M18 15l.75 2.25L21 18l-2.25.75L18 21l-.75-2.25L15 18l2.25-.75L18 15z"/>
                      </svg>
                      AI Search
                    </>
                  ) : (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                      Basic
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleOpenAnalytics}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#98989D] hover:text-[#F5F5F7] hover:bg-white/10 transition-all duration-150"
            title="Analytics"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </button>
          <button
            onClick={handleOpenSettings}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#98989D] hover:text-[#F5F5F7] hover:bg-white/10 transition-all duration-150"
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Indexing Progress */}
      {indexingProgress && indexingProgress.total > 0 && (
        <div className="px-4 py-2.5 bg-[#007AFF]/10 border-b border-[#007AFF]/20">
          <div className="flex items-center gap-2 text-[12px] text-[#007AFF]">
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            <span className="font-medium">Indexing tabs: {indexingProgress.current}/{indexingProgress.total}</span>
          </div>
          <div className="mt-2 h-1 bg-[#007AFF]/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#007AFF] rounded-full transition-all duration-300"
              style={{ width: `${(indexingProgress.current / indexingProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="p-4">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search your tabs..."
        />

        {error && (
          <div className="mt-3 p-3 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl text-[#FF3B30] text-[12px]">
            {error}
          </div>
        )}

        <div className="mt-4">
          <SearchResults
            results={results}
            isLoading={isLoading}
            query={query}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-white/5">
        <p className="text-[11px] text-[#6E6E73] text-center">
          Press{' '}
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-[#98989D] font-mono">
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+K
          </kbd>
          {' '}to open
        </p>
      </div>
    </div>
  );
}
