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
    let embedding: number[] = [];
    if (settings.mode === 'ai' && settings.apiKey) {
      try {
        const result = await embeddingQueue.add(tabHash, response.content);
        if (result) {
          embedding = result;
        }
      } catch (error) {
        console.error('Failed to generate embedding:', error);
      }
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

    console.log(`Indexed tab: ${url}`);
  } catch (error) {
    console.error('Error indexing tab:', error);
  }
}
