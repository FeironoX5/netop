import type { BaseRouter } from '@netop/shared/interfaces';
import { DeviceType } from '@netop/shared/types';
import { Device } from './Device';

export class Router extends Device implements BaseRouter {
  details: BaseRouter['details'];

  constructor(id: string, name?: string) {
    super(id, DeviceType.ROUTER, name);
    this.details = { someProperty: '' };
  }

  tick(): void {
    console.log(`Router ${this.id} ticked`);
  }
}
