import type { DeviceType } from '@netop/types';
import type { BaseDevice } from './base-device';

export interface BaseRouter extends BaseDevice {
  type: DeviceType.ROUTER;
  details: { someProperty: string };
}
