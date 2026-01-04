import { indexTab } from './indexer';
import { startTracking, stopTracking } from './analytics';
import { initializeGemini } from '../utils/api/gemini';
import { getApiKey, getSettings } from '../utils/storage/settings';

// Helper to update indexing progress in storage
async function updateIndexingProgress(current: number, total: number, isComplete: boolean = false): Promise<void> {
  await chrome.storage.local.set({
    tabcompass_indexing_progress: isComplete ? null : { current, total, startedAt: Date.now() }
  });
}

// Helper to index all existing tabs with delays
async function indexExistingTabs(): Promise<void> {
  console.log('[Background] Starting to index existing tabs...');

  const tabs = await chrome.tabs.query({});
  const validTabs = tabs.filter(tab =>
    tab.id &&
    tab.url &&
    !tab.url.startsWith('chrome://') &&
    !tab.url.startsWith('chrome-extension://')
  );

  console.log(`[Background] Found ${validTabs.length} tabs to index`);

  if (validTabs.length === 0) {
    return;
  }

  // Set initial progress
  await updateIndexingProgress(0, validTabs.length);

  // Index tabs with 500ms delay between each to avoid rate limiting
  for (let i = 0; i < validTabs.length; i++) {
    const tab = validTabs[i];
    if (tab.id && tab.url) {
      console.log(`[Background] Indexing tab ${i + 1}/${validTabs.length}: ${tab.url.substring(0, 50)}`);
      await indexTab(tab.id, tab.url);

      // Update progress
      await updateIndexingProgress(i + 1, validTabs.length);

      // Delay between tabs (except for the last one)
      if (i < validTabs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // Clear progress when done
  await updateIndexingProgress(0, 0, true);
  console.log('[Background] Finished indexing existing tabs');
}

// Listen for storage changes (API key being set after onboarding)
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== 'local') return;

  // Check if API key was just set (changed from empty/null to a value)
  if (changes.tabcompass_api_key) {
    const oldValue = changes.tabcompass_api_key.oldValue as string | undefined;
    const newValue = changes.tabcompass_api_key.newValue as string | undefined;

    // Only trigger if API key was newly set (not updated)
    if (!oldValue && newValue) {
      console.log('[Background] API key newly set, initializing Gemini...');
      initializeGemini(newValue);

      // Check if mode is 'ai' before indexing
      const settings = await getSettings();
      if (settings.mode === 'ai') {
        console.log('[Background] AI mode enabled, indexing existing tabs...');
        // Small delay to ensure settings are fully saved
        setTimeout(() => indexExistingTabs(), 1000);
      }
    }
  }

  // Also check if mode changed to 'ai' when API key already exists
  if (changes.tabcompass_settings) {
    const oldSettings = changes.tabcompass_settings.oldValue as { mode?: string } | undefined;
    const newSettings = changes.tabcompass_settings.newValue as { mode?: string } | undefined;

    if (oldSettings?.mode !== 'ai' && newSettings?.mode === 'ai') {
      const apiKey = await getApiKey();
      if (apiKey) {
        console.log('[Background] Mode changed to AI with existing API key, indexing...');
        setTimeout(() => indexExistingTabs(), 1000);
      }
    }
  }
});

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[Background] TabCompass installed');

  // Initialize Gemini if API key exists
  const apiKey = await getApiKey();
  if (apiKey) {
    initializeGemini(apiKey);
  }

  // Open onboarding page
  chrome.tabs.create({ url: chrome.runtime.getURL('src/onboarding/index.html') });

  // Note: We don't index existing tabs on install because the user
  // hasn't completed onboarding yet (no API key, mode is 'basic').
  // Tabs will be indexed naturally when the user browses/refreshes them.
  console.log('[Background] Onboarding started - tabs will be indexed after setup');
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('[Background] tabs.onUpdated:', tabId, changeInfo.status, tab.url?.substring(0, 50));

  if (changeInfo.status === 'complete' && tab.url) {
    // Skip chrome:// and extension pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      console.log('[Background] Skipping chrome/extension URL');
      return;
    }

    console.log('[Background] Calling indexTab for:', tab.url);
    // Index the tab
    await indexTab(tabId, tab.url);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, _sendResponse) => {
  console.log('[Background] Message received:', request.action, sender.tab?.url?.substring(0, 50));

  if (request.action === 'pageLoaded' && sender.tab?.id && sender.tab?.url) {
    console.log('[Background] pageLoaded - calling indexTab');
    indexTab(sender.tab.id, sender.tab.url);
  }
  return true;
});

// Listen for command (keyboard shortcut)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-search') {
    chrome.action.openPopup();
  }
});

// Time Tracking: Listen for tab activation
chrome.tabs.onActivated.addListener(({ tabId }) => {
  startTracking(tabId);
});

// Time Tracking: Listen for window focus changes
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

// Time Tracking: Listen for idle state
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

console.log('TabCompass background script loaded');
