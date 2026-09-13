import { PathSegment, Simulation } from '@netop/types';
import { EventTarget } from '@netop/utils';
import { Bit } from './details/physical/Bit';
import { PhysicalPort } from './entites/ports/PhysicalPort';
import { SimulationEvent } from './events/types';
import { SimulationRegistry } from './SimulationRegistry';

type TransitChunk = { at: number; bits: Bit.type[] };

type Transit = TransitChunk[];

//TODO implement other types of connections
export class SimulationConnection extends EventTarget<SimulationEvent.type> {
  constructor(
    public c: Simulation.Connection,
    private currentTick: number = 0,
    private l2r: Transit = [],
    private r2l: Transit = [],
  ) {
    super();
  }

  static build(
    left: PathSegment[],
    right: PathSegment[],
    speed: number = 1,
    delay: number = 5,
  ): Simulation.Connection {
    return {
      id: crypto.randomUUID(),
      left,
      right,
      speed,
      delay,
    };
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

  get speed() {
    return this.c.speed;
  }

  get delay() {
    return this.c.delay;
  }

  port(path: PathSegment[]) {
    return SimulationRegistry.get().resolveFull(
      path,
    ) as PhysicalPort;
  }

  transferBits(
    from: PhysicalPort,
    to: PhysicalPort,
    transit: Transit,
  ) {
    const bits = from.out.splice(0, this.speed);
    if (bits.length > 0) {
      transit.push({
        at: this.currentTick + this.delay,
        bits,
      });
    }

    while (transit[0]?.at === this.currentTick) {
      const chunk = transit.shift()!;
      to.in.push(...chunk.bits);
    }
  }

  tick() {
    const left = this.port(this.left);
    const right = this.port(this.right);

    this.transferBits(left, right, this.l2r);
    this.transferBits(right, left, this.r2l);

    this.currentTick += 1;
  }
}
