import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { SimulationEntity } from '@entites/SimulationEntity';
import { Simulation } from '@netop/types';
import { StringUtils } from '@netop/utils';
import { SimulationRegistry } from '@simulation/SimulationRegistry';

export const SimulationEntityWrapper = <
  T extends SimulationEntity,
>(): EntityWrapper<T> => ({
  info: 'Base entity commands',
  commands: new Map([
    [
      'ls',
      {
        info: 'List all child entities',
        fn: (entity) => {
          const children = entity.children;
          if (children.length === 0) return 'No children';
          return `Children:\n${StringUtils.buildList(
            children.map((c) => `${c.id} (${c.category})`),
          )}`;
        },
      },
    ],
    [
      'new',
      {
        info: 'Add a new child entity',
        args: ['category', 'name?'],
        fn: (entity, category: string, name?: string) => {
          const entry = SimulationRegistry.getManager(
            category as Simulation.Category,
          );
          const child = entry.build(
            entity.generateChildId(),
            ...(name ? [name] : []),
          );
          entity.addChild(child);
          return `Added:\n${StringUtils.buildList([
            `${child.id} (${child.category})`,
          ])}`;
        },
      },
    ],
    [
      'rm',
      {
        info: 'Remove a child entity by id',
        args: ['id'],
        fn: (entity, id: string) => {
          const removed = entity.removeChild(id);
          return `Removed:\n${StringUtils.buildList([
            `${removed.id} (${removed.category})`,
          ])}`;
        },
      },
    ],
    [
      'info',
      {
        info: 'Show entity info',
        fn: (entity) => entity.toString(),
      },
    ],
  ]),
});
