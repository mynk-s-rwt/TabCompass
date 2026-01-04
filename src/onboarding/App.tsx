import React, { useState } from 'react';
import { Welcome } from './components/Welcome';
import { ModeSelection } from './components/ModeSelection';
import { ApiKeySetup } from './components/ApiKeySetup';
import { Success } from './components/Success';
import { saveSettings } from '../utils/storage/settings';

type OnboardingStep = 'welcome' | 'mode' | 'apiKey' | 'success';

export function App() {
  const [step, setStep] = useState<OnboardingStep>('welcome');

  const handleSelectMode = async (mode: 'ai' | 'basic') => {
    await saveSettings({ mode });

    if (mode === 'ai') {
      setStep('apiKey');
    } else {
      setStep('success');
    }
  };

  const handleApiKeyComplete = () => {
    setStep('success');
  };

  const handleSkipApiKey = async () => {
    await saveSettings({ mode: 'basic' });
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4">
        {step === 'welcome' && <Welcome onNext={() => setStep('mode')} />}
        {step === 'mode' && <ModeSelection onSelectMode={handleSelectMode} />}
        {step === 'apiKey' && (
          <ApiKeySetup
            onComplete={handleApiKeyComplete}
            onSkip={handleSkipApiKey}
          />
        )}
        {step === 'success' && <Success />}
      </div>
    </div>
  );
}
