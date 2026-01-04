import { indexTab } from './indexer';
import { startTracking, stopTracking } from './analytics';
import { initializeGemini } from '../utils/api/gemini';
import { getApiKey } from '../utils/storage/settings';

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

  // Index all existing tabs (content script should auto-inject via manifest)
  // Give content scripts time to load on existing tabs
  setTimeout(async () => {
    console.log('[Background] Indexing existing tabs...');
    const existingTabs = await chrome.tabs.query({});
    let indexed = 0;
    let skipped = 0;

    for (const tab of existingTabs) {
      if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        try {
          await indexTab(tab.id, tab.url);
          indexed++;
        } catch (error) {
          // Content script not loaded - user needs to refresh this tab
          console.log('[Background] Tab needs refresh to index:', tab.url?.substring(0, 50));
          skipped++;
        }
      }
    }
    console.log(`[Background] Finished: ${indexed} indexed, ${skipped} need refresh`);
  }, 1000);
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
