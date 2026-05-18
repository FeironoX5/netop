import { DeviceType } from '@netop/types';
import { NetworkDevice } from '@simulation/devices/NetworkDevice';

export class Hub extends NetworkDevice {
  constructor({
    id,
    name,
    portsCount,
  }: {
    id: string;
    name: string;
    portsCount: number;
  }) {
    super({ id, type: DeviceType.HUB, name, portsCount });
  }
}
