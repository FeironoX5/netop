import { Bit } from '@simulation/details/Bit';
import { SimulationEntity } from '../SimulationEntity';

type PortSymbols = Bit.type[];
type Port = { in: PortSymbols; out: PortSymbols };

export class NetworkDevice extends SimulationEntity<{
  ports: Port[];
}> {
  get ports() {
    return (i: number) => {
      const port = this.details.ports[i];
      if (!port) throw new Error(`Port ${i} not found`);
      return port;
    };
  }
}
