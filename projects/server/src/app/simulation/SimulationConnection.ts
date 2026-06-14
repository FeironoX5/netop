import { PathSegment, Simulation } from '@netop/types';
import { EventTarget } from '@netop/utils';
import { Bit } from './details/Bit';
import { NetworkDevice } from './entites/devices/NetworkDevice';
import { SimulationEvent } from './events/types';
import { SimulationRegistry } from './SimulationRegistry';

// half-duplex for now
//TODO implement other types of connections
export class SimulationConnection extends EventTarget<SimulationEvent.type> {
  constructor(
    private c: Simulation.Connection,
    private buffer: Bit.type[] = [],
  ) {
    super();
  }

  get id() {
    return this.c.id;
  }

  get left() {
    return this.c.left;
  }

  get right() {
    return this.c.right;
  }

  get direction() {
    return this.c.direction;
  }

  set direction(d: Simulation.Connection['direction']) {
    this.c.direction = d;
  }

  get speed() {
    return this.c.speed;
  }

  get delay() {
    return this.c.delay;
  }

  port(d: { path: PathSegment[]; port: number }) {
    const e = SimulationRegistry.get().resolveFull(
      d.path,
    ) as NetworkDevice;
    return e.ports(d.port);
  }

  get target() {
    return this.direction === 'left'
      ? this.port(this.right)
      : this.port(this.left);
  }

  get source() {
    return this.direction === 'left'
      ? this.port(this.left)
      : this.port(this.right);
  }

  tick() {
    this.buffer.push(...this.source);
    this.source.length = 0;
  }
}
