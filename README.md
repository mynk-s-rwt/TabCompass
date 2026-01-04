# TabCompass

**AI-powered semantic tab search for Chrome** - Navigate your browsing history with intelligence.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss&logoColor=white)

---

## The Problem

Modern browsers make it easy to open tabs but hard to find them. With dozens or hundreds of tabs open across multiple windows, finding that one article you read last week becomes a frustrating exercise in:

- Scrolling through endless tab bars
- Trying to remember exact page titles
- Using basic browser search that only matches exact keywords
- Losing context and wasting time

**TabCompass solves this by understanding *what* you're looking for, not just *what you typed*.**

---

## What is TabCompass?

TabCompass is a Chrome extension that indexes your browsing activity and lets you search through your tabs using natural language. Instead of searching for "react hooks tutorial", you can search for "that video about managing state in React" and find it.

### Key Features

#### Semantic Search (AI Mode)
- **Search by meaning, not keywords** - Find tabs even when you can't remember exact titles
- **Powered by Google Gemini** - Uses state-of-the-art embeddings for understanding context
- **Smart relevance ranking** - Combines semantic similarity with recency for better results

#### Keyword Search (Basic Mode)
- **Fuzzy matching** - Powered by Fuse.js for typo-tolerant search
- **No API required** - Works offline, no setup needed
- **Instant results** - Fast keyword matching across all indexed tabs

#### Analytics Dashboard
- **Time tracking** - See how much time you spend on different sites
- **Category breakdown** - Visualize browsing by category (Social, Development, News, etc.)
- **Daily trends** - Track your browsing patterns over 7, 14, or 30 days
- **Top domains** - Identify your most visited sites

#### Smart Indexing
- **Automatic content extraction** - Indexes page titles, descriptions, and main content
- **SPA support** - Properly indexes single-page apps like YouTube, Twitter, Gmail
- **Background processing** - Indexes tabs without slowing down your browsing
- **Progress indicator** - Shows indexing status in real-time

---

## Screenshots

### Popup Search
The main interface - quick access to search your tabs with `Cmd+Shift+K` (Mac) or `Ctrl+Shift+K` (Windows/Linux).

### Analytics Dashboard
Track your browsing patterns with visual charts showing time by category, daily activity trends, and top domains.

### Settings
Configure your search mode and manage your Gemini API key.

---

## How It Works

1. **Content Extraction** - When you visit a page, the content script extracts the title, meta description, and main text content (up to 5000 characters).

2. **Embedding Generation** (AI Mode) - The extracted content is sent to the Gemini API to generate a semantic embedding vector (768 dimensions).

3. **Local Storage** - Tab data and embeddings are stored locally in IndexedDB using localforage. Your data never leaves your browser.

4. **Search** - When you search:
   - **AI Mode**: Your query is converted to an embedding and compared against stored embeddings using cosine similarity
   - **Basic Mode**: Fuse.js performs fuzzy keyword matching against title, content, URL, and domain

5. **Time Tracking** - The background script tracks which tab is active, pausing when you're idle or switch away from Chrome.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 with TypeScript |
| **Styling** | Tailwind CSS v4 (Arc Browser-inspired dark theme) |
| **Build Tool** | Vite with CRXJS plugin for Chrome extension bundling |
| **AI/ML** | Google Gemini API (`text-embedding-004` model) |
| **Search** | Fuse.js for fuzzy keyword matching |
| **Storage** | IndexedDB via localforage |
| **Extension** | Chrome Manifest V3 with Service Workers |

---

## Project Structure

```
tabcompass/
├── src/
│   ├── background/          # Service worker scripts
│   │   ├── index.ts         # Main background script (tab events, commands)
│   │   ├── indexer.ts       # Tab content indexing logic
│   │   └── analytics.ts     # Time tracking implementation
│   │
│   ├── content/             # Content scripts
│   │   ├── index.ts         # Injected into all pages
│   │   └── extractor.ts     # DOM content extraction
│   │
│   ├── popup/               # Extension popup UI
│   │   └── components/      # React components (App, SearchInput, SearchResults)
│   │
│   ├── analytics/           # Analytics dashboard page
│   │   └── components/      # Charts and visualizations
│   │
│   ├── onboarding/          # First-run onboarding flow
│   │   └── components/      # Welcome, ModeSelection, ApiKeySetup, Success
│   │
│   ├── options/             # Settings page
│   │   └── index.tsx        # Mode toggle, API key management
│   │
│   ├── utils/
│   │   ├── api/             # Gemini API client and request queue
│   │   ├── search/          # Semantic and keyword search implementations
│   │   ├── storage/         # IndexedDB, settings, and cache utilities
│   │   └── analytics/       # Data aggregation for analytics
│   │
│   ├── types/               # TypeScript type definitions
│   └── index.css            # Global styles with Arc design system
│
├── public/
│   ├── manifest.json        # Chrome extension manifest
│   └── icons/               # Extension icons
│
├── docs/                    # Additional documentation
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended) or npm
- **Chrome** browser
- **Gemini API Key** (free) - [Get one from Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tabcompass.git
   cd tabcompass
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the extension**
   ```bash
   pnpm run build
   ```

4. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder

5. **Complete onboarding**
   - The onboarding page opens automatically
   - Choose AI Mode (recommended) or Basic Mode
   - If using AI Mode, enter your Gemini API key

### Development

For development with hot reload:

```bash
pnpm run dev
```

Then load the `dist` folder in Chrome. The extension will rebuild on file changes, but you'll need to click the refresh button in `chrome://extensions/` to see updates.

---

## Usage

### Quick Search
- Press `Cmd+Shift+K` (Mac) or `Ctrl+Shift+K` (Windows/Linux) to open the search popup
- Or click the TabCompass icon in your toolbar

### Searching
1. Type your search query
2. Press `Enter` to search
3. Click a result to navigate to that tab
4. Press `Escape` to clear the search

### Search Tips
- **AI Mode**: Use natural language - "article about TypeScript generics" works better than just "typescript"
- **Basic Mode**: Use keywords that appear in the page title or content

### Analytics
- Click the chart icon in the popup header to open the analytics dashboard
- Select time range (7, 14, or 30 days)
- View time breakdown by category, daily trends, and top domains

### Settings
- Click the gear icon in the popup header
- Switch between AI and Basic search modes
- Add, verify, or remove your Gemini API key

---

## Configuration

### Search Modes

| Mode | Pros | Cons |
|------|------|------|
| **AI** | Understands meaning, finds related content | Requires API key, uses network |
| **Basic** | Fast, offline, no setup | Only matches keywords |

### API Key Security
- Your API key is stored locally in Chrome's encrypted storage
- It's only sent to Google's Gemini API for generating embeddings
- Tab content is processed locally; only text is sent for embedding

---

## Privacy

TabCompass is designed with privacy in mind:

- **Local-first**: All tab data is stored locally in your browser's IndexedDB
- **No analytics collection**: We don't track your browsing or search behavior
- **Minimal API usage**: Only sends text content to Gemini for embedding (AI mode only)
- **No external servers**: No data is sent to any server except the Gemini API
- **Open source**: Full transparency on how your data is handled

---

## Permissions Explained

| Permission | Why It's Needed |
|------------|-----------------|
| `tabs` | Read tab titles and URLs for indexing |
| `history` | Access browsing history for time tracking |
| `storage` | Store indexed tabs and settings locally |
| `scripting` | Inject content script to extract page content |
| `idle` | Pause time tracking when you're away |
| `webNavigation` | Detect SPA navigations (YouTube, Twitter, etc.) |
| `<all_urls>` | Extract content from any website |

---

## Troubleshooting

### Search returns no results
1. Make sure you have indexed tabs (visit some pages first)
2. Check if AI mode has a valid API key (Settings > Gemini API Key)
3. Try broader search terms

### Indexing not working
1. Refresh the page you want to index
2. Check the browser console for errors (`Cmd+Option+J`)
3. Make sure the site isn't a chrome:// or extension page

### API key not working
1. Verify the key at [Google AI Studio](https://aistudio.google.com/apikey)
2. Check if you have API quota remaining
3. Try generating a new key

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the embedding API
- [Fuse.js](https://fusejs.io/) for fuzzy search
- [localforage](https://localforage.github.io/localForage/) for IndexedDB wrapper
- [CRXJS](https://crxjs.dev/vite-plugin) for Vite Chrome extension bundling
- [Arc Browser](https://arc.net/) for design inspiration

---

<p align="center">
  <strong>TabCompass</strong> - Find any tab, instantly.
</p>
