import type { SearchResult } from '../../types';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

export function SearchResults({ results, isLoading, query }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-2 border-[#007AFF]/20"></div>
          <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-transparent border-t-[#007AFF] animate-spin"></div>
        </div>
        <p className="mt-3 text-[12px] text-[#6E6E73]">Searching...</p>
      </div>
    );
  }

  if (query && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-12 h-12 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <p className="text-[13px] text-[#98989D]">No results found</p>
        <p className="text-[12px] text-[#6E6E73] mt-1">Try different keywords</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#007AFF]/20 to-[#AF52DE]/20 flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <p className="text-[13px] text-[#98989D]">Search your open tabs</p>
        <p className="text-[12px] text-[#6E6E73] mt-1">Find tabs by context, title, or topic</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
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
      if (result.tabId) {
        await chrome.tabs.update(result.tabId, { active: true });
        const tab = await chrome.tabs.get(result.tabId);
        if (tab.windowId) {
          await chrome.windows.update(tab.windowId, { focused: true });
        }
        window.close();
      } else {
        await chrome.tabs.create({ url: result.url });
        window.close();
      }
    } catch {
      await chrome.tabs.create({ url: result.url });
      window.close();
    }
  };

  const relevancePercent = Math.round((result.relevanceScore || 0) * 100);

  return (
    <button
      onClick={handleClick}
      className="
        w-full text-left p-3 rounded-xl
        bg-[#2C2C2E]/50 hover:bg-[#2C2C2E]
        border border-transparent hover:border-white/10
        transition-all duration-150
        group
      "
    >
      <div className="flex items-start gap-3">
        {/* Favicon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#3A3A3C] flex items-center justify-center overflow-hidden">
          {result.favicon ? (
            <img
              src={result.favicon}
              alt=""
              className="w-5 h-5 rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                `;
              }}
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-medium text-[#F5F5F7] truncate group-hover:text-[#007AFF] transition-colors">
            {result.title}
          </h3>

          <p className="text-[11px] text-[#6E6E73] truncate mt-0.5">
            {result.domain}
          </p>

          {/* Relevance indicator */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${relevancePercent >= 80 ? 'bg-[#34C759]' :
                    relevancePercent >= 60 ? 'bg-[#007AFF]' :
                      'bg-[#FF9500]'
                  }`}
                style={{ width: `${relevancePercent}%` }}
              />
            </div>
            <span className={`text-[10px] font-medium ${relevancePercent >= 80 ? 'text-[#34C759]' :
                relevancePercent >= 60 ? 'text-[#007AFF]' :
                  'text-[#FF9500]'
              }`}>
              {relevancePercent}%
            </span>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </button>
  );
}
