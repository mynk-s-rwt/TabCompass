import type { UserSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../types/settings';

const SETTINGS_KEY = 'tabcompass_settings';
const API_KEY = 'tabcompass_api_key';

export async function getSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get([SETTINGS_KEY]);
  const storedSettings = result[SETTINGS_KEY] as UserSettings | undefined;
  return { ...DEFAULT_SETTINGS, ...(storedSettings || {}) };
}

export async function saveSettings(settings: Partial<UserSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await chrome.storage.local.set({ [SETTINGS_KEY]: updated });
}

export async function getApiKey(): Promise<string | null> {
  const result = await chrome.storage.local.get([API_KEY]);
  const apiKey = result[API_KEY] as string | undefined;
  return apiKey || null;
}

export async function saveApiKey(apiKey: string): Promise<void> {
  await chrome.storage.local.set({ [API_KEY]: apiKey });
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
