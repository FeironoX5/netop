import {
  PortCategory,
  type Simulation,
} from '@netop/types';
import { Bit } from '@simulation/details/physical/Bit';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { PhysicalPort } from '../ports/PhysicalPort';
import { SimulationEntity } from '../SimulationEntity';

export abstract class PhysicalDevice<
  Details extends object = {},
  Port extends PhysicalPort = PhysicalPort,
  PortArguments extends unknown[] = [],
> extends SimulationEntity<Details> {
  static override ALLOWED_CHILD_CATEGORIES = [
    PortCategory.PHYSICAL,
  ];

  get ports(): Port[] {
    return this.children.map((port) =>
      SimulationRegistry.fromChain<Port>([port], this),
    );
  }

  port(id: string): Port {
    return this.ports.find((port) => port.id === id)!;
  }

  addPort(...args: PortArguments): Port {
    const port = this.buildPort(
      this.generateChildId(),
      ...args,
    );
    this.addChild(port);
    return SimulationRegistry.fromChain<Port>([port], this);
  }

  removePort(portId: string) {
    return this.removeChild(portId);
  }

  send(portId: string, bits: readonly Bit.type[]): void {
    this.port(portId).out.push(...bits);
  }

  sendExcept(
    excludedPortId: string,
    bits: readonly Bit.type[],
  ): void {
    this.ports.forEach((port) => {
      if (port.id !== excludedPortId)
        this.send(port.id, bits);
    });
  }

  protected abstract buildPort(
    id: string,
    ...args: PortArguments
  ): Simulation.Entity;
}
