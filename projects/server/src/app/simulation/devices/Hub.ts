import { NetworkDevice } from '@simulation/devices/NetworkDevice';
import { DeviceType } from '@simulation/types/Device.types';

export class Hub extends NetworkDevice {
  constructor({ id, name, portsCount }: { id: string; name: string; portsCount: number }) {
    super({ id, type: DeviceType.HUB, name, portsCount });
  }
}
