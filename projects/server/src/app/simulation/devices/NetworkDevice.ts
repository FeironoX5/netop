import { Cable } from '@simulation/Cable';
import { IpAddress } from '@simulation/details/IpAddress';
import { MacAddress } from '@simulation/details/MacAddress';
import { Device, DeviceInit } from '@simulation/devices/Device';

export interface NetworkDeviceInit extends DeviceInit {
  portsCount: number;
}

export abstract class NetworkDevice extends Device {
  macAddress: MacAddress.type;
  ipAddress: IpAddress.type;
  ports: (Cable | null)[];

  constructor({ id, type, name, portsCount }: NetworkDeviceInit) {
    if (new.target === NetworkDevice) {
      throw new Error('NetworkDevice is abstract');
    }
    super({ id, type, name });
    this.macAddress = MacAddress.generate();
    this.ipAddress = IpAddress.generate();
    this.ports = Array.from({ length: portsCount }, () => null);
  }
}
