import {
  ClientMessageType,
  type ClientMessage,
  type ServerMessage,
} from '@netop/types';
import { useWebSocket } from '@vueuse/core';
import {
  computed,
  effectScope,
  readonly,
  ref,
  watch,
  type ShallowRef,
} from 'vue';
import { useAppStore } from '../stores/appStore';

export type WsStatus = 'OPEN' | 'CONNECTING' | 'CLOSED';

export type WsMessageHandler = (
  message: ServerMessage,
) => void;

export class WsService {
  private scope = effectScope();

  constructor() {
    this.scope = effectScope();
  }
  private handlers = new Set<WsMessageHandler>();

  private _status = ref<WsStatus>('CLOSED');
  private _outbox = ref<ClientMessage[]>([]);

  private socket: ShallowRef<WebSocket | undefined> | null =
    null;
  private close?: () => void;
  private open?: () => void;

  readonly status = readonly(this._status);
  readonly outbox = readonly(this._outbox);

  connect() {
    if (this.socket) return;

    this.scope.run(() => {
      const { connection } = useAppStore();
      const url = computed(() =>
        connection
          ? `ws://${connection.url}:${connection.port}`
          : undefined,
      );

      const { status, close, open, ws } = useWebSocket(
        url,
        {
          autoReconnect: { retries: Infinity, delay: 1000 },
          onMessage: (_ws, event) => {
            try {
              const message = JSON.parse(
                event.data,
              ) as ServerMessage;
              this.handlers.forEach((handler) =>
                handler(message),
              );
            } catch {
              // ignore malformed messages
            }
          },
        },
      );

      watch(
        status,
        (value) => {
          this._status.value = value;
          if (value === 'OPEN') {
            this.flushOutbox();
          }
        },
        { immediate: true },
      );

      this.socket = ws;
      this.close = close;
      this.open = open;
    });
  }

  disconnect() {
    this.close?.();
    this.socket = null;
    this.close = undefined;
    this.open = undefined;
    this.scope.stop();
    this.scope = effectScope();
  }

  reconnect() {
    this.open?.();
  }

  send(message: ClientMessage) {
    this._outbox.value.push(message);
    this.flushOutbox();
  }

  sendCommand(body: string) {
    this.send({ type: ClientMessageType.Action, body });
  }

  subscribe(handler: WsMessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private flushOutbox() {
    if (
      !this.socket?.value ||
      this.socket.value.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    while (this._outbox.value.length) {
      const message = this._outbox.value.shift();
      if (!message) continue;
      this.socket.value.send(JSON.stringify(message));
    }
  }
}

export const wsService = new WsService();
