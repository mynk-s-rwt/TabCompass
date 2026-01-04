import React from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';

function Options() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-4">TabCompass Settings</h1>
        <p className="text-gray-600">Configure your TabCompass experience.</p>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
