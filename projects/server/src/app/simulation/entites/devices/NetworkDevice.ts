import { Bit } from '@simulation/details/Bit';
import { PortBuffer } from '@simulation/details/PortBuffer';
import { SimulationEntity } from '../SimulationEntity';

export type NetworkDeviceDetails = {
  ports: PortBuffer.type[];
};

export class NetworkDevice<
  Details extends NetworkDeviceDetails =
    NetworkDeviceDetails,
> extends SimulationEntity<Details> {
  get ports() {
    return (i: number) => this.details.ports[i]!;
  }

  get portsCount() {
    return this.details.ports.length;
  }

  send(port: number, bits: readonly Bit.type[]): void {
    this.ports(port).out.push(...bits);
  }

  sendExcept(
    excludedPort: number,
    bits: readonly Bit.type[],
  ): void {
    this.details.ports.forEach((_, port) => {
      if (port !== excludedPort) this.send(port, bits);
    });
  }
}
