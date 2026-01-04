import { Compass } from 'lucide-react';

interface WelcomeProps {
  onNext: () => void;
}

export function Welcome({ onNext }: WelcomeProps) {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="flex justify-center mb-6">
        <Compass className="w-20 h-20 text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to TabCompass!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Navigate your browsing history with AI-powered semantic search
      </p>

      <div className="bg-gray-100 rounded-lg p-8 mb-8">
        <p className="text-gray-700 mb-4 font-medium">
          TabCompass helps you:
        </p>
        <ul className="text-left space-y-3 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Find tabs by content, not just title</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Search tabs from weeks or months ago</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Track your browsing productivity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>100% private - all data stays local</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onNext}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Get Started
      </button>
    </div>
  );
}
