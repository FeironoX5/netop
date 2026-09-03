import { DeviceCategory } from '@netop/types';
import { NetworkInterface } from '@simulation/details/NetworkInterface';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from '../SimulationEntity';
import type { NetworkCard } from './NetworkCard';

export type ComputerDetails = {
  networkInterface: NetworkInterface.type;
};

export class Computer extends SimulationEntity<ComputerDetails> {
  static override ALLOWED_CHILD_CATEGORIES = [
    DeviceCategory.NETWORK_CARD,
  ];

  static {
    SimulationRegistry.setManager(DeviceCategory.COMPUTER, {
      build: (id, name) => ({
        id,
        category: DeviceCategory.COMPUTER,
        name,
        details: {
          networkInterface: NetworkInterface.build(),
        },
      }),
      from: Computer,
      tick(e) {
        SimulationRegistry.behaviours.networkInterfaceOutput(
          e,
        );
        SimulationRegistry.behaviours.entity(e);
        SimulationRegistry.behaviours.networkInterfaceInput(
          e,
        );
      },
    });
  }

  get networkInterface() {
    return this.details.networkInterface;
  }

  get networkCard() {
    const networkCard = this.children[0]!;
    return SimulationRegistry.fromChain<NetworkCard>([
      this.entity,
      networkCard,
    ]);
  }

  sendPacket({
    destinationMacAddress,
    packet,
  }: NetworkInterface.ResolvedPacket) {
    this.networkInterface.outgoingPackets.push({
      destinationMacAddress,
      packet,
    });
  }

  receivePackets() {
    return this.networkInterface.receivedPackets.splice(0);
  }
}
