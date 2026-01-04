import React, { useState } from 'react';
import { Eye, EyeOff, ExternalLink, CheckCircle } from 'lucide-react';
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

    // Basic validation
    const isValidFormat = await validateApiKey(apiKey);
    if (!isValidFormat) {
      setError('Invalid API key format. Key should start with "AIzaSy"');
      return;
    }

    setValidating(true);

    try {
      // Test the API key
      const isValid = await testApiKey(apiKey);

      if (isValid) {
        await saveApiKey(apiKey);
        onComplete();
      } else {
        setError('API key is invalid or has no quota remaining');
      }
    } catch (err) {
      setError('Failed to verify API key. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-3xl font-bold mb-4">Get Your Free Gemini API Key</h2>
      <p className="text-gray-600 mb-8">Takes 2 minutes, free forever</p>

      {/* Step 1 */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">Step 1: Open Google AI Studio</h3>
        <button
          onClick={handleOpenAIStudio}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ExternalLink className="w-5 h-5" />
          Click Here to Open AI Studio
        </button>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">Step 2: Create & Copy Your Key</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Create API Key" button</li>
            <li>Select or create a Google Cloud project</li>
            <li>Copy the generated key (starts with "AIzaSy...")</li>
          </ol>
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">Step 3: Paste It Here</h3>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Your key is stored locally and encrypted. We never see it.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleVerify}
          disabled={!apiKey || validating}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {validating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Verifying...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Verify & Continue
            </span>
          )}
        </button>

        <button
          onClick={onSkip}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
