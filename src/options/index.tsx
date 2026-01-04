import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { getSettings, getApiKey, saveSettings, saveApiKey, validateApiKey } from '../utils/storage/settings';
import { testApiKey } from '../utils/api/gemini';

type Mode = 'ai' | 'basic';

function Options() {
  const [mode, setMode] = useState<Mode>('basic');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getSettings();
      const key = await getApiKey();
      setMode(settings.mode);
      setApiKey(key || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = async (newMode: Mode) => {
    if (newMode === 'ai' && !apiKey) {
      setMessage({ type: 'error', text: 'Please add an API key first to enable AI mode' });
      return;
    }

    setMode(newMode);
    await saveSettings({ mode: newMode });
    setMessage({ type: 'success', text: `Switched to ${newMode === 'ai' ? 'AI' : 'Basic'} mode` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter an API key' });
      return;
    }

    const isValidFormat = await validateApiKey(apiKey);
    if (!isValidFormat) {
      setMessage({ type: 'error', text: 'Invalid API key format. Key should start with "AIzaSy"' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const isValid = await testApiKey(apiKey);
      if (isValid) {
        await saveApiKey(apiKey);
        await saveSettings({ mode: 'ai' });
        setMode('ai');
        setMessage({ type: 'success', text: 'API key verified and saved! AI mode enabled.' });
      } else {
        setMessage({ type: 'error', text: 'API key is invalid or has no quota remaining' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to verify API key. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveApiKey = async () => {
    setApiKey('');
    await saveApiKey('');
    await saveSettings({ mode: 'basic' });
    setMode('basic');
    setMessage({ type: 'success', text: 'API key removed. Switched to Basic mode.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleOpenAIStudio = () => {
    window.open('https://aistudio.google.com/apikey', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-[#F5F5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-[#007AFF]/20"></div>
            <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-transparent border-t-[#007AFF] animate-spin"></div>
          </div>
          <p className="text-[13px] text-[#6E6E73]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-[#F5F5F7]">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-[#1C1C1E]/90 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#AF52DE] flex items-center justify-center shadow-lg shadow-[#007AFF]/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
              <p className="text-[13px] text-[#98989D]">Configure TabCompass</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Message Toast */}
        {message && (
          <div className={`
            p-4 rounded-xl border flex items-center gap-3
            ${message.type === 'success'
              ? 'bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]'
              : 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]'
            }
          `}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {message.type === 'success' ? (
                <>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </>
              )}
            </svg>
            <span className="text-[14px]">{message.text}</span>
          </div>
        )}

        {/* Search Mode */}
        <div className="bg-[#2C2C2E] rounded-2xl p-6 border border-white/5">
          <h2 className="text-[16px] font-semibold mb-2">Search Mode</h2>
          <p className="text-[13px] text-[#6E6E73] mb-5">Choose how TabCompass searches your tabs</p>

          <div className="grid grid-cols-2 gap-4">
            {/* AI Mode */}
            <button
              onClick={() => handleModeChange('ai')}
              disabled={!apiKey}
              className={`
                p-4 rounded-xl text-left transition-all
                ${mode === 'ai'
                  ? 'bg-[#007AFF]/15 border-2 border-[#007AFF]'
                  : 'bg-[#3A3A3C]/50 border-2 border-transparent hover:bg-[#3A3A3C]'
                }
                ${!apiKey ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mode === 'ai' ? 'bg-[#007AFF]' : 'bg-[#3A3A3C]'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                  </svg>
                </div>
                <span className="font-semibold text-[14px]">AI Search</span>
              </div>
              <p className="text-[12px] text-[#6E6E73]">Semantic search by meaning</p>
            </button>

            {/* Basic Mode */}
            <button
              onClick={() => handleModeChange('basic')}
              className={`
                p-4 rounded-xl text-left transition-all
                ${mode === 'basic'
                  ? 'bg-[#007AFF]/15 border-2 border-[#007AFF]'
                  : 'bg-[#3A3A3C]/50 border-2 border-transparent hover:bg-[#3A3A3C]'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mode === 'basic' ? 'bg-[#007AFF]' : 'bg-[#3A3A3C]'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <span className="font-semibold text-[14px]">Basic Search</span>
              </div>
              <p className="text-[12px] text-[#6E6E73]">Keyword matching only</p>
            </button>
          </div>
        </div>

        {/* API Key Section */}
        <div className="bg-[#2C2C2E] rounded-2xl p-6 border border-white/5">
          <h2 className="text-[16px] font-semibold mb-2">Gemini API Key</h2>
          <p className="text-[13px] text-[#6E6E73] mb-5">Required for AI-powered semantic search</p>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="
                  w-full px-4 py-3.5 pr-24
                  bg-[#3A3A3C] rounded-xl
                  text-[14px] text-[#F5F5F7]
                  placeholder:text-[#6E6E73]
                  outline outline-1 outline-white/10
                  focus:outline-2 focus:outline-[#007AFF]/60
                  transition-all
                "
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-md text-[#6E6E73] hover:text-[#F5F5F7] hover:bg-white/10 transition-colors"
                >
                  {showKey ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveApiKey}
                disabled={isSaving || !apiKey.trim()}
                className="
                  flex-1 py-3 rounded-xl
                  bg-[#007AFF] text-white font-medium text-[14px]
                  hover:bg-[#0066DD]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all
                "
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"/>
                    Verifying...
                  </span>
                ) : (
                  'Save & Verify'
                )}
              </button>

              {apiKey && (
                <button
                  onClick={handleRemoveApiKey}
                  className="
                    px-5 py-3 rounded-xl
                    bg-[#FF3B30]/10 text-[#FF3B30] font-medium text-[14px]
                    hover:bg-[#FF3B30]/20
                    transition-all
                  "
                >
                  Remove
                </button>
              )}
            </div>

            <button
              onClick={handleOpenAIStudio}
              className="
                w-full py-3 rounded-xl
                bg-[#3A3A3C] text-[#F5F5F7] font-medium text-[14px]
                hover:bg-[#4A4A4C]
                transition-all
                flex items-center justify-center gap-2
              "
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Get Free API Key from Google AI Studio
            </button>

            <p className="text-[12px] text-[#6E6E73] flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Your key is stored locally and encrypted
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-[#2C2C2E] rounded-2xl p-6 border border-white/5">
          <h2 className="text-[16px] font-semibold mb-2">About</h2>
          <div className="space-y-3 text-[13px] text-[#98989D]">
            <p>TabCompass v1.0.0</p>
            <p>AI-powered semantic tab search for Chrome</p>
            <div className="pt-2 border-t border-white/5">
              <p className="text-[12px] text-[#6E6E73]">
                Keyboard shortcut: {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+K
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/5">
        <p className="text-[12px] text-[#6E6E73]">TabCompass Settings</p>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
