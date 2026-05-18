import { Device } from '@simulation/devices/Device';

export class Cable {
  constructor(
    public from: Device,
    public to: Device,
    public isActive: boolean = true,
  ) {}
}
