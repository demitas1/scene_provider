import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Add some basic styling
const style = document.createElement('style');
style.textContent = `
  body { 
    margin: 0; 
    padding: 0; 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, 
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
  }
`;
document.head.appendChild(style);

// Create React root and render App
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}