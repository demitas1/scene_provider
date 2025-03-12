import * as THREE from 'three';
import { ThreeJSApp } from './scene1';
import { WebSocketClient } from './websocket-client';
import { ObjectData } from './data-interface';


// Main application
const app = new ThreeJSApp();
const wsClient = new WebSocketClient('ws://localhost:8765', (data) => app.updateObjects(data));

// Add some basic styling
const style = document.createElement('style');
style.textContent = `
  body { margin: 0; overflow: auto; }
`;
document.head.appendChild(style);