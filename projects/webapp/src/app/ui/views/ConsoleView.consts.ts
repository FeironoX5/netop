import { ServerMessageType } from '@netop/types';
import { formatMessageType } from './ConsoleView.utils';

export const FILTER_ITEMS = Object.values(
  ServerMessageType,
).map((t) => ({ name: formatMessageType(t) }));
