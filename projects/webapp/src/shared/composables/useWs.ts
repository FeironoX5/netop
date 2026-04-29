import type { ClientMessage, ServerMessage } from '@netop/types';
import { ref } from 'vue';

const WS_URL = 'ws://localhost:3001';

export type LogEntry = {
  id: number;
  timestamp: Date;
  message: ServerMessage;
};

let _counter = 0;

const socket = ref<WebSocket | null>(null);
const log = ref<LogEntry[]>([]);
const connected = ref(false);

function connect() {
  if (socket.value) return;

  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    connected.value = true;
  };

  ws.onclose = () => {
    connected.value = false;
    socket.value = null;
  };

  ws.onmessage = (event: MessageEvent<string>) => {
    try {
      const message = JSON.parse(event.data) as ServerMessage;
      log.value.push({ id: _counter++, timestamp: new Date(), message });
    } catch {
      // ignore malformed messages
    }
  };

  socket.value = ws;
}

function send(message: ClientMessage) {
  socket.value?.send(JSON.stringify(message));
}

function sendCommand(command: string) {
  send({ type: 'command', command, args: [] });
}

export function useWs() {
  return { connect, send, sendCommand, log, connected };
}
