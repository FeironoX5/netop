import { PathSegment, Simulation } from '@netop/types';
import { EventTarget } from '@netop/utils';
import { Bit } from './details/Bit';
import { NetworkDevice } from './entites/devices/NetworkDevice';
import { SimulationEvent } from './events/types';
import { SimulationRegistry } from './SimulationRegistry';

type Timestamp = { at: number; n: number };
type Transit = {
  buffer: Bit.type[];
  timestamps: Timestamp[];
};

//TODO implement other types of connections
export class SimulationConnection extends EventTarget<SimulationEvent.type> {
  constructor(
    public c: Simulation.Connection,
    private currentTick: number = 0,
    private l2r: Transit = { buffer: [], timestamps: [] },
    private r2l: Transit = { buffer: [], timestamps: [] },
  ) {
    super();
  }

  static build(
    leftFullPath: PathSegment[],
    leftPort: number,
    rightFullPath: PathSegment[],
    rightPort: number,
    speed: number = 1,
    delay: number = 0,
  ): SimulationConnection {
    return new SimulationConnection({
      id: crypto.randomUUID(),
      left: { path: leftFullPath, port: leftPort },
      right: { path: rightFullPath, port: rightPort },
      speed,
      delay,
    });
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

  passSymbols(
    from: ReturnType<typeof this.port>,
    to: ReturnType<typeof this.port>,
    transit: Transit,
  ) {
    if (
      transit.timestamps.length > 0 &&
      transit.timestamps[0].at === this.currentTick
    ) {
      const ts = transit.timestamps.shift()!;
      to.in.push(...transit.buffer.splice(0, ts.n));
    }

    const readSymbols = from.in.splice(0, this.speed);
    if (readSymbols.length === 0) return;
    transit.buffer.push(...readSymbols);
    transit.timestamps.push({
      at: this.currentTick,
      n: readSymbols.length,
    });
  }

  tick() {
    const left = this.port(this.left);
    const right = this.port(this.right);

    this.passSymbols(left, right, this.l2r);
    this.passSymbols(right, left, this.r2l);

    this.currentTick =
      (this.currentTick + 1) % this.c.delay;
  }
}
