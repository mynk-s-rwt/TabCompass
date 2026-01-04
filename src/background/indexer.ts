import type { IndexedTab } from '../types';
import { saveTab, getTab } from '../utils/storage/db';
import { embeddingQueue } from '../utils/api/queue';
import { getSettings, getApiKey } from '../utils/storage/settings';

export async function indexTab(tabId: number, url: string): Promise<void> {
  console.log('[Indexer] indexTab called for:', url);

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
          // Inline extraction function
          const clone = document.body.cloneNode(true) as HTMLElement;
          clone.querySelectorAll('script, style, nav, footer, header, aside, .ad, .advertisement').forEach(el => el.remove());
          const content = (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 5000);
          const title = document.title;
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

    // Generate embedding (queued) - use getApiKey() instead of settings.apiKey
    let embedding: number[] = [];
    if (settings.mode === 'ai' && apiKey) {
      console.log('[Indexer] AI mode enabled, generating embedding...');
      try {
        const result = await embeddingQueue.add(tabHash, response.content);
        if (result) {
          embedding = result;
          console.log('[Indexer] Embedding generated, dimensions:', embedding.length);
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

    console.log(`[Indexer] Successfully indexed tab: ${url}`);
  } catch (error) {
    console.error('[Indexer] Error indexing tab:', error);
  }
}
