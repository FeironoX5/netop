import { Bit } from '@simulation/details/physical/Bit';
import { PortBuffer } from '@simulation/details/physical/PortBuffer';
import { SimulationEntity } from '../SimulationEntity';

export type PhysicalDeviceDetails = {
  ports: PortBuffer.type[];
};

export class PhysicalDevice<
  Details extends PhysicalDeviceDetails =
    PhysicalDeviceDetails,
> extends SimulationEntity<Details> {
  get ports(): (i: number) => Details['ports'][number] {
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
