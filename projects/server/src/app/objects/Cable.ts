import { Device } from './devices/Device';

export class Cable {
  constructor(
    public from: Device,
    public to: Device,
    public isActive: boolean = true,
  ) {}
}
