import { useState } from 'react';
import WeatherlineUI from './components/WeatherlineUI';
import PocketFolioUI from './components/PocketFolioUI';
import MoodTraceUI from './components/MoodTraceUI';

function App() {
  const [selectedUI, setSelectedUI] = useState<string>('weatherline');

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ padding: '20px', background: '#f0f0f0', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
        <h2>Daily Reflection App Concepts</h2>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
          <button onClick={() => setSelectedUI('weatherline')} style={{ padding: '8px 16px', fontWeight: selectedUI === 'weatherline' ? 'bold' : 'normal' }}>Weatherline</button>
          <button onClick={() => setSelectedUI('pocketfolio')} style={{ padding: '8px 16px', fontWeight: selectedUI === 'pocketfolio' ? 'bold' : 'normal' }}>Pocket Folio</button>
          <button onClick={() => setSelectedUI('moodtrace')} style={{ padding: '8px 16px', fontWeight: selectedUI === 'moodtrace' ? 'bold' : 'normal' }}>Mood Trace</button>
        </div>
      </div>
      
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        {selectedUI === 'weatherline' && <WeatherlineUI />}
        {selectedUI === 'pocketfolio' && <PocketFolioUI />}
        {selectedUI === 'moodtrace' && <MoodTraceUI />}
      </div>
    </div>
  );
}

export default App;
