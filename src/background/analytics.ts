import type { TimeEntry } from '../types';
import { saveTimeEntry } from '../utils/storage/db';

let activeTabId: number | null = null;
let startTime: number | null = null;

export function startTracking(tabId: number): void {
  // Save previous session if exists
  if (activeTabId !== null && startTime !== null) {
    stopTracking();
  }

  activeTabId = tabId;
  startTime = Date.now();
}

export async function stopTracking(): Promise<void> {
  if (activeTabId === null || startTime === null) return;

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Only save if duration > 5 seconds (filter out quick switches)
  if (duration < 5000) {
    activeTabId = null;
    startTime = null;
    return;
  }

  try {
    const tab = await chrome.tabs.get(activeTabId);
    const url = tab.url || '';

    // Skip chrome:// and extension pages
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      activeTabId = null;
      startTime = null;
      return;
    }

    const domain = new URL(url).hostname;

    const entry: TimeEntry = {
      tabId: `${activeTabId}_${startTime}`,
      domain,
      url,
      startTime,
      endTime,
      duration,
      category: categorize(domain),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    await saveTimeEntry(entry);
  } catch (error) {
    console.error('Error saving time entry:', error);
  }

  activeTabId = null;
  startTime = null;
}

function categorize(domain: string): string {
  // Development
  if (
    domain.includes('github.com') ||
    domain.includes('gitlab.com') ||
    domain.includes('stackoverflow.com') ||
    domain.includes('developer.') ||
    domain.includes('docs.')
  ) {
    return 'Development';
  }

  // Social/Entertainment
  if (
    domain.includes('youtube.com') ||
    domain.includes('twitter.com') ||
    domain.includes('x.com') ||
    domain.includes('facebook.com') ||
    domain.includes('instagram.com') ||
    domain.includes('reddit.com') ||
    domain.includes('tiktok.com')
  ) {
    return 'Social';
  }

  // Learning
  if (
    domain.includes('medium.com') ||
    domain.includes('dev.to') ||
    domain.includes('coursera.') ||
    domain.includes('udemy.') ||
    domain.includes('freecodecamp.') ||
    domain.includes('w3schools.') ||
    domain.includes('mdn.')
  ) {
    return 'Learning';
  }

  // Productivity
  if (
    domain.includes('notion.') ||
    domain.includes('trello.') ||
    domain.includes('asana.') ||
    domain.includes('jira.') ||
    domain.includes('linear.') ||
    domain.includes('slack.') ||
    domain.includes('gmail.') ||
    domain.includes('mail.')
  ) {
    return 'Productivity';
  }

  // News/Reading
  if (
    domain.includes('news.') ||
    domain.includes('bbc.') ||
    domain.includes('cnn.') ||
    domain.includes('nytimes.') ||
    domain.includes('hackernews') ||
    domain.includes('ycombinator')
  ) {
    return 'News';
  }

  return 'Other';
}
