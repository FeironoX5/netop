import { CableCategory, Simulation } from '@netop/types';
import { SimulationRegistry } from '@simulation/SimulationRegistry';
import { SimulationEntity } from './SimulationEntity';

interface Transit {
  symbol: 0 | 1;
  sentAt: number;
}

// full-duplex
export class Cable extends SimulationEntity<{
  delay: number;
  currentTick: number;
  l2r: Transit[];
  r2l: Transit[];
  leftInput?: 0 | 1;
  rightInput?: 0 | 1;
  leftOutput?: 0 | 1;
  rightOutput?: 0 | 1;
}> {
  static {
    SimulationRegistry.setManager(CableCategory, {
      build(id) {
        return {
          id,
          category: CableCategory,
          details: {
            delay: 1,
            currentTick: 0,
            l2r: [],
            r2l: [],
          },
        };
      },
      from: Cable,
      tick(e) {
        const cable = new this.from(e);
        const d = cable.details;

        d.currentTick += 1;

        d.leftOutput = undefined;
        d.rightOutput = undefined;

        if (d.leftInput !== undefined) {
          d.l2r.push({
            symbol: d.leftInput,
            sentAt: d.currentTick,
          });
          d.leftInput = undefined;
        }

        if (d.rightInput !== undefined) {
          d.r2l.push({
            symbol: d.rightInput,
            sentAt: d.currentTick,
          });
          d.rightInput = undefined;
        }

        const rightHead = d.l2r[0];
        if (
          rightHead &&
          d.currentTick - rightHead.sentAt >= d.delay
        ) {
          d.rightOutput = rightHead.symbol;
          d.l2r.shift();
        }

        const leftHead = d.r2l[0];
        if (
          leftHead &&
          d.currentTick - leftHead.sentAt >= d.delay
        ) {
          d.leftOutput = leftHead.symbol;
          d.r2l.shift();
        }
      },
    });
  }

  constructor(e: Simulation.Entity, p?: Simulation.Entity) {
    super(e, p);
    if (typeof this.details.delay !== 'number') {
      throw new Error('Cable must have delay');
    }
    if (typeof this.details.currentTick !== 'number') {
      throw new Error('Cable must have currentTick');
    }
    if (!Array.isArray(this.details.l2r)) {
      throw new Error('Cable must have l2r');
    }
    if (!Array.isArray(this.details.r2l)) {
      throw new Error('Cable must have r2l');
    }
  }

  get delay() {
    return this.details.delay;
  }

  get currentTick() {
    return this.details.currentTick;
  }

  get leftOutput() {
    return this.details.leftOutput;
  }

  get rightOutput() {
    return this.details.rightOutput;
  }

  inputLeft(symbol: 0 | 1) {
    this.details.leftInput = symbol;
  }

  inputRight(symbol: 0 | 1) {
    this.details.rightInput = symbol;
  }
}
