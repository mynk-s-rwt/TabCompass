import { extractPageContent, extractMetadata } from './extractor';

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
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

console.log('TabCompass content script loaded');
