import { useState } from 'react';
import { validateApiKey, saveApiKey } from '../../utils/storage/settings';
import { testApiKey } from '../../utils/api/gemini';

interface ApiKeySetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function ApiKeySetup({ onComplete, onSkip }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenAIStudio = () => {
    window.open('https://aistudio.google.com/apikey', '_blank');
  };

  const handleVerify = async () => {
    setError(null);

    const isValidFormat = await validateApiKey(apiKey);
    if (!isValidFormat) {
      setError('Invalid API key format. Key should start with "AIzaSy"');
      return;
    }

    setValidating(true);

    try {
      const isValid = await testApiKey(apiKey);

      if (isValid) {
        await saveApiKey(apiKey);
        onComplete();
      } else {
        setError('API key is invalid or has no quota remaining');
      }
    } catch {
      setError('Failed to verify API key. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16">
      <h2 className="text-3xl font-bold mb-3 tracking-tight">Get Your Free Gemini API Key</h2>
      <p className="text-[#98989D] mb-10">Takes 2 minutes, free forever</p>

      {/* Step 1 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-[14px] font-bold">
            1
          </div>
          <h3 className="font-semibold text-[16px]">Open Google AI Studio</h3>
        </div>
        <button
          onClick={handleOpenAIStudio}
          className="
            flex items-center gap-3 px-6 py-3.5 rounded-xl
            bg-[#007AFF] text-white font-medium text-[14px]
            hover:bg-[#0066DD]
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:ring-offset-2 focus:ring-offset-[#1C1C1E]
          "
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Google AI Studio
        </button>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-[14px] font-bold">
            2
          </div>
          <h3 className="font-semibold text-[16px]">Create & Copy Your Key</h3>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-5 border border-white/5">
          <ol className="space-y-3 text-[14px] text-[#98989D]">
            <li className="flex items-start gap-3">
              <span className="text-[#6E6E73]">1.</span>
              Click "Create API Key" button
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6E6E73]">2.</span>
              Select or create a Google Cloud project
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6E6E73]">3.</span>
              Copy the generated key (starts with "AIzaSy...")
            </li>
          </ol>
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-[14px] font-bold">
            3
          </div>
          <h3 className="font-semibold text-[16px]">Paste It Here</h3>
        </div>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className={`
              w-full px-4 py-4 pr-12
              bg-[#2C2C2E] rounded-xl
              text-[14px] text-[#F5F5F7]
              placeholder:text-[#6E6E73]
              border transition-all
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1C1E]
              ${error
                ? 'border-[#FF3B30] focus:ring-[#FF3B30]'
                : 'border-white/10 focus:ring-[#007AFF]'
              }
            `}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#F5F5F7] transition-colors"
            aria-label={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-3 text-[#FF3B30] text-[13px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <p className="text-[12px] text-[#6E6E73] mt-3 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Your key is stored locally and encrypted. We never see it.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleVerify}
          disabled={!apiKey || validating}
          className="
            flex-1 py-4 rounded-xl
            bg-[#007AFF] text-white font-semibold text-[14px]
            hover:bg-[#0066DD]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
            focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:ring-offset-2 focus:ring-offset-[#1C1C1E]
          "
        >
          {validating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              Verifying...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Verify & Continue
            </span>
          )}
        </button>

        <button
          onClick={onSkip}
          className="
            px-6 py-4 rounded-xl
            bg-[#2C2C2E] text-[#98989D] font-medium text-[14px]
            border border-white/10
            hover:bg-[#3A3A3C] hover:text-[#F5F5F7]
            transition-all
            focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#1C1C1E]
          "
        >
          Skip
        </button>
      </div>
    </div>
  );
}
