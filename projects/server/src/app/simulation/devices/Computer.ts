import { DeviceType } from '@netop/types';
import {
  Device,
  DeviceInit,
} from '@simulation/devices/Device';
import { NetworkCard } from '@simulation/devices/NetworkCard';

export class Computer extends Device {
  readonly allowedChildrenTypes = [NetworkCard];

  children: NetworkCard[] = [];

  constructor({ id, name }: DeviceInit) {
    super({ id, type: DeviceType.COMPUTER, name });
  }

  linkInterface(networkCard: NetworkCard) {
    this.children.push(networkCard);
  }
}
