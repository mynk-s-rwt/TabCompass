import type { UserSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../types/settings';

const SETTINGS_KEY = 'tabcompass_settings';
const API_KEY = 'tabcompass_api_key';
const MODE_CACHE_KEY = 'tabcompass_mode_cache'; // localStorage key for instant access

export async function getSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get([SETTINGS_KEY]);
  const storedSettings = result[SETTINGS_KEY] as UserSettings | undefined;
  return { ...DEFAULT_SETTINGS, ...(storedSettings || {}) };
}

export async function saveSettings(settings: Partial<UserSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await chrome.storage.local.set({ [SETTINGS_KEY]: updated });

  // Update mode cache when settings change (only works in popup/options, not service worker)
  if (settings.mode !== undefined) {
    try {
      const apiKey = await getApiKey();
      updateModeCache(updated.mode === 'ai' && apiKey ? 'ai' : 'basic');
    } catch {
      // Ignore errors in service worker context
    }
  }
}

export async function getApiKey(): Promise<string | null> {
  const result = await chrome.storage.local.get([API_KEY]);
  const apiKey = result[API_KEY] as string | undefined;
  return apiKey || null;
}

export async function saveApiKey(apiKey: string): Promise<void> {
  await chrome.storage.local.set({ [API_KEY]: apiKey });
  // Update mode cache - if we have an API key and mode is 'ai', cache it
  // (only works in popup/options, not service worker)
  try {
    const settings = await getSettings();
    updateModeCache(settings.mode === 'ai' && apiKey ? 'ai' : 'basic');
  } catch {
    // Ignore errors in service worker context
  }
}

export async function clearApiKey(): Promise<void> {
  await chrome.storage.local.remove(API_KEY);
}

export async function hasApiKey(): Promise<boolean> {
  const key = await getApiKey();
  return key !== null && key.length > 0;
}

export function validateApiKey(apiKey: string): boolean {
  // Basic validation: starts with AIzaSy and is ~40 chars
  return apiKey.startsWith('AIzaSy') && apiKey.length >= 35;
}

// Synchronous mode cache functions for instant UI display
// Note: localStorage is NOT available in service workers
export function getCachedMode(): 'ai' | 'basic' | null {
  try {
    // Must check window exists before accessing localStorage
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      const cached = globalThis.localStorage.getItem(MODE_CACHE_KEY);
      if (cached === 'ai' || cached === 'basic') {
        return cached;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function updateModeCache(mode: 'ai' | 'basic'): void {
  try {
    // Must check window exists before accessing localStorage
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      globalThis.localStorage.setItem(MODE_CACHE_KEY, mode);
    }
  } catch {
    // Silently fail in service worker
  }
}
