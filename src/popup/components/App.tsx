import { useState, useCallback, useEffect } from 'react';
import { Compass, Settings, Sparkles, Zap, Loader2, BarChart3 } from 'lucide-react';
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
  // Use cached mode for instant display, fallback to null if no cache
  const [searchMode, setSearchMode] = useState<'ai' | 'basic' | null>(() => getCachedMode());
  const [indexingProgress, setIndexingProgress] = useState<IndexingProgress | null>(null);

  // Verify and update mode from chrome.storage (source of truth)
  useEffect(() => {
    async function verifyMode() {
      try {
        const settings = await getSettings();
        const apiKey = await getApiKey();
        const actualMode = settings.mode === 'ai' && apiKey ? 'ai' : 'basic';
        setSearchMode(actualMode);
        updateModeCache(actualMode); // Keep cache in sync
      } catch (err) {
        setSearchMode('basic');
      }
    }
    verifyMode();
  }, []);

  // Listen for indexing progress updates
  useEffect(() => {
    // Check initial state
    chrome.storage.local.get(['tabcompass_indexing_progress'], (result) => {
      const progress = result.tabcompass_indexing_progress as IndexingProgress | null | undefined;
      setIndexingProgress(progress || null);
    });

    // Listen for changes
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
    <div className="w-96 min-h-64 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-blue-500" />
          <h1 className="font-semibold text-gray-900">TabCompass</h1>
          {/* Search Mode Indicator - shows instantly from cache */}
          {searchMode && (
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                searchMode === 'ai'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
              title={searchMode === 'ai' ? 'AI-powered semantic search' : 'Basic keyword search'}
            >
              {searchMode === 'ai' ? (
                <>
                  <Sparkles className="w-3 h-3" />
                  AI
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3" />
                  Basic
                </>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleOpenAnalytics}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Analytics"
          >
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={handleOpenSettings}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Indexing Progress Bar */}
      {indexingProgress && indexingProgress.total > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Indexing tabs: {indexingProgress.current}/{indexingProgress.total}</span>
          </div>
          <div className="mt-1.5 h-1.5 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
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
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
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
      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
            {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Shift+K
          </kbd> to open
        </p>
      </div>
    </div>
  );
}
