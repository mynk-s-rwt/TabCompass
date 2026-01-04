import React from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';

function Popup() {
  return (
    <div className="w-[400px] p-4">
      <h1 className="text-xl font-bold text-primary">TabCompass</h1>
      <p className="text-gray-600">AI-Powered Semantic Tab Search</p>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
