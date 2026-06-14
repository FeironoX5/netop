import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { ActionCodec } from '@netop/utils';
import { NetworkDevice } from '@/app/simulation/entites/devices/NetworkDevice';
import { SimulationConnection } from '@/app/simulation/SimulationConnection';
import { SimulationRegistry } from '@/app/simulation/SimulationRegistry';

export const NetworkDeviceWrapper: EntityWrapper<NetworkDevice> =
  {
    info: 'Used to manage a network device',
    commands: new Map([
      [
        'link',
        {
          info: 'Links two network devices together',
          args: ['port', 'targetPath', 'targetPort'],
          fn: (
            entity,
            port: string,
            targetPath: string,
            targetPort: string,
          ) => {
            const target = SimulationRegistry.get().resolve(
              ActionCodec.split(targetPath),
            );
            if (!target) return 'Target not found';
            SimulationRegistry.get().addConnection(
              SimulationConnection.build(
                entity.path,
                Number(port),
                target.entity.path,
                Number(targetPort),
              ),
            );
            return `Linked ${entity.id} to ${target.entity.id}`;
          },
        },
      ],
    ]),
  };
