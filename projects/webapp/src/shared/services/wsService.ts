import { ClientMessageType, type ClientMessage, type ServerMessage } from '@netop/types';
import { WebSocket as PartyWebSocket } from 'partysocket';
import { ref } from 'vue';

const WS_HOST = 'localhost';
const DEFAULT_WS_PORT = 3001;

export enum WsConnectionStatus {
  Connected = 'connected',
  Connecting = 'connecting',
  Disconnected = 'disconnected',
}

export type LogEntry = {
  id: number;
  timestamp: Date;
  message: ServerMessage;
};

let counter = 0;

class WsService {
  readonly log = ref<LogEntry[]>([]);
  readonly connected = ref(false);
  readonly port = ref(DEFAULT_WS_PORT);
  readonly status = ref(WsConnectionStatus.Disconnected);

  private socket: PartyWebSocket | null = null;

  connect() {
    if (this.socket) return;

    this.status.value = WsConnectionStatus.Connecting;

    const ws = new PartyWebSocket(this.url, [], {
      connectionTimeout: 4000,
      maxEnqueuedMessages: 100,
    });

    ws.onopen = () => {
      if (this.socket !== ws) return;
      this.connected.value = true;
      this.status.value = WsConnectionStatus.Connected;
    };

    ws.onclose = () => {
      if (this.socket !== ws) return;
      this.connected.value = false;
      this.status.value = WsConnectionStatus.Connecting;
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data) as ServerMessage;
        this.log.value.push({ id: counter++, timestamp: new Date(), message });
      } catch {
        // ignore malformed messages
      }
    };

    this.socket = ws;
  }

  connectToPort(port: number) {
    this.port.value = port;
    this.recreateSocket();
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.connected.value = false;
    this.status.value = WsConnectionStatus.Disconnected;
  }

  send(message: ClientMessage) {
    this.connect();
    this.socket?.send(JSON.stringify(message));
  }

  sendCommand(command: string) {
    this.send({ type: ClientMessageType.Command, command, args: [] });
  }

  get url() {
    return `ws://${WS_HOST}:${this.port.value}`;
  }

  get label() {
    return `${WS_HOST}:${this.port.value}`;
  }

  private recreateSocket() {
    this.socket?.close();
    this.socket = null;
    this.connected.value = false;
    this.connect();
  }
}

export const wsService = new WsService();
