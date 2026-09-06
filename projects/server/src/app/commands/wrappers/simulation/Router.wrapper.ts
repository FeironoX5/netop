import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { Router } from '@entites/devices/Router';
import { NetworkDeviceWrapper } from './NetworkDevice.wrapper';

export const RouterWrapper: EntityWrapper<Router> =
  NetworkDeviceWrapper<Router>();
