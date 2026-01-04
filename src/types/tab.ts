export interface IndexedTab {
  id: string;                    // Unique ID (hash of URL + timestamp)
  url: string;                   // Full URL
  title: string;                 // Page title
  content: string;               // Extracted text content (truncated)
  embedding: number[];           // Gemini embedding vector [768]
  timestamp: number;             // When indexed (Date.now())
  favicon?: string;              // Favicon URL
  domain: string;                // Extracted domain (e.g., "github.com")
  category?: string;             // Auto-categorized (Dev, Learning, etc.)
  visitCount: number;            // How many times visited
  lastVisited: number;           // Last visit timestamp
  isOpen: boolean;               // Currently open or closed
  tabId?: number;                // Chrome tab ID (if open)
}

export interface SearchResult extends IndexedTab {
  similarity: number;            // Cosine similarity score (0-1)
  matchedContent?: string;       // Snippet of matched content
  relevanceScore: number;        // Combined relevance (similarity + recency)
}

export interface TabGroup {
  id: string;
  name: string;
  tabs: IndexedTab[];
  category: string;
  createdAt: number;
}
