import React from 'react';
import { ExternalLink, Clock, Globe } from 'lucide-react';
import type { SearchResult } from '../../types';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

export function SearchResults({ results, isLoading, query }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (query && results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No results found for "{query}"</p>
        <p className="text-sm mt-1">Try a different search term</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Start typing to search your tabs</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {results.map((result) => (
        <ResultItem key={result.id} result={result} />
      ))}
    </div>
  );
}

interface ResultItemProps {
  result: SearchResult;
}

function ResultItem({ result }: ResultItemProps) {
  const handleClick = async () => {
    try {
      // Focus the tab
      await chrome.tabs.update(result.tabId, { active: true });
      // Focus the window containing the tab
      const tab = await chrome.tabs.get(result.tabId);
      if (tab.windowId) {
        await chrome.windows.update(tab.windowId, { focused: true });
      }
      // Close the popup
      window.close();
    } catch (error) {
      // Tab might not exist anymore, open the URL in a new tab
      await chrome.tabs.create({ url: result.url });
      window.close();
    }
  };

  const relevancePercent = Math.round((result.relevanceScore || 0) * 100);
  const lastVisited = new Date(result.lastVisited).toLocaleDateString();

  return (
    <button
      onClick={handleClick}
      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
    >
      <div className="flex items-start gap-3">
        {result.favicon ? (
          <img
            src={result.favicon}
            alt=""
            className="w-5 h-5 mt-0.5 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Globe className="w-5 h-5 mt-0.5 text-gray-400" />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600">
            {result.title}
          </h3>

          <p className="text-sm text-gray-500 truncate mt-0.5">
            {result.domain}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastVisited}
            </span>

            <span className="flex items-center gap-1">
              <div
                className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden"
                title={`${relevancePercent}% relevant`}
              >
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${relevancePercent}%` }}
                />
              </div>
              {relevancePercent}%
            </span>
          </div>
        </div>

        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}
