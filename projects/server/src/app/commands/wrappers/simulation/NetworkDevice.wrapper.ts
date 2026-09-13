import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import { NetworkDevice } from '@entites/devices/NetworkDevice';
import type { FrameFormat } from '@entites/ports/DataLinkPort';
import { IpAddress } from '@simulation/details/network/IpAddress';
import { SimulationEntityWrapper } from './SimulationEntity.wrapper';

export const NetworkDeviceWrapper = <
  T extends NetworkDevice,
>(): EntityWrapper<T> => {
  const commands = new Map(
    SimulationEntityWrapper<T>().commands.entries(),
  );

  commands.set('new', {
    info: 'Adds a network interface and port',
    args: ['frameFormat'],
    fn: (entity, frameFormat) => {
      const networkInterface = entity.addInterface(
        frameFormat as FrameFormat,
      );
      return `Added port ${networkInterface.portId}`;
    },
  });
  commands.set('rm', {
    info: 'Removes a network interface and port',
    args: ['portId'],
    fn: (entity, portId) => {
      entity.removeInterface(portId);
      return `Removed port ${portId}`;
    },
  });

  commands.set('interfaces', {
    info: 'Lists network interfaces',
    fn: (entity) =>
      entity.networkInterfaces
        .map(
          ({ portId, ipAddress, subnetMask }) =>
            `${portId}: ${IpAddress.toString(ipAddress)} ${IpAddress.toString(subnetMask)} (${entity.networkCard.port(portId).frameFormat})`,
        )
        .join('\n'),
  });
  commands.set('interface-set', {
    info: 'Configures a network interface',
    args: ['portId', 'ipAddress', 'subnetMask'],
    fn: (entity, portId, ipAddress, subnetMask) => {
      entity.configureInterface(
        portId,
        IpAddress.parse(ipAddress),
        IpAddress.parse(subnetMask),
      );
      return `Configured interface on port ${portId}`;
    },
  });
  commands.set('routes', {
    info: 'Lists routing table entries',
    fn: (entity) =>
      entity.routingTable
        .map(
          (
            { network, subnetMask, portId, nextHop },
            index,
          ) =>
            `${index}: ${IpAddress.toString(network)} ${IpAddress.toString(subnetMask)} -> ${nextHop ? IpAddress.toString(nextHop) : 'direct'} on ${portId}`,
        )
        .join('\n'),
  });
  commands.set('route-add', {
    info: 'Adds a routing table entry',
    args: ['network', 'subnetMask', 'portId', 'nextHop?'],
    fn: (entity, network, subnetMask, portId, nextHop) => {
      entity.addRoute({
        network: IpAddress.parse(network),
        subnetMask: IpAddress.parse(subnetMask),
        portId,
        ...(nextHop
          ? { nextHop: IpAddress.parse(nextHop) }
          : {}),
      });
      return 'Route added';
    },
  });
  commands.set('route-rm', {
    info: 'Removes a routing table entry',
    args: ['index'],
    fn: (entity, index) => {
      entity.removeRoute(Number(index));
      return 'Route removed';
    },
  });

  return {
    info: 'Used to manage a network device',
    commands,
  };
};
