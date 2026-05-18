import type { DeviceType } from '@netop/types';

export interface BaseDevice {
  id: string;
  type: DeviceType;
  name: string;
}
