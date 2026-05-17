import type { DeviceType } from '@netop/shared/types';

export interface BaseDevice {
  id: string;
  type: DeviceType;
  name: string;
}
