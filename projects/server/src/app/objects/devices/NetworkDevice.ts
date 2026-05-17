import type { BaseNetworkDevice } from '@netop/shared/interfaces';
import { DeviceType } from '@netop/shared/types';
import { Cable } from '../Cable';
import { Device } from './Device';

export class NetworkDevice
  extends Device
  implements BaseNetworkDevice
{
  outputs: Map<string, Cable | null>;

  constructor(id: string, type: DeviceType, name?: string) {
    super(id, type, name);
    this.outputs = new Map<string, Cable | null>();
  }
}
