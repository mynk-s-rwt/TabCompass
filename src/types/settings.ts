export interface UserSettings {
  apiKey: string | null;         // Gemini API key (encrypted)
  mode: 'ai' | 'basic';          // AI mode or basic keyword search
  indexingEnabled: boolean;      // Auto-index new tabs
  excludedDomains: string[];     // Domains to never index
  maxHistoryDays: number;        // How far back to keep (default: 365)
  analyticsEnabled: boolean;     // Track usage analytics
  notificationsEnabled: boolean; // Show notifications
  theme: 'light' | 'dark' | 'auto';
}

export interface ApiConfig {
  model: string;                 // e.g., "gemini-1.5-flash"
  embeddingDimensions: number;   // 768
  maxTokens: number;             // Max content length
  temperature: number;           // For AI responses
}

export const DEFAULT_SETTINGS: UserSettings = {
  apiKey: null,
  mode: 'basic',
  indexingEnabled: true,
  excludedDomains: ['localhost', 'chrome://', 'chrome-extension://'],
  maxHistoryDays: 365,
  analyticsEnabled: true,
  notificationsEnabled: true,
  theme: 'auto',
};
