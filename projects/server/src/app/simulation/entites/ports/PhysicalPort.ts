import { PortCategory } from '@netop/types';
import { PortBuffer } from '@simulation/details/physical/PortBuffer';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import type { PhysicalDevice } from '../devices/PhysicalDevice';
import { SimulationEntity } from '../SimulationEntity';

export type PhysicalPortDetails = PortBuffer.type;

export class PhysicalPort<
  Details extends PhysicalPortDetails = PhysicalPortDetails,
> extends SimulationEntity<Details> {
  static override ALLOWED_CHILD_CATEGORIES = [];

  static {
    SimulationRegistry.setManager(PortCategory.PHYSICAL, {
      build: (id) => ({
        id,
        category: PortCategory.PHYSICAL,
        details: PortBuffer.build(),
      }),
      from: PhysicalPort,
      tick() {},
    });
  }

  get in() {
    return this.details.in;
  }

  get out() {
    return this.details.out;
  }

  remove() {
    return SimulationRegistry.get().removePort(
      this.parent as PhysicalDevice,
      this.id,
    );
  }
}
