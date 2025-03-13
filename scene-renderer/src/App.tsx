import React, { useEffect, useState } from 'react';
import { ThreeJSApp } from './scene1';
import { WebSocketClient } from './websocket-client';
import './App.css';

const App: React.FC = () => {
  const [appInstance, setAppInstance] = useState<ThreeJSApp | null>(null);
  const [buttonClicks, setButtonClicks] = useState(0);

  useEffect(() => {
    // Initialize ThreeJS app
    const app = new ThreeJSApp();
    setAppInstance(app);

    // Initialize WebSocket client
    const wsClient = new WebSocketClient('ws://localhost:8765', (data) => app.updateObjects(data));

    // Cleanup on unmount
    return () => {
      // Add any cleanup if needed
    };
  }, []);

  const handleButtonClick = () => {
    setButtonClicks(prev => prev + 1);
    console.log('Button clicked!');
  };

  return (
    <div className="app-container">
      <div className="scene-container" id="scene-container">
        {/* ThreeJS will render here */}
      </div>
      <div className="controls-panel">
        <button 
          className="control-button" 
          onClick={handleButtonClick}
        >
          Click Me ({buttonClicks})
        </button>
      </div>
    </div>
  );
};

export default App;