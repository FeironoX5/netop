import {
  ServerMessageType,
  type ServerMessage,
} from '@netop/types';
import { FILTER_ITEMS } from './ConsoleView.consts';

export function getEntryText(msg: ServerMessage): string {
  switch (msg.type) {
    case ServerMessageType.ActionResponse:
      return msg.result;
    case ServerMessageType.Error:
      return msg.message;
    default:
      return 'Empty';
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatMessageType(
  type: ServerMessageType,
): string {
  return type.split('-').join(' ');
}

export function getFilterItemIndex(
  type: ServerMessageType,
): number {
  return FILTER_ITEMS.findIndex(
    (item) => item.name === formatMessageType(type),
  );
}
