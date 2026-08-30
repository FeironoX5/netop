import {
  BROADCAST_SERVER_MESSAGE_TYPES,
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
import { useWsStore } from '../stores/wsStore';

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
  private inFlight: ClientMessage | null = null;
  private inFlightSent = false;

  private socket: ShallowRef<WebSocket | undefined> | null =
    null;
  private close?: () => void;
  private open?: () => void;

  readonly status = readonly(this._status);

  connect() {
    if (this.socket) return;

    this.scope.run(() => {
      const appStore = useAppStore();
      const wsStore = useWsStore();
      const url = computed(() =>
        appStore.connection
          ? `ws://${appStore.connection.url}:${appStore.connection.port}`
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

              const isBroadcast =
                BROADCAST_SERVER_MESSAGE_TYPES.has(
                  message.type,
                );
              try {
                this.handlers.forEach((handler) =>
                  handler(message),
                );
              } finally {
                if (!isBroadcast) {
                  this.completeInFlight();
                }
              }
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
            this.flushQueue();
          } else {
            this.inFlightSent = false;
          }
        },
        { immediate: true },
      );

      this.socket = ws;
      this.close = close;
      this.open = open;

      watch(
        () => wsStore.queue.length,
        () => this.flushQueue(),
      );

      this.flushQueue();
    });
  }

  disconnect() {
    this.close?.();
    this.socket = null;
    this.close = undefined;
    this.open = undefined;
    this.inFlightSent = false;
    this.scope.stop();
    this.scope = effectScope();
  }

  reconnect() {
    this.open?.();
  }

  subscribe(handler: WsMessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private flushQueue() {
    if (
      !this.socket?.value ||
      this.socket.value.readyState !== WebSocket.OPEN ||
      this.inFlightSent
    ) {
      return;
    }

    const wsStore = useWsStore();
    const message = this.inFlight ?? wsStore.queue[0];
    if (!message) return;

    this.inFlight = message;
    try {
      this.socket.value.send(JSON.stringify(message));
    } catch {
      this.inFlight = null;
      return;
    }

    this.inFlightSent = true;
    if (wsStore.queue[0] === message) {
      wsStore.removeHead();
    }
  }

  private completeInFlight() {
    if (!this.inFlight) return;

    this.inFlight = null;
    this.inFlightSent = false;
    this.flushQueue();
  }
}

export const wsService = new WsService();
