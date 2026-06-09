import { Simulation } from '@netop/types';
import { ActionCodec, treeWalker } from '@netop/utils';

export const simulationTreeWalker: treeWalker<Simulation.Entity> =
  {
    match: (s, e) => s === e.id || s === e.name,
    extract: (e) => e.id,
    join: (p) => ActionCodec.join(p),
    children: (e) => e.children ?? [],
  };
