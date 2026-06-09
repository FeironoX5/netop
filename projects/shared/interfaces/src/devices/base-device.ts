import type { DeviceCategory } from '@netop/types';

export interface BaseDevice {
  id: string;
  type: DeviceCategory;
  name: string;
}
