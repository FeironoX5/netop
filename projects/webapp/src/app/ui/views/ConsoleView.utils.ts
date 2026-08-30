import type { ActionResponseMessage } from '@netop/types';

export function getEntryText(
  message: ActionResponseMessage,
): string {
  return message.result;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
