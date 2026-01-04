# AI-Powered Search in TabCompass

> How we use Google Gemini to understand what you're looking for, not just what you typed.

---

## The Problem with Traditional Search

Traditional browser tab search relies on **keyword matching** — it looks for exact words in page titles and URLs. This approach has significant limitations:

```
Query: "that react tutorial about managing component state"

❌ Keyword Search: No results (none of these exact words in titles)
✅ Semantic Search: Finds "React Hooks: useState and useEffect Guide"
```

**TabCompass solves this** by understanding the *meaning* behind your search, not just matching characters.

---

## How Gemini AI Powers TabCompass

### The Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INDEXING PHASE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Page Visit                                                        │
│       │                                                             │
│       ▼                                                             │
│   ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐  │
│   │ Content Script  │───▶│ Text Extraction │───▶│ Gemini API    │  │
│   │ (extractor.ts)  │    │ Title + Body    │    │ Embedding     │  │
│   └─────────────────┘    └─────────────────┘    └───────┬───────┘  │
│                                                         │          │
│                                                         ▼          │
│                                               ┌─────────────────┐  │
│                                               │ 768-Dimensional │  │
│                                               │ Vector Stored   │  │
│                                               │ in IndexedDB    │  │
│                                               └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        SEARCH PHASE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   User Query                                                        │
│       │                                                             │
│       ▼                                                             │
│   ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐  │
│   │ "react state    │───▶│ Gemini API      │───▶│ Query Vector  │  │
│   │  management"    │    │ Embedding       │    │ [768 dims]    │  │
│   └─────────────────┘    └─────────────────┘    └───────┬───────┘  │
│                                                         │          │
│                                                         ▼          │
│   ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐  │
│   │ Ranked Results  │◀───│ Cosine          │◀───│ Compare with  │  │
│   │ by Relevance    │    │ Similarity      │    │ All Tab       │  │
│   └─────────────────┘    └─────────────────┘    │ Vectors       │  │
│                                                 └───────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Gemini Embeddings

### What is an Embedding?

An **embedding** is a way to represent text as a list of numbers (a vector) that captures its semantic meaning. Similar concepts end up close together in this numerical space.

```
"JavaScript tutorial"     → [0.12, -0.45, 0.78, 0.23, ...]  ─┐
"JS programming guide"    → [0.14, -0.42, 0.75, 0.25, ...]  ─┼── Similar vectors
"Learn JavaScript basics" → [0.11, -0.44, 0.76, 0.22, ...]  ─┘

"Recipe for pasta"        → [-0.67, 0.89, -0.12, 0.45, ...] ─── Very different
```

### Why Gemini?

We use Google's **`text-embedding-004`** model because:

| Feature | Benefit |
|---------|---------|
| **768 dimensions** | Rich semantic representation |
| **Optimized for retrieval** | Designed for search use-cases |
| **Multilingual** | Works across languages |
| **Free tier** | Generous quota for personal use |

### API Integration

```typescript
// From src/utils/api/gemini.ts

const model = genAI.getGenerativeModel({
  model: 'text-embedding-004'
});

const result = await model.embedContent(text);
const embedding = result.embedding.values; // number[768]
```

---

## Semantic Search Explained

### The Core Concept

Instead of asking *"Do these words match?"*, semantic search asks *"Do these concepts relate?"*

```
Traditional Keyword Search
─────────────────────────
Query: "car"
✅ Matches: "car", "cars", "car-related"
❌ Misses:  "automobile", "vehicle", "Tesla Model 3"


Semantic Search
───────────────
Query: "car"
✅ Matches: "car", "automobile", "vehicle", "Tesla Model 3",
           "driving tips", "auto insurance", "road trip guide"
```

### How TabCompass Implements It

```typescript
// From src/utils/search/semantic.ts

// 1. Convert query to vector
const queryEmbedding = await generateEmbedding(query);

// 2. Compare with every stored tab
const results = tabs.map(tab => ({
  ...tab,
  similarity: cosineSimilarity(queryEmbedding, tab.embedding)
}));

// 3. Return highest similarity matches
return results
  .filter(r => r.similarity >= 0.35)
  .sort((a, b) => b.similarity - a.similarity);
```

---

## Cosine Similarity

### The Math Behind Relevance

**Cosine similarity** measures the angle between two vectors. Identical directions = 1, perpendicular = 0, opposite = -1.

```
                    Vector A (Query)
                        ╱
                       ╱ θ = small angle
                      ╱    → High similarity (0.85)
                     ╱
    ─────────────────●─────────────────
                     │
                     │ θ = 90°
                     │    → No similarity (0.0)
                     │
                     ▼
                 Vector C (Unrelated)
```

### Formula

```
                    A · B           Σ(Aᵢ × Bᵢ)
cosine(θ) = ───────────────── = ─────────────────────
              ‖A‖ × ‖B‖        √Σ(Aᵢ²) × √Σ(Bᵢ²)
```

### Implementation

```typescript
// From src/utils/search/vector.ts

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

### Interpreting Scores

| Score | Interpretation | Example |
|-------|---------------|---------|
| **0.80 - 1.00** | Nearly identical meaning | "JS tutorial" ↔ "JavaScript tutorial" |
| **0.60 - 0.80** | Strongly related | "React hooks" ↔ "useState guide" |
| **0.40 - 0.60** | Somewhat related | "Web development" ↔ "CSS styling" |
| **0.20 - 0.40** | Weakly related | "Programming" ↔ "Tech news" |
| **0.00 - 0.20** | Unrelated | "JavaScript" ↔ "Cooking recipes" |

---

## Hybrid Search: Best of Both Worlds

Pure semantic search can sometimes return conceptually related but practically irrelevant results. TabCompass uses **hybrid scoring** to combine:

### Scoring Formula

```
Final Score = (Semantic × 0.60) + (Keyword × 0.25) + (Recency × 0.15)
            + Title Match Bonus + URL Match Bonus
```

### Components

| Component | Weight | Purpose |
|-----------|--------|---------|
| **Semantic Score** | 60% | Understanding meaning and context |
| **Keyword Score** | 25% | Precision — actual word matches |
| **Recency Boost** | 15% | Prefer recently visited tabs |
| **Title Match** | +10% | Bonus for query words in title |
| **URL Match** | +5% | Bonus for query words in URL |

### Why Hybrid?

```
Query: "apollo"

Pure Semantic Search:
  1. apollo - Google Search        (0.53) ✅
  2. Apollo Sign Up | Free B2B...  (0.53) ✅
  3. youtube - Google Search       (0.50) ❌ False positive!

Hybrid Search:
  1. Apollo Sign Up | Free B2B...  (0.71) ✅ Has "apollo" in title
  2. apollo - Google Search        (0.68) ✅ Has "apollo" in title
  3. youtube - Google Search       (0.32) ❌ Filtered out (no keyword match)
```

---

## Content Extraction for Better Embeddings

### The Challenge

Web pages contain lots of noise — navigation, ads, footers, cookie banners. Embedding all of this dilutes the actual content.

### Our Solution: Weighted Extraction

```typescript
// Content structure sent to Gemini
const content = [
  title,      // Repeated 3x for emphasis
  title,
  title,
  ...headings,    // H1, H2 elements
  metaDescription,
  ogDescription,
  bodyContent     // Main article text (cleaned)
].join(' | ');
```

### What Gets Removed

```typescript
const noiseSelectors = [
  // Structure
  'nav', 'footer', 'header', 'aside',

  // Ads & Popups
  '.ad', '.advertisement', '.cookie-banner', '.modal',

  // Platform-specific
  'ytd-guide-renderer',           // YouTube sidebar
  '[data-testid="sidebarColumn"]', // Twitter sidebar
  '#comments', '#related',         // YouTube noise

  // Common clutter
  '.share-buttons', '.social-share', '.navigation'
];
```

### Result

```
Before: 5000 chars of mixed navigation + content + ads
After:  5000 chars of pure, weighted content
        (Title appears 3x, ensuring it dominates the embedding)
```

---

## Privacy & Security

### What Data Goes to Gemini?

| Sent to API | NOT Sent |
|-------------|----------|
| Page text content (up to 5000 chars) | Your API key (stored locally) |
| Your search queries | Browsing history |
| | Personal information |
| | Cookies or session data |

### Local-First Architecture

```
┌─────────────────────────────────────────────────┐
│                 YOUR BROWSER                     │
│  ┌───────────────────────────────────────────┐  │
│  │              IndexedDB                     │  │
│  │  • Tab URLs                               │  │
│  │  • Extracted content                      │  │
│  │  • Embedding vectors                      │  │
│  │  • Time tracking data                     │  │
│  └───────────────────────────────────────────┘  │
│                      │                          │
│                      ▼                          │
│  ┌───────────────────────────────────────────┐  │
│  │         Chrome Extension APIs             │  │
│  │  • chrome.storage (encrypted)             │  │
│  │  • API key stored here                    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                       │
                       │ HTTPS (text only)
                       ▼
            ┌─────────────────────┐
            │   Gemini API        │
            │   (Google Cloud)    │
            │                     │
            │   Returns: [768]    │
            │   embedding vector  │
            └─────────────────────┘
```

---

## Performance Optimizations

### Caching

```typescript
// Search results are cached to avoid redundant API calls
const cacheKey = `search_${query}_${limit}`;
const cached = searchCache.get(cacheKey);
if (cached) return cached;
```

### Debouncing

```typescript
// Don't re-index the same URL within 5 seconds
const DEBOUNCE_MS = 5000;
if (Date.now() - lastIndexedTime.get(url) < DEBOUNCE_MS) {
  return; // Skip
}
```

### Rate Limiting

```typescript
// 500ms delay between indexing tabs to respect API limits
for (const tab of tabs) {
  await indexTab(tab.id, tab.url);
  await delay(500);
}
```

---

## Summary

| Feature | Technology | Benefit |
|---------|------------|---------|
| **Semantic Understanding** | Gemini Embeddings | Find tabs by meaning, not keywords |
| **Similarity Matching** | Cosine Similarity | Mathematical relevance ranking |
| **Precision** | Hybrid Scoring | Combines semantic + keyword matching |
| **Quality Input** | Weighted Extraction | Clean, title-focused content |
| **Privacy** | Local Storage | Your data stays in your browser |

---

<p align="center">
  <strong>TabCompass</strong> — Search smarter, not harder.
</p>
