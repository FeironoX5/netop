import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import type { FrameFormat } from '@entites/devices/DataLinkDevice';
import { NetworkDevice } from '@entites/devices/NetworkDevice';
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
      return `Added port ${networkInterface.port}`;
    },
  });
  commands.set('rm', {
    info: 'Removes a network interface and port',
    args: ['port'],
    fn: (entity, port) => {
      entity.removeInterface(Number(port));
      return `Removed port ${port}`;
    },
  });

  commands.set('interfaces', {
    info: 'Lists network interfaces',
    fn: (entity) =>
      entity.networkInterfaces
        .map(
          ({ port, ipAddress, subnetMask }) =>
            `${port}: ${IpAddress.toString(ipAddress)} ${IpAddress.toString(subnetMask)} (${entity.networkCard.ports(port).frameFormat})`,
        )
        .join('\n'),
  });
  commands.set('interface-set', {
    info: 'Configures a network interface',
    args: ['port', 'ipAddress', 'subnetMask'],
    fn: (entity, port, ipAddress, subnetMask) => {
      entity.configureInterface(
        Number(port),
        IpAddress.parse(ipAddress),
        IpAddress.parse(subnetMask),
      );
      return `Configured interface on port ${port}`;
    },
  });
  commands.set('routes', {
    info: 'Lists routing table entries',
    fn: (entity) =>
      entity.routingTable
        .map(
          ({ network, subnetMask, port, nextHop }, index) =>
            `${index}: ${IpAddress.toString(network)} ${IpAddress.toString(subnetMask)} -> ${nextHop ? IpAddress.toString(nextHop) : 'direct'} on ${port}`,
        )
        .join('\n'),
  });
  commands.set('route-add', {
    info: 'Adds a routing table entry',
    args: ['network', 'subnetMask', 'port', 'nextHop?'],
    fn: (entity, network, subnetMask, port, nextHop) => {
      entity.addRoute({
        network: IpAddress.parse(network),
        subnetMask: IpAddress.parse(subnetMask),
        port: Number(port),
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
