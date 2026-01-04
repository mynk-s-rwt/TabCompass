import type { IndexedTab } from '../types';
import { saveTab, getTab } from '../utils/storage/db';
import { getSettings, getApiKey } from '../utils/storage/settings';
import { generateEmbedding } from '../utils/api/gemini';

// Track URLs currently being indexed to prevent duplicates
const indexingInProgress = new Set<string>();

// Debounce map to prevent rapid re-indexing of the same URL
const lastIndexedTime = new Map<string, number>();
const DEBOUNCE_MS = 5000; // Don't re-index same URL within 5 seconds

export async function indexTab(tabId: number, url: string): Promise<void> {
  console.log('[Indexer] indexTab called for:', url);

  // Check if already indexing this URL
  if (indexingInProgress.has(url)) {
    console.log('[Indexer] Already indexing this URL, skipping');
    return;
  }

  // Check debounce - don't re-index same URL within 5 seconds
  const lastIndexed = lastIndexedTime.get(url);
  if (lastIndexed && Date.now() - lastIndexed < DEBOUNCE_MS) {
    console.log('[Indexer] URL was just indexed, skipping (debounce)');
    return;
  }

  // Mark as in progress
  indexingInProgress.add(url);

  try {
    const settings = await getSettings();
    const apiKey = await getApiKey();

    // Check if indexing is enabled
    if (!settings.indexingEnabled) {
      console.log('[Indexer] Indexing disabled, skipping');
      return;
    }

    // Check excluded domains
    const domain = new URL(url).hostname;
    if (settings.excludedDomains.some(d => domain.includes(d))) {
      console.log(`[Indexer] Skipping excluded domain: ${domain}`);
      return;
    }

    // Extract content from tab
    console.log('[Indexer] Sending extractContent message to tab:', tabId);

    let response;
    try {
      response = await chrome.tabs.sendMessage(tabId, { action: 'extractContent' });
    } catch (error) {
      // Content script not loaded - inject and extract directly
      console.log('[Indexer] Content script not loaded, using scripting API...');

      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          // === WEIGHTED CONTENT EXTRACTION ===
          // Title is most important for search relevance, so we repeat it 3x
          const title = document.title || '';
          const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
          const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
          const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';

          // Clone and clean the DOM
          const clone = document.body.cloneNode(true) as HTMLElement;
          const selectorsToRemove = [
            'script', 'style', 'noscript', 'iframe', 'svg',
            'nav', 'footer', 'header', 'aside',
            '.ad', '.advertisement', '.sidebar', '.menu', '.navigation', '.nav',
            '.cookie-banner', '.popup', '.modal', '.tooltip',
            '[role="banner"]', '[role="navigation"]', '[role="complementary"]',
            '[aria-hidden="true"]',
            'ytd-mini-guide-renderer', 'ytd-guide-renderer', 'tp-yt-app-drawer',
            '#guide', '#masthead', '#secondary', '#related', '#comments',
            '[aria-label="Guide"]', '[aria-label="Navigation"]',
            '[data-testid="sidebarColumn"]',
            '.share-buttons', '.social-share', '.comments-section', '.related-posts',
          ];
          clone.querySelectorAll(selectorsToRemove.join(',')).forEach(el => el.remove());

          // Extract headings
          const headings: string[] = [];
          clone.querySelectorAll('h1, h2').forEach(h => {
            const text = (h.textContent || '').trim();
            if (text && text.length > 3 && text.length < 200) headings.push(text);
          });
          const uniqueHeadings = [...new Set(headings)].slice(0, 5);

          // Get main content
          const mainContent = (clone.querySelector('main, article, [role="main"], #content, .content, #primary, .post-content, .article-content') || clone) as HTMLElement;
          let bodyText = (mainContent.innerText || mainContent.textContent || '').replace(/\s+/g, ' ').trim();

          // Remove boilerplate
          const boilerplate = ['Accept all cookies', 'Cookie preferences', 'Privacy policy', 'Terms of service', 'Sign in', 'Sign up', 'Subscribe', 'Skip to content', 'Loading...'];
          for (const phrase of boilerplate) {
            bodyText = bodyText.replace(new RegExp(phrase, 'gi'), '');
          }

          // Build weighted content (title 3x for importance)
          const parts: string[] = [];
          if (title) parts.push(title, title, title);
          if (ogTitle && ogTitle !== title) parts.push(ogTitle);
          if (uniqueHeadings.length > 0) parts.push(...uniqueHeadings);
          if (metaDesc) parts.push(metaDesc);
          if (ogDesc && ogDesc !== metaDesc) parts.push(ogDesc);
          if (bodyText) parts.push(bodyText);

          const content = parts.join(' | ').slice(0, 5000);
          return { content, metadata: { title } };
        },
      });

      if (results && results[0]?.result) {
        response = results[0].result;
      }
    }

    console.log('[Indexer] Content extraction response:', response ? 'received' : 'empty');

    if (!response?.content) {
      console.error('[Indexer] No content extracted from tab');
      return;
    }

    console.log('[Indexer] Content extracted, length:', response.content.length);

    // Generate unique ID
    const tabHash = `${url}_${Date.now()}`;

    // Generate embedding directly (no queue) - use getApiKey() instead of settings.apiKey
    let embedding: number[] = [];
    if (settings.mode === 'ai' && apiKey) {
      console.log('[Indexer] AI mode enabled, generating embedding...');
      try {
        const result = await generateEmbedding(response.content, apiKey);
        if (result.success && result.data) {
          embedding = result.data;
          console.log('[Indexer] Embedding generated, dimensions:', embedding.length);
        } else {
          console.error('[Indexer] Embedding failed:', result.error);
        }
      } catch (error) {
        console.error('[Indexer] Failed to generate embedding:', error);
      }
    } else {
      console.log('[Indexer] Skipping embedding (mode:', settings.mode, ', apiKey:', !!apiKey, ')');
    }

    // Create indexed tab
    const indexedTab: IndexedTab = {
      id: tabHash,
      url,
      title: response.metadata.title,
      content: response.content,
      embedding,
      timestamp: Date.now(),
      favicon: `https://www.google.com/s2/favicons?domain=${domain}`,
      domain,
      visitCount: 1,
      lastVisited: Date.now(),
      isOpen: true,
      tabId,
    };

    // Check if already indexed (by URL)
    const existing = await getTab(url);
    if (existing) {
      indexedTab.visitCount = existing.visitCount + 1;
      indexedTab.id = existing.id; // Keep same ID
    }

    // Save to IndexedDB
    await saveTab(indexedTab);

    // Update last indexed time for debounce
    lastIndexedTime.set(url, Date.now());

    console.log(`[Indexer] Successfully indexed tab: ${url}`);
  } catch (error) {
    console.error('[Indexer] Error indexing tab:', error);
  } finally {
    // Always clear the in-progress flag
    indexingInProgress.delete(url);
  }
}
