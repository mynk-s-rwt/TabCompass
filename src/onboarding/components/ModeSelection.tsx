import { Sparkles, Zap } from 'lucide-react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'ai' | 'basic') => void;
}

export function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-12">
        Choose Your Experience
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* AI Mode Card */}
        <button
          onClick={() => onSelectMode('ai')}
          className="border-2 border-blue-600 rounded-lg p-8 relative text-left hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Recommended
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-bold">Full AI Mode</h3>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Semantic search by meaning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Smart auto-grouping</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Usage analytics with insights</span>
            </li>
          </ul>

          <p className="text-sm text-gray-600 mb-6">
            Requires: Free Gemini API key (2 min setup)
          </p>

          <div className="w-full bg-blue-600 text-white py-3 rounded-lg text-center font-medium">
            Get Started with AI
          </div>
        </button>

        {/* Basic Mode Card */}
        <button
          onClick={() => onSelectMode('basic')}
          className="border-2 border-gray-300 rounded-lg p-8 text-left hover:shadow-lg hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-gray-600" />
            <h3 className="text-2xl font-bold">Basic Mode</h3>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Keyword search only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Manual grouping</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Basic time tracking</span>
            </li>
          </ul>

          <p className="text-sm text-gray-600 mb-6">
            No setup required
          </p>

          <div className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg text-center font-medium">
            Start with Basic Mode
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            You can upgrade to AI mode later in settings
          </p>
        </button>
      </div>
    </div>
  );
}
