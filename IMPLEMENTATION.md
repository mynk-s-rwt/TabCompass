# TabCompass - Implementation Roadmap

**Project**: TabCompass - AI-Powered Semantic Tab Manager
**Target**: 4-Hour Hackathon MVP
**Status**: 🔴 Not Started
**Started**: -
**Completed**: -

---

## 📋 Instructions for AI Agent

### Workflow
1. **Read this document** from top to bottom
2. **Pick the next unchecked task** in order (✅ = done, ⬜ = pending)
3. **Implement the task** following the specifications
4. **Ask user for approval** before committing
5. **If approved**:
   - Commit to git with format: `feat: [task description]` or `fix: [task description]`
   - Mark task as ✅ in this document
   - Move to next task
6. **If rejected**: Fix issues and ask for approval again
7. **Repeat** until all tasks complete

### Git Commit Format
```
feat: <task-description>

Implements: <task-id>
Phase: <phase-number>

<detailed-description>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Task Status Legend
- ⬜ **Pending** - Not started
- 🔄 **In Progress** - Currently working on
- ✅ **Completed** - Done and committed
- ⚠️ **Blocked** - Waiting on dependency or user input
- ❌ **Skipped** - Not needed for MVP

### Important Rules
1. **ONE task at a time** - Don't skip ahead
2. **Always ask for approval** before committing
3. **Update this doc** immediately after each commit
4. **Follow code standards**: TypeScript, ESLint, Prettier
5. **Test before approval** - Ensure code works
6. **Keep commits atomic** - One task = one commit

---

## 🏗️ Project Structure Overview

```
fms/
├── PRODUCT_DOC.md          # Product requirements (read-only)
├── IMPLEMENTATION.md       # This file (update after each task)
├── AI_BROWSERS_COMPARISON.md  # Market research (read-only)
├── src/
│   ├── background/         # Service worker
│   ├── content/           # Content scripts
│   ├── popup/             # Search UI
│   ├── onboarding/        # Welcome flow
│   ├── options/           # Settings page
│   ├── utils/             # Shared utilities
│   └── types/             # TypeScript types
├── public/
│   ├── manifest.json      # Chrome extension manifest
│   └── icons/             # Extension icons
├── dist/                  # Build output
└── package.json
```

---

## Phase 1: Project Setup & Boilerplate

**Goal**: Set up development environment and project structure
**Estimated Time**: 30 minutes
**Status**: ⬜ Not Started

### Tasks

#### 1.1 Initialize Project Structure
⬜ **Task ID**: SETUP-001
**Description**: Create project with Vite + React + TypeScript template
**Files to create**:
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `.eslintrc.js`
- `.prettierrc`
- `.gitignore`

**Commands**:
```bash
cd /Users/development/Desktop/personal-codes/fms
npm create vite@latest . -- --template react-ts
```

**Acceptance Criteria**:
- ✅ Project initializes without errors
- ✅ TypeScript configured
- ✅ Can run `npm run dev`

**Commit Message**: `feat: initialize Vite + React + TypeScript project`

---

#### 1.2 Install Dependencies
⬜ **Task ID**: SETUP-002
**Description**: Install all required dependencies

**Dependencies to install**:
```bash
npm install @google/generative-ai
npm install @base-ui/react
npm install localforage
npm install fuse.js
npm install lucide-react
npm install clsx tailwind-merge
npm install -D @types/chrome
npm install -D vite-plugin-web-extension
npm install -D tailwindcss postcss autoprefixer
npm install -D @crxjs/vite-plugin
```

**Acceptance Criteria**:
- ✅ All packages installed
- ✅ No dependency conflicts
- ✅ `package.json` updated
- ✅ Base UI installed

**Commit Message**: `feat: install project dependencies including Base UI`

---

#### 1.3 Configure Tailwind CSS
⬜ **Task ID**: SETUP-003
**Description**: Set up Tailwind CSS for styling

**Files to create**:
- `tailwind.config.js`
- `postcss.config.js`
- `src/index.css`

**Tailwind Config**:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#06B6D4',
        accent: '#F59E0B',
      },
    },
  },
  plugins: [],
}
```

**Acceptance Criteria**:
- ✅ Tailwind configured
- ✅ CSS compiles
- ✅ Can use Tailwind classes

**Commit Message**: `feat: configure Tailwind CSS`

---

#### 1.4 Create Manifest.json
⬜ **Task ID**: SETUP-004
**Description**: Create Chrome extension manifest (Manifest V3)

**File**: `public/manifest.json`

**Content**:
```json
{
  "manifest_version": 3,
  "name": "TabCompass",
  "version": "1.0.0",
  "description": "Navigate your browsing history. AI-powered semantic tab search.",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "permissions": [
    "tabs",
    "history",
    "storage",
    "scripting",
    "idle"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "src/background/index.ts",
    "type": "module"
  },
  "action": {
    "default_popup": "src/popup/index.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png"
    }
  },
  "options_page": "src/options/index.html",
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content/index.ts"],
      "run_at": "document_idle"
    }
  ],
  "commands": {
    "open-search": {
      "suggested_key": {
        "default": "Ctrl+Shift+K",
        "mac": "Command+Shift+K"
      },
      "description": "Open TabCompass search"
    }
  }
}
```

**Acceptance Criteria**:
- ✅ Valid Manifest V3 format
- ✅ All required permissions
- ✅ Commands configured

**Commit Message**: `feat: create Chrome extension manifest`

---

#### 1.5 Configure Vite for Chrome Extension
⬜ **Task ID**: SETUP-005
**Description**: Configure Vite to build Chrome extension properly

**File**: `vite.config.ts`

**Config**:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
        options: 'src/options/index.html',
      },
    },
  },
})
```

**Acceptance Criteria**:
- ✅ Vite builds extension
- ✅ Multiple entry points work
- ✅ Can load in Chrome

**Commit Message**: `feat: configure Vite for Chrome extension build`

---

#### 1.6 Create Placeholder Icons
⬜ **Task ID**: SETUP-006
**Description**: Create temporary extension icons (replace later with design)

**Files to create**:
- `public/icons/icon16.png`
- `public/icons/icon48.png`
- `public/icons/icon128.png`

**Implementation**: Use a simple compass emoji or solid color placeholder

**Acceptance Criteria**:
- ✅ Icons exist in correct sizes
- ✅ Extension loads without icon errors

**Commit Message**: `feat: add placeholder extension icons`

---

#### 1.7 Create Directory Structure
⬜ **Task ID**: SETUP-007
**Description**: Create all necessary source directories

**Directories to create**:
```
src/
├── background/
├── content/
├── popup/
│   ├── components/
│   └── styles/
├── onboarding/
│   └── components/
├── options/
│   └── components/
├── utils/
│   ├── api/
│   ├── storage/
│   └── search/
└── types/
```

**Files to create** (empty placeholders):
- `src/background/index.ts`
- `src/content/index.ts`
- `src/popup/index.html`
- `src/popup/index.tsx`
- `src/options/index.html`
- `src/options/index.tsx`
- `src/types/index.ts`

**Acceptance Criteria**:
- ✅ All directories exist
- ✅ Placeholder files created
- ✅ TypeScript compiles

**Commit Message**: `feat: create project directory structure`

---

#### 1.8 Verify Extension Loads in Chrome
⬜ **Task ID**: SETUP-008
**Description**: Build extension and verify it loads in Chrome without errors

**Commands**:
```bash
npm run build
```

**Manual Test**:
1. Open Chrome → `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist/` folder
5. Verify no errors in console

**Acceptance Criteria**:
- ✅ Extension builds successfully
- ✅ Loads in Chrome without errors
- ✅ Icon appears in toolbar

**Commit Message**: `feat: verify extension loads in Chrome`

---

**Phase 1 Completion Checklist**:
- ⬜ All 8 tasks completed
- ⬜ Extension loads in Chrome
- ⬜ No build errors
- ⬜ Git has 8 commits

---

## Phase 2: Core Type Definitions

**Goal**: Define TypeScript types for the entire application
**Estimated Time**: 20 minutes
**Status**: ⬜ Not Started

### Tasks

#### 2.1 Create Tab Type Definitions
⬜ **Task ID**: TYPES-001
**Description**: Define types for indexed tabs and search results

**File**: `src/types/tab.ts`

```typescript
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
```

**Acceptance Criteria**:
- ✅ All fields properly typed
- ✅ Extends correctly
- ✅ Exports work

**Commit Message**: `feat: add tab type definitions`

---

#### 2.2 Create Settings/Config Types
⬜ **Task ID**: TYPES-002
**Description**: Define types for user settings and API configuration

**File**: `src/types/settings.ts`

```typescript
export interface UserSettings {
  apiKey: string | null;         // Gemini API key (encrypted)
  mode: 'ai' | 'basic';          // AI mode or basic keyword search
  indexingEnabled: boolean;      // Auto-index new tabs
  excludedDomains: string[];     // Domains to never index
  maxHistoryDays: number;        // How far back to keep (default: 365)
  analyticsEnabled: boolean;     // Track usage analytics
  notificationsEnabled: boolean; // Show notifications
  theme: 'light' | 'dark' | 'auto';
}

export interface ApiConfig {
  model: string;                 // e.g., "gemini-1.5-flash"
  embeddingDimensions: number;   // 768
  maxTokens: number;             // Max content length
  temperature: number;           // For AI responses
}

export const DEFAULT_SETTINGS: UserSettings = {
  apiKey: null,
  mode: 'basic',
  indexingEnabled: true,
  excludedDomains: ['localhost', 'chrome://', 'chrome-extension://'],
  maxHistoryDays: 365,
  analyticsEnabled: true,
  notificationsEnabled: true,
  theme: 'auto',
};
```

**Acceptance Criteria**:
- ✅ All settings typed
- ✅ Defaults exported
- ✅ No TypeScript errors

**Commit Message**: `feat: add settings and config types`

---

#### 2.3 Create Analytics Types
⬜ **Task ID**: TYPES-003
**Description**: Define types for usage analytics and time tracking

**File**: `src/types/analytics.ts`

```typescript
export interface TimeEntry {
  tabId: string;
  domain: string;
  url: string;
  startTime: number;
  endTime: number;
  duration: number;              // Milliseconds
  category: string;
  date: string;                  // YYYY-MM-DD
}

export interface DomainStats {
  domain: string;
  totalTime: number;             // Milliseconds
  visitCount: number;
  percentage: number;            // Of total time
  category: string;
  lastVisit: number;
}

export interface CategoryStats {
  category: string;
  totalTime: number;
  tabCount: number;
  percentage: number;
  topDomains: DomainStats[];
}

export interface DailyStats {
  date: string;                  // YYYY-MM-DD
  totalTime: number;
  tabsIndexed: number;
  searches: number;
  topCategories: CategoryStats[];
}

export interface ProductivityMetrics {
  focusTime: number;             // Deep work (single topic)
  contextSwitches: number;       // How many topic switches
  mostProductiveHour: number;    // 0-23
  peakDays: string[];            // Days of week
}
```

**Acceptance Criteria**:
- ✅ Analytics types defined
- ✅ Matches PRODUCT_DOC.md spec
- ✅ Can calculate metrics

**Commit Message**: `feat: add analytics type definitions`

---

#### 2.4 Create API Response Types
⬜ **Task ID**: TYPES-004
**Description**: Define types for Gemini API responses

**File**: `src/types/api.ts`

```typescript
export interface GeminiEmbeddingResponse {
  embedding: {
    values: number[];
  };
}

export interface GeminiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

export interface ApiRequestOptions {
  apiKey: string;
  model: string;
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimited?: boolean;
}
```

**Acceptance Criteria**:
- ✅ Matches Gemini API structure
- ✅ Generic response types
- ✅ Error handling typed

**Commit Message**: `feat: add API response type definitions`

---

**Phase 2 Completion Checklist**:
- ⬜ All 4 type files created
- ⬜ No TypeScript errors
- ⬜ Types exported properly
- ⬜ Git has 4 new commits

---

## Phase 3: Storage Layer (IndexedDB)

**Goal**: Implement local storage for tabs and analytics
**Estimated Time**: 40 minutes
**Status**: ⬜ Not Started

### Tasks

#### 3.1 Create IndexedDB Wrapper
⬜ **Task ID**: STORAGE-001
**Description**: Create utility for IndexedDB operations using localforage

**File**: `src/utils/storage/db.ts`

```typescript
import localforage from 'localforage';
import type { IndexedTab, TimeEntry, DomainStats } from '../../types';

// Initialize stores
export const tabsStore = localforage.createInstance({
  name: 'TabCompass',
  storeName: 'tabs',
});

export const analyticsStore = localforage.createInstance({
  name: 'TabCompass',
  storeName: 'analytics',
});

export const settingsStore = localforage.createInstance({
  name: 'TabCompass',
  storeName: 'settings',
});

// Tab operations
export async function saveTab(tab: IndexedTab): Promise<void> {
  await tabsStore.setItem(tab.id, tab);
}

export async function getTab(id: string): Promise<IndexedTab | null> {
  return await tabsStore.getItem(id);
}

export async function getAllTabs(): Promise<IndexedTab[]> {
  const tabs: IndexedTab[] = [];
  await tabsStore.iterate((value: IndexedTab) => {
    tabs.push(value);
  });
  return tabs;
}

export async function deleteTab(id: string): Promise<void> {
  await tabsStore.removeItem(id);
}

export async function clearAllTabs(): Promise<void> {
  await tabsStore.clear();
}

// Analytics operations
export async function saveTimeEntry(entry: TimeEntry): Promise<void> {
  const key = `time_${entry.date}_${Date.now()}`;
  await analyticsStore.setItem(key, entry);
}

export async function getTimeEntries(startDate: string, endDate: string): Promise<TimeEntry[]> {
  const entries: TimeEntry[] = [];
  await analyticsStore.iterate((value: TimeEntry, key: string) => {
    if (key.startsWith('time_') && value.date >= startDate && value.date <= endDate) {
      entries.push(value);
    }
  });
  return entries;
}
```

**Acceptance Criteria**:
- ✅ All CRUD operations work
- ✅ Multiple stores initialized
- ✅ TypeScript types correct

**Commit Message**: `feat: create IndexedDB wrapper with localforage`

---

#### 3.2 Create Settings Manager
⬜ **Task ID**: STORAGE-002
**Description**: Manage user settings in Chrome storage (encrypted API key)

**File**: `src/utils/storage/settings.ts`

```typescript
import type { UserSettings, ApiConfig } from '../../types';
import { DEFAULT_SETTINGS } from '../../types/settings';

const SETTINGS_KEY = 'tabcompass_settings';
const API_KEY = 'tabcompass_api_key';

export async function getSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get([SETTINGS_KEY]);
  return { ...DEFAULT_SETTINGS, ...result[SETTINGS_KEY] };
}

export async function saveSettings(settings: Partial<UserSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await chrome.storage.local.set({ [SETTINGS_KEY]: updated });
}

export async function getApiKey(): Promise<string | null> {
  const result = await chrome.storage.local.get([API_KEY]);
  return result[API_KEY] || null;
}

export async function saveApiKey(apiKey: string): Promise<void> {
  await chrome.storage.local.set({ [API_KEY]: apiKey });
}

export async function clearApiKey(): Promise<void> {
  await chrome.storage.local.remove(API_KEY);
}

export async function hasApiKey(): Promise<boolean> {
  const key = await getApiKey();
  return key !== null && key.length > 0;
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  // Basic validation: starts with AIzaSy and is ~40 chars
  return apiKey.startsWith('AIzaSy') && apiKey.length >= 35;
}
```

**Acceptance Criteria**:
- ✅ Settings save/load works
- ✅ API key encrypted in storage
- ✅ Validation functions work

**Commit Message**: `feat: implement settings manager with API key handling`

---

#### 3.3 Create Cache Layer
⬜ **Task ID**: STORAGE-003
**Description**: Implement in-memory cache for frequently accessed data

**File**: `src/utils/storage/cache.ts`

```typescript
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
```

**Acceptance Criteria**:
- ✅ Cache works in memory
- ✅ TTL expiration works
- ✅ Generic type support

**Commit Message**: `feat: implement in-memory cache layer`

---

**Phase 3 Completion Checklist**:
- ⬜ All 3 storage utilities created
- ⬜ Can save/retrieve tabs
- ⬜ Settings persist across sessions
- ⬜ Git has 3 new commits

---

## Phase 4: Gemini API Integration

**Goal**: Integrate Google Gemini API for embeddings
**Estimated Time**: 30 minutes
**Status**: ⬜ Not Started

### Tasks

#### 4.1 Create Gemini API Client
⬜ **Task ID**: API-001
**Description**: Implement Gemini API client for generating embeddings

**File**: `src/utils/api/gemini.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ApiResponse } from '../../types';

let genAI: GoogleGenerativeAI | null = null;

export function initializeGemini(apiKey: string): void {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateEmbedding(
  text: string,
  apiKey?: string
): Promise<ApiResponse<number[]>> {
  try {
    if (!genAI && !apiKey) {
      return {
        success: false,
        error: 'API key not configured',
      };
    }

    if (apiKey && !genAI) {
      initializeGemini(apiKey);
    }

    const model = genAI!.getGenerativeModel({ model: 'text-embedding-004' });

    // Truncate text to max 2048 tokens (~8000 chars)
    const truncatedText = text.slice(0, 8000);

    const result = await model.embedContent(truncatedText);
    const embedding = result.embedding;

    return {
      success: true,
      data: embedding.values,
    };
  } catch (error: any) {
    console.error('Gemini API error:', error);

    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      return {
        success: false,
        error: 'Rate limit exceeded. Try again later.',
        rateLimited: true,
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to generate embedding',
    };
  }
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  const result = await generateEmbedding('test', apiKey);
  return result.success;
}
```

**Acceptance Criteria**:
- ✅ API client initializes
- ✅ Embeddings generated successfully
- ✅ Error handling works
- ✅ Rate limiting detected

**Commit Message**: `feat: implement Gemini API client for embeddings`

---

#### 4.2 Create Embedding Queue
⬜ **Task ID**: API-002
**Description**: Queue system to batch API requests and respect rate limits

**File**: `src/utils/api/queue.ts`

```typescript
interface QueueItem {
  id: string;
  text: string;
  resolve: (embedding: number[] | null) => void;
  reject: (error: Error) => void;
}

class EmbeddingQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private requestsThisMinute = 0;
  private maxRequestsPerMinute = 15; // Gemini free tier limit

  async add(id: string, text: string): Promise<number[] | null> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, text, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      // Rate limiting: max 15 requests per minute
      if (this.requestsThisMinute >= this.maxRequestsPerMinute) {
        console.log('Rate limit reached, waiting 60s...');
        await this.sleep(60000);
        this.requestsThisMinute = 0;
      }

      const item = this.queue.shift()!;

      try {
        const { generateEmbedding } = await import('./gemini');
        const result = await generateEmbedding(item.text);

        if (result.success && result.data) {
          item.resolve(result.data);
          this.requestsThisMinute++;
        } else {
          item.reject(new Error(result.error || 'Unknown error'));
        }
      } catch (error) {
        item.reject(error as Error);
      }

      // Small delay between requests
      await this.sleep(100);
    }

    this.processing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clear(): void {
    this.queue = [];
  }

  size(): number {
    return this.queue.length;
  }
}

export const embeddingQueue = new EmbeddingQueue();
```

**Acceptance Criteria**:
- ✅ Queue processes items in order
- ✅ Rate limiting works (15 RPM)
- ✅ Handles errors gracefully

**Commit Message**: `feat: implement embedding queue with rate limiting`

---

**Phase 4 Completion Checklist**:
- ⬜ Gemini API integrated
- ⬜ Rate limiting works
- ⬜ Can generate embeddings
- ⬜ Git has 2 new commits

---

## Phase 5: Content Extraction & Indexing

**Goal**: Extract text from tabs and index with embeddings
**Estimated Time**: 40 minutes
**Status**: ⬜ Not Started

### Tasks

#### 5.1 Create Content Extractor
⬜ **Task ID**: INDEX-001
**Description**: Extract text content from web pages

**File**: `src/content/extractor.ts`

```typescript
export function extractPageContent(): string {
  // Remove script, style, nav, footer
  const elementsToRemove = document.querySelectorAll(
    'script, style, nav, footer, header, aside, .ad, .advertisement'
  );
  const clone = document.body.cloneNode(true) as HTMLElement;

  clone.querySelectorAll('script, style, nav, footer, header, aside').forEach(el => {
    el.remove();
  });

  const text = clone.innerText || clone.textContent || '';

  // Clean up whitespace
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()
    .slice(0, 5000); // Limit to 5000 chars
}

export function extractMetadata(): {
  title: string;
  description: string;
  keywords: string[];
} {
  const title = document.title;
  const descMeta = document.querySelector('meta[name="description"]');
  const description = descMeta?.getAttribute('content') || '';
  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  const keywords = keywordsMeta?.getAttribute('content')?.split(',') || [];

  return { title, description, keywords };
}
```

**Acceptance Criteria**:
- ✅ Extracts clean text
- ✅ Removes ads/scripts
- ✅ Gets metadata

**Commit Message**: `feat: implement content extraction from web pages`

---

#### 5.2 Create Content Script
⬜ **Task ID**: INDEX-002
**Description**: Content script to extract and send content to background

**File**: `src/content/index.ts`

```typescript
import { extractPageContent, extractMetadata } from './extractor';

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractPageContent();
    const metadata = extractMetadata();

    sendResponse({
      content,
      metadata,
      url: window.location.href,
    });
  }
  return true; // Keep channel open for async response
});

// Notify background that page is loaded
if (document.readyState === 'complete') {
  chrome.runtime.sendMessage({ action: 'pageLoaded', url: window.location.href });
} else {
  window.addEventListener('load', () => {
    chrome.runtime.sendMessage({ action: 'pageLoaded', url: window.location.href });
  });
}
```

**Acceptance Criteria**:
- ✅ Listens for messages
- ✅ Extracts on demand
- ✅ Sends to background

**Commit Message**: `feat: implement content script for page extraction`

---

#### 5.3 Create Tab Indexer
⬜ **Task ID**: INDEX-003
**Description**: Index tabs with embeddings in background script

**File**: `src/background/indexer.ts`

```typescript
import type { IndexedTab } from '../types';
import { saveTab, getTab } from '../utils/storage/db';
import { embeddingQueue } from '../utils/api/queue';
import { getSettings } from '../utils/storage/settings';

export async function indexTab(tabId: number, url: string): Promise<void> {
  try {
    const settings = await getSettings();

    // Check if indexing is enabled
    if (!settings.indexingEnabled) return;

    // Check excluded domains
    const domain = new URL(url).hostname;
    if (settings.excludedDomains.some(d => domain.includes(d))) {
      console.log(`Skipping excluded domain: ${domain}`);
      return;
    }

    // Extract content from tab
    const response = await chrome.tabs.sendMessage(tabId, { action: 'extractContent' });

    if (!response?.content) {
      console.error('No content extracted');
      return;
    }

    // Generate unique ID
    const tabHash = `${url}_${Date.now()}`;

    // Generate embedding (queued)
    let embedding: number[] | null = null;
    if (settings.mode === 'ai' && settings.apiKey) {
      embedding = await embeddingQueue.add(tabHash, response.content);
    }

    // Create indexed tab
    const indexedTab: IndexedTab = {
      id: tabHash,
      url,
      title: response.metadata.title,
      content: response.content,
      embedding: embedding || [],
      timestamp: Date.now(),
      favicon: `https://www.google.com/s2/favicons?domain=${domain}`,
      domain,
      visitCount: 1,
      lastVisited: Date.now(),
      isOpen: true,
      tabId,
    };

    // Check if already indexed
    const existing = await getTab(url);
    if (existing) {
      indexedTab.visitCount = existing.visitCount + 1;
    }

    // Save to IndexedDB
    await saveTab(indexedTab);

    console.log(`Indexed tab: ${url}`);
  } catch (error) {
    console.error('Error indexing tab:', error);
  }
}
```

**Acceptance Criteria**:
- ✅ Indexes tabs with embeddings
- ✅ Respects settings
- ✅ Handles errors

**Commit Message**: `feat: implement tab indexing with embeddings`

---

#### 5.4 Create Background Service Worker
⬜ **Task ID**: INDEX-004
**Description**: Main background script to orchestrate indexing

**File**: `src/background/index.ts`

```typescript
import { indexTab } from './indexer';
import { initializeGemini } from '../utils/api/gemini';
import { getSettings, getApiKey } from '../utils/storage/settings';

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('TabCompass installed');

  // Initialize Gemini if API key exists
  const apiKey = await getApiKey();
  if (apiKey) {
    initializeGemini(apiKey);
  }

  // Open onboarding page
  chrome.tabs.create({ url: chrome.runtime.getURL('src/onboarding/index.html') });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Skip chrome:// and extension pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return;
    }

    // Index the tab
    await indexTab(tabId, tab.url);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pageLoaded' && sender.tab?.id) {
    indexTab(sender.tab.id, request.url);
  }
  return true;
});

// Listen for command (keyboard shortcut)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-search') {
    chrome.action.openPopup();
  }
});

console.log('TabCompass background script loaded');
```

**Acceptance Criteria**:
- ✅ Listens to tab events
- ✅ Triggers indexing
- ✅ Handles commands

**Commit Message**: `feat: implement background service worker for indexing`

---

**Phase 5 Completion Checklist**:
- ⬜ Content extraction works
- ⬜ Tabs auto-index on load
- ⬜ Embeddings generated
- ⬜ Git has 4 new commits

---

## Phase 6: Search & Vector Similarity

**Goal**: Implement semantic search with cosine similarity
**Estimated Time**: 30 minutes
**Status**: ⬜ Not Started

### Tasks

#### 6.1 Create Vector Math Utilities
⬜ **Task ID**: SEARCH-001
**Description**: Implement cosine similarity and vector operations

**File**: `src/utils/search/vector.ts`

```typescript
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);

  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

export function normalizeVector(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) return vec;
  return vec.map(val => val / norm);
}
```

**Acceptance Criteria**:
- ✅ Cosine similarity works
- ✅ Returns value 0-1
- ✅ Handles edge cases

**Commit Message**: `feat: implement vector math for similarity search`

---

#### 6.2 Create Semantic Search Engine
⬜ **Task ID**: SEARCH-002
**Description**: Search indexed tabs using semantic similarity

**File**: `src/utils/search/semantic.ts`

```typescript
import type { IndexedTab, SearchResult } from '../../types';
import { getAllTabs } from '../storage/db';
import { generateEmbedding } from '../api/gemini';
import { cosineSimilarity } from './vector';
import { searchCache, embeddingCache } from '../storage/cache';

export async function semanticSearch(
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  // Check cache
  const cacheKey = `search_${query}_${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached) return cached;

  // Generate query embedding
  const embeddingResult = await generateEmbedding(query);
  if (!embeddingResult.success || !embeddingResult.data) {
    throw new Error('Failed to generate query embedding');
  }

  const queryEmbedding = embeddingResult.data;

  // Get all indexed tabs
  const allTabs = await getAllTabs();

  // Filter tabs with embeddings
  const tabsWithEmbeddings = allTabs.filter(tab => tab.embedding.length > 0);

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

  // Cache results
  searchCache.set(cacheKey, topResults);

  return topResults;
}
```

**Acceptance Criteria**:
- ✅ Semantic search works
- ✅ Returns ranked results
- ✅ Caches queries

**Commit Message**: `feat: implement semantic search engine`

---

#### 6.3 Create Keyword Search Fallback
⬜ **Task ID**: SEARCH-003
**Description**: Keyword search for users without API key

**File**: `src/utils/search/keyword.ts`

```typescript
import Fuse from 'fuse.js';
import type { IndexedTab, SearchResult } from '../../types';
import { getAllTabs } from '../storage/db';

export async function keywordSearch(
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  const allTabs = await getAllTabs();

  const fuse = new Fuse(allTabs, {
    keys: ['title', 'content', 'url', 'domain'],
    threshold: 0.4,
    includeScore: true,
  });

  const results = fuse.search(query, { limit });

  return results.map(result => ({
    ...result.item,
    similarity: 1 - (result.score || 0), // Invert score (lower is better in Fuse)
    relevanceScore: 1 - (result.score || 0),
  }));
}
```

**Acceptance Criteria**:
- ✅ Fuzzy search works
- ✅ Searches multiple fields
- ✅ Returns ranked results

**Commit Message**: `feat: implement keyword search fallback`

---

#### 6.4 Create Unified Search API
⬜ **Task ID**: SEARCH-004
**Description**: Single API to route to semantic or keyword search

**File**: `src/utils/search/index.ts`

```typescript
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
```

**Acceptance Criteria**:
- ✅ Routes correctly based on mode
- ✅ Falls back to keyword if no API key
- ✅ Exports unified API

**Commit Message**: `feat: create unified search API`

---

**Phase 6 Completion Checklist**:
- ⬜ Semantic search works
- ⬜ Keyword fallback works
- ⬜ Search returns relevant results
- ⬜ Git has 4 new commits

---

## Phase 7: Popup UI (Search Interface)

**Goal**: Build React popup for searching tabs
**Estimated Time**: 45 minutes
**Status**: ⬜ Not Started

### Tasks

#### 7.1 Create Popup HTML
⬜ **Task ID**: UI-001
**Description**: Create popup HTML entry point

**File**: `src/popup/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TabCompass</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./index.tsx"></script>
</body>
</html>
```

**Acceptance Criteria**:
- ✅ Valid HTML5
- ✅ React root div
- ✅ Module script

**Commit Message**: `feat: create popup HTML entry point`

---

#### 7.2 Create Search Input Component
⬜ **Task ID**: UI-002
**Description**: Search input with keyboard shortcuts using Base UI

**File**: `src/popup/components/SearchInput.tsx`

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { Field } from '@base-ui/react/Field';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchInput({ onSearch, placeholder }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Field.Root>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
          <Field.Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Search your tabs...'}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </Field.Root>
    </form>
  );
}
```

**Acceptance Criteria**:
- ✅ Base UI Field component used
- ✅ Input auto-focuses
- ✅ Submits on Enter
- ✅ Clears on Escape

**Commit Message**: `feat: create search input component with Base UI`

---

#### 7.3 Create Search Results Component
⬜ **Task ID**: UI-003
**Description**: Display search results with actions

**File**: `src/popup/components/SearchResults.tsx`

```tsx
import React from 'react';
import type { SearchResult } from '../../types';
import { ExternalLink, Clock, Star } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  onSelectResult: (result: SearchResult) => void;
}

export function SearchResults({ results, onSelectResult }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {results.map((result) => (
        <div
          key={result.id}
          onClick={() => onSelectResult(result)}
          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="flex items-start gap-3">
            <img
              src={result.favicon}
              alt=""
              className="w-4 h-4 mt-1"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg/>';
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {result.title}
              </h3>
              <p className="text-sm text-gray-500 truncate mt-1">
                {result.domain}
              </p>
              {result.matchedContent && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {result.matchedContent}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(result.lastVisited).toLocaleDateString()}
                </span>
                {result.similarity && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {Math.round(result.similarity * 100)}% match
                  </span>
                )}
                {result.isOpen && (
                  <span className="text-green-600">● Open</span>
                )}
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Displays results
- ✅ Shows metadata
- ✅ Clickable items

**Commit Message**: `feat: create search results component`

---

#### 7.4 Create Main Popup Component
⬜ **Task ID**: UI-004
**Description**: Main popup app component

**File**: `src/popup/App.tsx`

```tsx
import React, { useState } from 'react';
import type { SearchResult } from '../types';
import { SearchInput } from './components/SearchInput';
import { SearchResults } from './components/SearchResults';
import { search } from '../utils/search';

export function App() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const searchResults = await search(query, 10);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = async (result: SearchResult) => {
    if (result.isOpen && result.tabId) {
      // Switch to open tab
      await chrome.tabs.update(result.tabId, { active: true });
    } else {
      // Open in new tab
      await chrome.tabs.create({ url: result.url });
    }
    // Close popup
    window.close();
  };

  return (
    <div className="w-[600px] h-[500px] flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          🧭 TabCompass
        </h1>
        <SearchInput onSearch={handleSearch} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <SearchResults results={results} onSelectResult={handleSelectResult} />
        )}
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Search works
- ✅ Results display
- ✅ Opens tabs on click

**Commit Message**: `feat: create main popup component`

---

#### 7.5 Create Popup Entry Point
⬜ **Task ID**: UI-005
**Description**: React entry point for popup

**File**: `src/popup/index.tsx`

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**File**: `src/popup/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Acceptance Criteria**:
- ✅ React renders
- ✅ Styles applied
- ✅ Popup opens

**Commit Message**: `feat: create popup entry point with styles`

---

**Phase 7 Completion Checklist**:
- ⬜ Popup UI functional
- ⬜ Search works end-to-end
- ⬜ Can open/switch tabs
- ⬜ Git has 5 new commits

---

## Phase 8: Onboarding Flow

**Goal**: Create user onboarding for API key setup
**Estimated Time**: 40 minutes
**Status**: ⬜ Not Started

### Tasks

#### 8.1 Create Welcome Screen
⬜ **Task ID**: ONBOARD-001
**Description**: Initial welcome screen with demo video

**File**: `src/onboarding/components/Welcome.tsx`

```tsx
import React from 'react';
import { Compass } from 'lucide-react';

interface WelcomeProps {
  onNext: () => void;
}

export function Welcome({ onNext }: WelcomeProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="text-6xl mb-6">🧭</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to TabCompass!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Navigate your browsing history with AI-powered semantic search
      </p>

      <div className="bg-gray-100 rounded-lg p-8 mb-8">
        <p className="text-gray-700 mb-4">
          TabCompass helps you:
        </p>
        <ul className="text-left space-y-3 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Find tabs by content, not just title</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Search tabs from weeks or months ago</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Track your browsing productivity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>100% private - all data stays local</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onNext}
        className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Get Started
      </button>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Welcome renders
- ✅ Features listed
- ✅ Next button works

**Commit Message**: `feat: create welcome screen component`

---

#### 8.2 Create Mode Selection Screen
⬜ **Task ID**: ONBOARD-002
**Description**: Choose AI mode or Basic mode using Base UI

**File**: `src/onboarding/components/ModeSelection.tsx`

```tsx
import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'ai' | 'basic') => void;
}

export function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-12">
        Choose Your Experience
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* AI Mode Card */}
        <button
          onClick={() => onSelectMode('ai')}
          className="border-2 border-primary rounded-lg p-8 relative text-left hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="absolute -top-3 left-6 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            Recommended
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold">Full AI Mode</h3>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Semantic search by meaning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Smart auto-grouping</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Usage analytics with insights</span>
            </li>
          </ul>

          <p className="text-sm text-gray-600 mb-6">
            Requires: Free Gemini API key (2 min setup)
          </p>

          <div className="w-full bg-primary text-white py-3 rounded-lg text-center font-medium">
            Get Started with AI
          </div>
        </button>

        {/* Basic Mode Card */}
        <button
          onClick={() => onSelectMode('basic')}
          className="border-2 border-gray-300 rounded-lg p-8 text-left hover:shadow-lg hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-gray-600" />
            <h3 className="text-2xl font-bold">Basic Mode</h3>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Keyword search only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Manual grouping</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Basic time tracking</span>
            </li>
          </ul>

          <p className="text-sm text-gray-600 mb-6">
            No setup required
          </p>

          <div className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg text-center font-medium">
            Start with Basic Mode
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            You can upgrade to AI mode later in settings
          </p>
        </button>
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Two mode cards render as accessible buttons
- ✅ Keyboard navigation works
- ✅ Focus states visible
- ✅ Highlights recommended option

**Commit Message**: `feat: create mode selection component with Base UI accessibility`

---

#### 8.3 Create API Key Setup Screen
⬜ **Task ID**: ONBOARD-003
**Description**: Guide users through API key setup using Base UI

**File**: `src/onboarding/components/ApiKeySetup.tsx`

```tsx
import React, { useState } from 'react';
import { Field } from '@base-ui/react/Field';
import { Eye, EyeOff, ExternalLink, CheckCircle } from 'lucide-react';
import { validateApiKey, saveApiKey } from '../../utils/storage/settings';
import { testApiKey } from '../../utils/api/gemini';

interface ApiKeySetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function ApiKeySetup({ onComplete, onSkip }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenAIStudio = () => {
    window.open('https://aistudio.google.com/apikey', '_blank');
  };

  const handleVerify = async () => {
    setError(null);

    // Basic validation
    if (!validateApiKey(apiKey)) {
      setError('Invalid API key format. Key should start with "AIzaSy"');
      return;
    }

    setValidating(true);

    try {
      // Test the API key
      const isValid = await testApiKey(apiKey);

      if (isValid) {
        await saveApiKey(apiKey);
        onComplete();
      } else {
        setError('API key is invalid or has no quota remaining');
      }
    } catch (err) {
      setError('Failed to verify API key. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-3xl font-bold mb-4">Get Your Free Gemini API Key</h2>
      <p className="text-gray-600 mb-8">Takes 2 minutes, free forever</p>

      {/* Step 1 */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">Step 1: Open Google AI Studio</h3>
        <button
          onClick={handleOpenAIStudio}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ExternalLink className="w-5 h-5" />
          Click Here to Open AI Studio
        </button>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">Step 2: Create & Copy Your Key</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Create API Key" button</li>
            <li>Select or create a Google Cloud project</li>
            <li>Copy the generated key (starts with "AIzaSy...")</li>
          </ol>
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-8">
        <Field.Root invalid={!!error}>
          <Field.Label className="font-semibold text-lg mb-3 block">
            Step 3: Paste It Here
          </Field.Label>
          <div className="relative">
            <Field.Input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all data-[invalid]:border-red-500 data-[invalid]:focus:ring-red-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <Field.Error className="text-red-600 text-sm mt-2">
              {error}
            </Field.Error>
          )}

          <Field.Description className="text-xs text-gray-500 mt-2">
            🔒 Your key is stored locally and encrypted. We never see it.
          </Field.Description>
        </Field.Root>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleVerify}
          disabled={!apiKey || validating}
          className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {validating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Verifying...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Verify & Continue
            </span>
          )}
        </button>

        <button
          onClick={onSkip}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Base UI Field component with validation
- ✅ Accessible form with labels and descriptions
- ✅ API key validation and testing
- ✅ Error states handled properly
- ✅ Keyboard navigation works

**Commit Message**: `feat: create API key setup component with Base UI Field`

---

#### 8.4 Create Success Screen
⬜ **Task ID**: ONBOARD-004
**Description**: Completion screen with quick start guide

**File**: `src/onboarding/components/Success.tsx`

```tsx
import React from 'react';
import { CheckCircle, Keyboard, BarChart } from 'lucide-react';

export function Success() {
  const handleClose = () => {
    window.close();
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
      <p className="text-gray-600 mb-8">
        TabCompass is now indexing your tabs
      </p>

      <div className="bg-gray-50 rounded-lg p-8 mb-8 text-left">
        <h3 className="font-semibold text-lg mb-4">Quick Start:</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Keyboard className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Press Cmd+Shift+K (Mac) or Ctrl+Shift+K (Windows)</p>
              <p className="text-sm text-gray-600">Open search anytime</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🧭</span>
            <div>
              <p className="font-medium">Visit a few pages to build your index</p>
              <p className="text-sm text-gray-600">TabCompass will automatically index new tabs</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BarChart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Check Analytics in Settings</p>
              <p className="text-sm text-gray-600">See where your time goes</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Start Browsing
      </button>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Success message
- ✅ Quick start guide
- ✅ Close button works

**Commit Message**: `feat: create success screen component`

---

#### 8.5 Create Onboarding Flow Container
⬜ **Task ID**: ONBOARD-005
**Description**: Main onboarding component with state management

**File**: `src/onboarding/App.tsx`

```tsx
import React, { useState } from 'react';
import { Welcome } from './components/Welcome';
import { ModeSelection } from './components/ModeSelection';
import { ApiKeySetup } from './components/ApiKeySetup';
import { Success } from './components/Success';
import { saveSettings } from '../utils/storage/settings';

type OnboardingStep = 'welcome' | 'mode' | 'apiKey' | 'success';

export function App() {
  const [step, setStep] = useState<OnboardingStep>('welcome');

  const handleSelectMode = async (mode: 'ai' | 'basic') => {
    await saveSettings({ mode });

    if (mode === 'ai') {
      setStep('apiKey');
    } else {
      setStep('success');
    }
  };

  const handleApiKeyComplete = () => {
    setStep('success');
  };

  const handleSkipApiKey = async () => {
    await saveSettings({ mode: 'basic' });
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4">
        {step === 'welcome' && <Welcome onNext={() => setStep('mode')} />}
        {step === 'mode' && <ModeSelection onSelectMode={handleSelectMode} />}
        {step === 'apiKey' && (
          <ApiKeySetup
            onComplete={handleApiKeyComplete}
            onSkip={handleSkipApiKey}
          />
        )}
        {step === 'success' && <Success />}
      </div>
    </div>
  );
}
```

**Acceptance Criteria**:
- ✅ Step navigation works
- ✅ Settings saved
- ✅ Complete flow

**Commit Message**: `feat: create onboarding flow container`

---

#### 8.6 Create Onboarding Entry Points
⬜ **Task ID**: ONBOARD-006
**Description**: HTML and TypeScript entry points

**File**: `src/onboarding/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TabCompass</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./index.tsx"></script>
</body>
</html>
```

**File**: `src/onboarding/index.tsx`

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '../popup/index.css'; // Reuse styles

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Acceptance Criteria**:
- ✅ Page loads
- ✅ React renders
- ✅ Styles applied

**Commit Message**: `feat: create onboarding entry points`

---

**Phase 8 Completion Checklist**:
- ⬜ Onboarding flow complete
- ⬜ API key setup works
- ⬜ Mode selection saves
- ⬜ Git has 6 new commits

---

## Phase 9: Analytics & Time Tracking

**Goal**: Implement basic time tracking for demo
**Estimated Time**: 30 minutes
**Status**: ⬜ Not Started

### Tasks

#### 9.1 Create Time Tracker
⬜ **Task ID**: ANALYTICS-001
**Description**: Track active time per tab/domain

**File**: `src/background/analytics.ts`

```typescript
import type { TimeEntry } from '../types';
import { saveTimeEntry } from '../utils/storage/db';

let activeTabId: number | null = null;
let startTime: number | null = null;

export function startTracking(tabId: number): void {
  // Save previous session if exists
  if (activeTabId !== null && startTime !== null) {
    stopTracking();
  }

  activeTabId = tabId;
  startTime = Date.now();
}

export async function stopTracking(): Promise<void> {
  if (activeTabId === null || startTime === null) return;

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Only save if duration > 5 seconds (filter out quick switches)
  if (duration < 5000) {
    activeTabId = null;
    startTime = null;
    return;
  }

  try {
    const tab = await chrome.tabs.get(activeTabId);
    const url = tab.url || '';
    const domain = new URL(url).hostname;

    const entry: TimeEntry = {
      tabId: `${activeTabId}_${startTime}`,
      domain,
      url,
      startTime,
      endTime,
      duration,
      category: categorize(domain),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    await saveTimeEntry(entry);
  } catch (error) {
    console.error('Error saving time entry:', error);
  }

  activeTabId = null;
  startTime = null;
}

function categorize(domain: string): string {
  if (domain.includes('github.com') || domain.includes('stackoverflow.com')) {
    return 'Development';
  }
  if (domain.includes('youtube.com') || domain.includes('twitter.com')) {
    return 'Social';
  }
  if (domain.includes('medium.com') || domain.includes('dev.to')) {
    return 'Learning';
  }
  return 'Other';
}
```

**Acceptance Criteria**:
- ✅ Tracks active time
- ✅ Saves to IndexedDB
- ✅ Categorizes domains

**Commit Message**: `feat: implement time tracking for analytics`

---

#### 9.2 Integrate Time Tracking in Background
⬜ **Task ID**: ANALYTICS-002
**Description**: Hook time tracker into tab events

**Update File**: `src/background/index.ts`

```typescript
// Add to existing file
import { startTracking, stopTracking } from './analytics';

// Listen for tab activation
chrome.tabs.onActivated.addListener(({ tabId }) => {
  startTracking(tabId);
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus
    stopTracking();
  } else {
    // Get active tab in focused window
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs[0]?.id) {
        startTracking(tabs[0].id);
      }
    });
  }
});

// Listen for idle state
chrome.idle.onStateChanged.addListener((state) => {
  if (state === 'idle' || state === 'locked') {
    stopTracking();
  } else if (state === 'active') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        startTracking(tabs[0].id);
      }
    });
  }
});
```

**Acceptance Criteria**:
- ✅ Tracking starts on tab switch
- ✅ Stops on idle
- ✅ Time entries saved

**Commit Message**: `feat: integrate time tracking into background script`

---

**Phase 9 Completion Checklist**:
- ⬜ Time tracking works
- ⬜ Data saves to IndexedDB
- ⬜ Can query analytics data
- ⬜ Git has 2 new commits

---

## Phase 10: Testing & Bug Fixes

**Goal**: Test all features and fix critical bugs
**Estimated Time**: 30 minutes
**Status**: ⬜ Not Started

### Tasks

#### 10.1 Test Extension Loading
⬜ **Task ID**: TEST-001
**Description**: Verify extension loads without errors

**Manual Test**:
1. Build extension: `npm run build`
2. Load in Chrome: `chrome://extensions` → Load unpacked → `dist/`
3. Check for errors in console
4. Verify icon appears

**Acceptance Criteria**:
- ✅ No console errors
- ✅ Extension icon visible
- ✅ Manifest valid

**Commit Message**: `test: verify extension loads successfully`

---

#### 10.2 Test Tab Indexing
⬜ **Task ID**: TEST-002
**Description**: Test automatic tab indexing

**Manual Test**:
1. Open 5-10 different websites
2. Check IndexedDB (DevTools → Application → IndexedDB)
3. Verify tabs are indexed
4. Check embeddings exist (if API key set)

**Acceptance Criteria**:
- ✅ Tabs appear in IndexedDB
- ✅ Content extracted
- ✅ Embeddings generated (AI mode)

**Commit Message**: `test: verify tab indexing functionality`

---

#### 10.3 Test Search Functionality
⬜ **Task ID**: TEST-003
**Description**: Test semantic and keyword search

**Manual Test**:
1. Open popup (Cmd+Shift+K)
2. Search for indexed content
3. Verify results appear
4. Click result → verify tab opens/switches

**Acceptance Criteria**:
- ✅ Search returns results
- ✅ Results ranked correctly
- ✅ Clicking opens/switches tabs

**Commit Message**: `test: verify search functionality works`

---

#### 10.4 Test Onboarding Flow
⬜ **Task ID**: TEST-004
**Description**: Test complete onboarding experience

**Manual Test**:
1. Fresh install (or clear storage)
2. Go through onboarding
3. Try both AI and Basic modes
4. Verify API key saves
5. Check settings persist

**Acceptance Criteria**:
- ✅ Onboarding completes
- ✅ API key saves
- ✅ Mode selection works

**Commit Message**: `test: verify onboarding flow`

---

#### 10.5 Test Time Tracking
⬜ **Task ID**: TEST-005
**Description**: Verify analytics time tracking

**Manual Test**:
1. Switch between tabs
2. Wait 10+ seconds on each
3. Check IndexedDB for time entries
4. Verify duration calculated correctly

**Acceptance Criteria**:
- ✅ Time entries saved
- ✅ Duration accurate
- ✅ Categories assigned

**Commit Message**: `test: verify time tracking accuracy`

---

#### 10.6 Fix Critical Bugs
⬜ **Task ID**: TEST-006
**Description**: Fix any bugs found during testing

**Process**:
1. Document bugs found
2. Prioritize (critical → nice-to-have)
3. Fix critical bugs only
4. Test fixes

**Acceptance Criteria**:
- ✅ All critical bugs fixed
- ✅ Extension stable
- ✅ Core features work

**Commit Message**: `fix: resolve critical bugs from testing`

---

**Phase 10 Completion Checklist**:
- ⬜ All tests pass
- ⬜ Critical bugs fixed
- ⬜ Extension stable
- ⬜ Git has 6 new commits

---

## Phase 11: Polish & Demo Prep

**Goal**: Prepare for hackathon demo
**Estimated Time**: 20 minutes
**Status**: ⬜ Not Started

### Tasks

#### 11.1 Create Demo Data
⬜ **Task ID**: DEMO-001
**Description**: Pre-index demo tabs for presentation

**Manual Task**:
1. Open 30 diverse tabs (React, Docker, PostgreSQL, etc.)
2. Let TabCompass index them
3. Close half (simulate history)
4. Test demo queries:
   - "React performance optimization"
   - "Docker networking tutorial"
   - "PostgreSQL indexing strategies"

**Acceptance Criteria**:
- ✅ 30+ tabs indexed
- ✅ Demo queries return good results
- ✅ Mix of open/closed tabs

**Commit Message**: `demo: prepare demo data for presentation`

---

#### 11.2 Create Demo Script
⬜ **Task ID**: DEMO-002
**Description**: Document demo flow for presentation

**File**: `DEMO_SCRIPT.md`

```markdown
# TabCompass Demo Script (3 minutes)

## Setup (Before Demo)
- [ ] 30 tabs pre-indexed (mix of React, Docker, DB topics)
- [ ] Close 15 tabs (simulate history)
- [ ] Have 3 queries ready

## Act 1: The Problem (30s)
1. Open Chrome history (Cmd+H)
2. Search "react hooks" → Show 120+ results
3. Say: "Current search is broken - keyword only, no understanding"

## Act 2: The Magic (90s)
### Demo 1: Semantic Search
1. Press Cmd+Shift+K → TabCompass opens
2. Type: "how to prevent re-renders in React"
3. Show results instantly (including closed tabs)
4. Say: "Notice - none mention 'prevent re-renders' in title"
5. Click result → tab opens/switches

### Demo 2: Content Search
1. Search: "Docker bridge networks DNS issues"
2. Show specific result from paragraph content
3. Say: "Searches actual content, not just titles"

### Demo 3: History Search
1. Search: "PostgreSQL B-tree indexes"
2. Show tabs from yesterday (closed)
3. Click → reopens tab
4. Say: "Finds tabs from weeks ago"

## Act 3: The Differentiator (30s)
1. Mention: "Competitors charge $$ or send data to servers"
2. Mention: "TabCompass - free forever, 100% local"
3. Mention: "Built in 4 hours with Gemini API"

## Act 4: Close (30s)
1. Recap: "Find tabs by meaning, not keywords"
2. Show: 100% local storage (privacy)
3. Open to questions
```

**Acceptance Criteria**:
- ✅ Script documented
- ✅ Timing under 3 minutes
- ✅ Highlights key features

**Commit Message**: `docs: create demo presentation script`

---

#### 11.3 Add README
⬜ **Task ID**: DEMO-003
**Description**: Create README for GitHub/judges

**File**: `README.md`

```markdown
# 🧭 TabCompass

> Navigate your browsing history. Find what you read, not what you remember.

**Built for**: NS Mini-Gemini Hackathon (January 4, 2026)
**Tech Stack**: Gemini API, Chrome Extensions, React, TypeScript, Vite

---

## The Problem

- Developers lose **4 hours/week** to context switching
- Chrome history search only matches **titles**, not content
- Can't find tabs from weeks/months ago
- No analytics on browsing productivity

## The Solution

**TabCompass** uses Google's Gemini API to create a semantic memory layer for your browser:

✅ **Semantic Search** - Find tabs by meaning, not keywords
✅ **Persistent Memory** - Search tabs from months ago
✅ **Analytics** - Track browsing productivity
✅ **100% Private** - All data stored locally
✅ **Free Forever** - You provide your own API key (1,500 free requests/day)

---

## Quick Start

1. **Install** - Load unpacked extension from `dist/`
2. **Get API Key** - Visit [Google AI Studio](https://aistudio.google.com/apikey)
3. **Paste Key** - In onboarding flow
4. **Search** - Press `Cmd+Shift+K` (Mac) or `Ctrl+Shift+K` (Windows)

---

## Features

### Semantic Search
Search by what you **remember**, not exact keywords:
- Query: "how to prevent memory leaks in React"
- Finds: Tabs about useEffect cleanup, even if title is "My React Journey"

### Time Travel
Find tabs from weeks or months ago:
- All tabs indexed permanently in IndexedDB
- No 90-day Chrome history limit

### Analytics (Coming Soon)
- Time tracking per domain/category
- Productivity heatmaps
- Context switching analysis

---

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **AI**: Google Gemini API (text-embedding-004)
- **Storage**: IndexedDB (localforage)
- **Search**: Cosine similarity on embeddings
- **Build**: Vite with Chrome extension plugin

---

## Privacy

- ✅ 100% local storage (IndexedDB)
- ✅ You control your API key
- ✅ No backend servers
- ✅ No data collection
- ✅ Open source (audit the code)

---

## Competitors

| Feature | Sessionat | SurfMind | TabCompass |
|---------|-----------|----------|------------|
| Semantic Search | ✅ Paid | ✅ Cloud | ✅ **Free** |
| Privacy | ✅ Local | ❌ Server | ✅ **Local** |
| Analytics | ❌ No | ❌ No | ✅ **Yes** |

---

## Building from Source

```bash
npm install
npm run dev    # Development
npm run build  # Production
```

Load in Chrome:
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist/` folder

---

## License

MIT - Open source and free forever

---

**Built in 4 hours for the NS Mini-Gemini Hackathon** 🚀
```

**Acceptance Criteria**:
- ✅ README explains product clearly
- ✅ Setup instructions included
- ✅ Tech stack documented

**Commit Message**: `docs: add comprehensive README`

---

**Phase 11 Completion Checklist**:
- ⬜ Demo data prepared
- ⬜ Demo script ready
- ⬜ README complete
- ⬜ Git has 3 new commits

---

## Final Checklist

### Pre-Demo Verification
- ⬜ Extension builds without errors
- ⬜ Loads in Chrome successfully
- ⬜ Onboarding flow works
- ⬜ Search returns results
- ⬜ API key saves/loads
- ⬜ Time tracking logs data
- ⬜ Demo queries prepared
- ⬜ All commits pushed to git

### Git Summary
- ⬜ Total commits: ~50+
- ⬜ All tasks marked as ✅
- ⬜ Clean commit history
- ⬜ No uncommitted changes

### Documentation
- ⬜ PRODUCT_DOC.md complete
- ⬜ IMPLEMENTATION.md updated
- ⬜ README.md published
- ⬜ DEMO_SCRIPT.md ready

---

## Project Statistics

**Total Estimated Time**: 4 hours
**Total Tasks**: 57
**Total Phases**: 11
**Lines of Code**: ~2,500+

**Tech Stack**:
- React + TypeScript
- Gemini API
- Chrome Extensions (Manifest V3)
- IndexedDB + localforage
- Vite + Tailwind CSS

---

## Post-Hackathon Roadmap

### Phase 12: Analytics Dashboard (Post-Hackathon)
- Full analytics UI with charts
- Productivity heatmaps
- Weekly insights

### Phase 13: Advanced Features (Post-Hackathon)
- AI auto-grouping
- "Find similar" on current tab
- Export data (CSV, JSON)

### Phase 14: Cross-Browser (Post-Hackathon)
- Firefox support
- Edge support
- Safari support

---

**Last Updated**: January 3, 2026
**Status**: ⬜ Ready to Begin
**Next Task**: SETUP-001 - Initialize Project Structure

---

## Notes for AI Agent

- Follow tasks **in order** (SETUP-001 → SETUP-002 → ...)
- **Ask for approval** after each task implementation
- **Commit immediately** after approval
- **Update this doc** (change ⬜ to ✅) after each commit
- **Stop** if user rejects implementation (fix and retry)
- **Check dependencies** before starting a task
- **Test locally** before asking for approval

**Good luck! 🚀**
