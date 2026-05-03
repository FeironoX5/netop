import { RouterDetails } from '@netop/types';
import { Device, DeviceType } from './Device';

const defaultDetails: RouterDetails = {
  someProperty: '',
};

export class Router extends Device {
  details: RouterDetails;

  constructor(id: string, name?: string) {
    super(id, DeviceType.ROUTER, name);
    this.details = defaultDetails;
  }

  tick(): void {
    console.log(`Router ${this.id} ticked`);
  }
}
