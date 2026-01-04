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
chrome.runtime.onMessage.addListener((request, sender, _sendResponse) => {
  if (request.action === 'pageLoaded' && sender.tab?.id && sender.tab?.url) {
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

console.log('TabCompass background script loaded');
