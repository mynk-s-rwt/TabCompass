import localforage from 'localforage';
import type { IndexedTab, TimeEntry } from '../../types';

// Initialize stores
export const tabsStore = localforage.createInstance({
  name: 'TabCompass',
  storeName: 'tabs',
});

export const analyticsStore = localforage.createInstance({
  name: 'TabCompass',
  storeName: 'analytics',
});

export const settingsStore = localforage.createInstance({
  name: 'TabCompass',
  storeName: 'settings',
});

// Tab operations
export async function saveTab(tab: IndexedTab): Promise<void> {
  await tabsStore.setItem(tab.id, tab);
}

export async function getTab(id: string): Promise<IndexedTab | null> {
  return await tabsStore.getItem(id);
}

export async function getAllTabs(): Promise<IndexedTab[]> {
  const tabs: IndexedTab[] = [];
  await tabsStore.iterate((value: IndexedTab) => {
    tabs.push(value);
  });
  return tabs;
}

export async function deleteTab(id: string): Promise<void> {
  await tabsStore.removeItem(id);
}

export async function clearAllTabs(): Promise<void> {
  await tabsStore.clear();
}

// Analytics operations
export async function saveTimeEntry(entry: TimeEntry): Promise<void> {
  const key = `time_${entry.date}_${Date.now()}`;
  await analyticsStore.setItem(key, entry);
}

export async function getTimeEntries(startDate: string, endDate: string): Promise<TimeEntry[]> {
  const entries: TimeEntry[] = [];
  await analyticsStore.iterate((value: TimeEntry, key: string) => {
    if (key.startsWith('time_') && value.date >= startDate && value.date <= endDate) {
      entries.push(value);
    }
  });
  return entries;
}
