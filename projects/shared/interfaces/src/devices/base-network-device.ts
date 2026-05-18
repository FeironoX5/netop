import type { BaseDevice } from './base-device';

export interface BaseNetworkDevice extends BaseDevice {
  outputs: Map<string, unknown | null>;
}
