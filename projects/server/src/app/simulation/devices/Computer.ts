import { Device } from '@simulation/devices/Device';
import { NetworkCard } from '@simulation/devices/NetworkCard';
import { DeviceType } from '@simulation/types/Device.types';
import { SimulationEntity } from '../interfaces/SimulationEntity';

export class Computer
  extends Device
  implements SimulationEntity
{
  readonly allowedChildrenTypes = [NetworkCard];

  children: NetworkCard[] = [];

  constructor({
    id,
    name,
    interfaces,
  }: {
    id: string;
    name: string;
    interfaces: NetworkCard[];
  }) {
    super({ id, type: DeviceType.COMPUTER, name });
    this.children = interfaces;
  }

  linkInterface(networkCard: NetworkCard) {
    this.children.push(networkCard);
  }
}
