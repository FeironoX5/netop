import { DeviceCategory, PortCategory } from '@netop/types';
import { TreeUtils } from '@netop/utils';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { PhysicalDevice } from './PhysicalDevice';

export class Hub extends PhysicalDevice {
  static {
    SimulationRegistry.setManager(DeviceCategory.HUB, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.HUB,
        name,
        children: TreeUtils.buildChildren(4, (portId) =>
          SimulationRegistry.getManager(
            PortCategory.PHYSICAL,
          ).build(portId),
        ),
      }),
      from: Hub,
      tick(e) {
        SimulationRegistry.fromChain<Hub>([e]).repeat();
        SimulationRegistry.behaviours.entity(e);
      },
    });
  }

  protected override buildPort(id: string) {
    return SimulationRegistry.getManager(
      PortCategory.PHYSICAL,
    ).build(id);
  }

  private repeat() {
    const collided =
      this.ports.filter((port) => port.in.length > 0)
        .length > 1;

    SimulationRegistry.behaviours.repeater(this.entity);

    if (collided) {
      SimulationRegistry.get().log(
        'error',
        this.path,
        'Collision caused data loss',
      );
    }
  }
}
