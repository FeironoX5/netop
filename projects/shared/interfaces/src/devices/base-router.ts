import type { DeviceCategory } from '@netop/types';
import type { BaseDevice } from './base-device';

export interface BaseRouter extends BaseDevice {
  type: DeviceCategory.ROUTER;
  details: { someProperty: string };
}
