import { PathSegment, Simulation } from '@netop/types';
import { EventTarget } from '@netop/utils';
import { Bit } from './details/Bit';
import { PortBuffer } from './details/PortBuffer';
import { NetworkDevice } from './entites/devices/NetworkDevice';
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
    leftFullPath: PathSegment[],
    leftPort: number,
    rightFullPath: PathSegment[],
    rightPort: number,
    speed: number = 1,
    delay: number = 5,
  ): Simulation.Connection {
    return {
      id: crypto.randomUUID(),
      left: { path: leftFullPath, port: leftPort },
      right: { path: rightFullPath, port: rightPort },
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

  port(d: { path: PathSegment[]; port: number }) {
    const e = SimulationRegistry.get().resolveFull(
      d.path,
    ) as NetworkDevice;
    return e.ports(d.port);
  }

  transferBits(
    from: PortBuffer.type,
    to: PortBuffer.type,
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
