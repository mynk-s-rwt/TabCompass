import React from 'react';
import { CheckCircle, Keyboard, BarChart, Compass } from 'lucide-react';

export function Success() {
  const handleClose = () => {
    window.close();
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
      <p className="text-gray-600 mb-8">
        TabCompass is now indexing your tabs
      </p>

      <div className="bg-gray-50 rounded-lg p-8 mb-8 text-left">
        <h3 className="font-semibold text-lg mb-4">Quick Start:</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Keyboard className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Press Cmd+Shift+K (Mac) or Ctrl+Shift+K (Windows)</p>
              <p className="text-sm text-gray-600">Open search anytime</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Compass className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Visit a few pages to build your index</p>
              <p className="text-sm text-gray-600">TabCompass will automatically index new tabs</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BarChart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Check Analytics in Settings</p>
              <p className="text-sm text-gray-600">See where your time goes</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Start Browsing
      </button>
    </div>
  );
}
