import React, { useState, useRef, useEffect } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchInput({ onSearch, placeholder }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      onSearch('');
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative outline-none">
      <div className={`
        relative flex items-center
        bg-[#2C2C2E] rounded-xl
        transition-all duration-200
        ${isFocused
          ? 'ring-2 ring-[#007AFF]/60 ring-inset'
          : 'ring-1 ring-white/10 ring-inset hover:ring-white/15'
        }
      `}>
        {/* Search Icon */}
        <div className="pl-3.5 flex-shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isFocused ? '#007AFF' : '#6E6E73'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-200"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || 'Search your tabs...'}
          className="
            flex-1 py-3 px-2
            bg-transparent
            text-[14px] text-[#F5F5F7]
            placeholder:text-[#6E6E73]
            focus:outline-none
          "
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="
              mr-2 p-1.5 rounded-md
              text-[#6E6E73] hover:text-[#F5F5F7]
              hover:bg-white/10
              transition-all duration-150
            "
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Hint text */}
      <p className="text-[10px] text-[#6E6E73] mt-1.5 ml-1">
        Press Enter to search
      </p>
    </form>
  );
}
