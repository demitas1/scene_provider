import { ObjectData } from './data-interface';


export class WebSocketClient {
  private socket: WebSocket;
  private url: string;
  private onMessage: (data: ObjectData[]) => void;
  private reconnectDelay: number = 5000;

  constructor(url: string, onMessage: (data: ObjectData[]) => void) {
    this.url = url;
    this.onMessage = onMessage;
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as ObjectData[];
      this.onMessage(data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.connect(), this.reconnectDelay);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.socket.close();
    };
  }
}

