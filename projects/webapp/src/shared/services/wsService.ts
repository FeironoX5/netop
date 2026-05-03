import {
  ClientMessageType,
  ServerMessageType,
  type ClientMessage,
  type ServerMessage,
} from '@netop/types';
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
  readonly commandPending = ref(false);

  private socket: PartyWebSocket | null = null;
  private outbox: string[] = [];

  connect() {
    if (this.socket) {
      if (
        this.socket.readyState !== WebSocket.CLOSING &&
        this.socket.readyState !== WebSocket.CLOSED
      ) {
        return;
      }

      this.socket = null;
    }

    this.status.value = WsConnectionStatus.Connecting;

    const ws = new PartyWebSocket(this.url, [], {
      connectionTimeout: 4000,
      maxEnqueuedMessages: 100,
    });

    ws.onopen = () => {
      if (this.socket !== ws) return;
      this.connected.value = true;
      this.status.value = WsConnectionStatus.Connected;
      this.flushOutbox();
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
        if (
          message.type === ServerMessageType.CommandResult ||
          message.type === ServerMessageType.Error
        ) {
          this.commandPending.value = false;
        }
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
    this.outbox = [];
    this.connected.value = false;
    this.commandPending.value = false;
    this.status.value = WsConnectionStatus.Disconnected;
  }

  send(message: ClientMessage) {
    this.outbox.push(JSON.stringify(message));
    this.connect();
    this.flushOutbox();
  }

  sendCommand(command: string) {
    this.commandPending.value = true;

    try {
      this.send({ type: ClientMessageType.Command, command, args: [] });
    } catch (error) {
      this.commandPending.value = false;
      throw error;
    }
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

  private flushOutbox() {
    if (this.socket?.readyState !== WebSocket.OPEN) return;

    while (this.outbox.length) {
      const message = this.outbox.shift();
      if (!message) continue;
      this.socket.send(message);
    }
  }
}

export const wsService = new WsService();
