import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { PianoScaleFinder } from './features/PianoScaleFinder';
import { MicScaleFinder } from './features/MicScaleFinder';
import { usePwa } from './hooks/usePwa';

const FEATURES = [
  {
    id: 'piano-scale-finder',
    title: 'Find Scale by Piano',
    role: 'Interactive Piano',
    icon: '🎹',
    description:
      'Play any 7 notes in any order using the on-screen piano, keyboard shortcuts, or MIDI controller to discover the most beginner-friendly scale.',
    cta: 'Open Piano Finder'
  },
  {
    id: 'mic-scale-finder',
    title: 'Find Scale by Mic',
    role: 'Live Audio Listen',
    icon: '🎙️',
    description:
      'Play an instrument, hum, or sing 7 notes in any order into your microphone to capture pitches live and identify the matching scale.',
    cta: 'Open Mic Finder'
  }
];

export default function App() {
  const [activeFeatureId, setActiveFeatureId] = useState(null);
  const pwa = usePwa();

  return (
    <div className="app-shell">
      {activeFeatureId === 'piano-scale-finder' && (
        <PianoScaleFinder onBackHome={() => setActiveFeatureId(null)} />
      )}
      {activeFeatureId === 'mic-scale-finder' && (
        <MicScaleFinder onBackHome={() => setActiveFeatureId(null)} />
      )}
      {activeFeatureId === null && (
        <HomeScreen features={FEATURES} onOpenFeature={setActiveFeatureId} pwa={pwa} />
      )}
    </div>
  );
}
