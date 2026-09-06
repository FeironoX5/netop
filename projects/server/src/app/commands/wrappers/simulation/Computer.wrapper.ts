import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { Computer } from '@entites/devices/Computer';
import { IpAddress } from '@simulation/details/network/IpAddress';
import { Ipv4Packet } from '@simulation/details/network/Ipv4Packet';
import { NetworkDeviceWrapper } from './NetworkDevice.wrapper';

export const ComputerWrapper: EntityWrapper<Computer> = {
  info: 'Used to manage a computer',
  commands: new Map([
    ...NetworkDeviceWrapper<Computer>().commands.entries(),
    [
      'send',
      {
        info: 'Sends an IPv4 packet',
        args: ['destination', 'protocol', 'payload?'],
        fn: (
          entity,
          destination: string,
          protocol: string,
          payload: string = '',
        ) => {
          entity.sendPacket(
            IpAddress.parse(destination),
            Number(protocol) as Ipv4Packet.Protocol,
            payload ? payload.split(',').map(Number) : [],
          );
          return 'Packet queued';
        },
      },
    ],
    [
      'received',
      {
        info: 'Reads received IPv4 packets',
        fn: (entity) =>
          entity
            .receivePackets()
            .map(
              ({
                source,
                destination,
                protocol,
                payload,
              }) =>
                `${IpAddress.toString(source)} -> ${IpAddress.toString(destination)} (${protocol}): ${payload.join(',')}`,
            )
            .join('\n'),
      },
    ],
  ]),
};
