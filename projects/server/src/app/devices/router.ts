import { RouterDetails } from '@netop/types';
import { Device } from './device';

const defaultDetails: RouterDetails = {
  someProperty: '',
};

export class Router extends Device {
  details: RouterDetails;

  constructor(id: string) {
    super();
    this.id = id;
    this.type = 'router';
    this.details = defaultDetails;
  }

  tick(): void {
    console.log(`Router ${this.id} ticked`);
  }
}
