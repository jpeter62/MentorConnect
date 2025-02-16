import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const URL = 'http://localhost:8080/ws';

class WebSocketService {
  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(URL),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });
  }

  connect = (callback) => {
    this.client.onConnect = () => {
      this.client.subscribe('/topic/messages', (message) => {
        callback(JSON.parse(message.body));  // Call the callback function with the message
      });
    };
    this.client.activate();  // Establish WebSocket connection
  };

  sendMessage = (message) => {
    this.client.publish({ 
      destination: '/app/sendMessage', 
      body: JSON.stringify(message) 
    });
  };

  disconnect = () => {
    this.client.deactivate();  // Disconnect the WebSocket
  };
}

export default new WebSocketService();
