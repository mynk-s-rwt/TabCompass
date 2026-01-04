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
