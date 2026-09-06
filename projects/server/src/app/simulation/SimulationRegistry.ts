import { SimulationEntity } from '@entites/SimulationEntity';
import { Simulation as SimulationTypes } from '@netop/types';
import { ArpMessage } from './details/data-link/ArpMessage';
import { ArpTable } from './details/data-link/ArpTable';
import { EthernetFrame } from './details/data-link/EthernetFrame';
import { MacAddress } from './details/data-link/MacAddress';
import { SlipFrame } from './details/data-link/SlipFrame';
import { IpAddress } from './details/network/IpAddress';
import { Ipv4Packet } from './details/network/Ipv4Packet';
import { DataLinkDevice } from './entites/devices/DataLinkDevice';
import type { NetworkCard } from './entites/devices/NetworkCard';
import type { NetworkDeviceDetails } from './entites/devices/NetworkDevice';
import { PhysicalDevice } from './entites/devices/PhysicalDevice';
import { Simulation } from './Simulation';
import { SimulationConnection } from './SimulationConnection';

type DetailsOf<T extends SimulationEntity> =
  T extends SimulationEntity<infer D> ? D : never;

type EntityManager<
  T extends SimulationEntity = SimulationEntity,
> = {
  // use directly only if you don't want result to be cached
  from: new (
    e: SimulationTypes.Entity,
    p?: SimulationEntity | null,
  ) => T;
  tick: (
    e: SimulationTypes.Entity & { details?: DetailsOf<T> },
  ) => void;
  build: (
    id: SimulationTypes.Entity['id'],
    ...args: string[]
  ) => SimulationTypes.Entity & { details?: DetailsOf<T> };
};

/** Used to:
 * - store behaviours and entity managers
 * - translate entity data to entity instance
 * - cache entity instances
 * - access simulation state
 */
export class SimulationRegistry {
  static behaviours: Record<
    string,
    (e: SimulationTypes.Entity) => void
  > = {
    entity(e) {
      e.children?.forEach((c) =>
        SimulationRegistry.getManager(c.category).tick(c),
      );
    },
    repeater(e) {
      const device =
        SimulationRegistry.fromChain<PhysicalDevice>([e]);

      device.details.ports
        .entries()
        .filter(([, buffer]) => buffer.in.length > 0)
        .take(1)
        .forEach(([port, buffer]) =>
          device.sendExcept(port, buffer.in.splice(0)),
        );

      device.details.ports.forEach((buffer) =>
        buffer.in.splice(0),
      );
    },
    dataLink(e) {
      const device =
        SimulationRegistry.fromChain<DataLinkDevice>([e]);
      const { ports, receivedFrames } = device.details;

      ports.forEach((_, portIndex) => {
        let frame = device.read(portIndex);
        while (frame) {
          receivedFrames.push({ port: portIndex, frame });
          frame = device.read(portIndex);
        }
      });
    },
    arp(e) {
      const { networkInterfaces } =
        e.details as NetworkDeviceDetails;
      const networkCard =
        SimulationRegistry.fromChain<NetworkCard>([
          e,
          e.children![0]!,
        ]);

      for (const networkInterface of networkInterfaces) {
        for (const message of networkInterface.receivedArpMessages.splice(
          0,
        )) {
          ArpTable.learn(
            networkInterface.arpTable,
            message.senderIpAddress,
            message.senderMacAddress,
          );

          if (
            message.operation ===
              ArpMessage.Operation.REQUEST &&
            IpAddress.equals(
              message.targetIpAddress,
              networkInterface.ipAddress,
            )
          ) {
            networkCard.transmit(networkInterface.port, {
              destination: message.senderMacAddress,
              etherType: EthernetFrame.EtherType.ARP,
              payload: ArpMessage.serialize({
                operation: ArpMessage.Operation.REPLY,
                senderMacAddress: networkCard.macAddress,
                senderIpAddress: networkInterface.ipAddress,
                targetMacAddress: message.senderMacAddress,
                targetIpAddress: message.senderIpAddress,
              }),
            });
          }
        }
      }
    },
    networkOutput(e) {
      const { networkInterfaces } =
        e.details as NetworkDeviceDetails;
      const networkCard =
        SimulationRegistry.fromChain<NetworkCard>([
          e,
          e.children![0]!,
        ]);

      for (const networkInterface of networkInterfaces) {
        for (const outgoingPacket of networkInterface.outgoingPackets.splice(
          0,
        )) {
          const { packet, nextHop } = outgoingPacket;
          switch (
            networkCard.ports(networkInterface.port)
              .frameFormat
          ) {
            case EthernetFrame.FORMAT:
              break;
            case SlipFrame.FORMAT:
              networkCard.transmit(networkInterface.port, {
                payload: Ipv4Packet.serialize(packet),
              });
              continue;
            default:
              continue;
          }

          const destinationMacAddress = ArpTable.get(
            networkInterface.arpTable,
            nextHop,
          );

          if (!destinationMacAddress) {
            networkInterface.outgoingPackets.push(
              outgoingPacket,
            );

            if (destinationMacAddress === undefined) {
              ArpTable.request(
                networkInterface.arpTable,
                nextHop,
              );
              networkCard.transmit(networkInterface.port, {
                destination: MacAddress.BROADCAST,
                etherType: EthernetFrame.EtherType.ARP,
                payload: ArpMessage.serialize({
                  operation: ArpMessage.Operation.REQUEST,
                  senderMacAddress: networkCard.macAddress,
                  senderIpAddress:
                    networkInterface.ipAddress,
                  targetIpAddress: nextHop,
                }),
              });
            }

            continue;
          }

          networkCard.transmit(networkInterface.port, {
            destination: destinationMacAddress,
            etherType: EthernetFrame.EtherType.IPV4,
            payload: Ipv4Packet.serialize(packet),
          });
        }
      }
    },
    networkInput(e) {
      const { networkInterfaces } =
        e.details as NetworkDeviceDetails;
      const networkCard =
        SimulationRegistry.fromChain<NetworkCard>([
          e,
          e.children![0]!,
        ]);

      for (const { port, frame } of networkCard.receive()) {
        const networkInterface = networkInterfaces.find(
          (networkInterface) =>
            networkInterface.port === port,
        )!;

        switch (networkCard.ports(port).frameFormat) {
          case EthernetFrame.FORMAT: {
            const { etherType, payload } =
              EthernetFrame.deserialize(frame);
            switch (etherType) {
              case EthernetFrame.EtherType.IPV4:
                networkInterface.receivedPackets.push(
                  Ipv4Packet.deserialize(payload),
                );
                break;
              case EthernetFrame.EtherType.ARP:
                networkInterface.receivedArpMessages.push(
                  ArpMessage.deserialize(payload),
                );
                break;
            }
            break;
          }
          case SlipFrame.FORMAT:
            networkInterface.receivedPackets.push(
              Ipv4Packet.deserialize(
                SlipFrame.deserialize(frame).payload,
              ),
            );
            break;
        }
      }
    },
  };

  private static managers: Partial<
    Record<SimulationTypes.Category, EntityManager>
  > = {};

  private static entities = new WeakMap<
    SimulationTypes.Entity,
    SimulationEntity
  >();

  private static connections = new WeakMap<
    SimulationTypes.Connection,
    SimulationConnection
  >();

  private static simulation?: Simulation;

  static setManager<T extends SimulationEntity>(
    category: SimulationTypes.Category,
    manager: EntityManager<T>,
  ) {
    this.managers[category] = manager;
  }

  static getManager(category: SimulationTypes.Category) {
    const entry = this.managers[category];
    if (!entry)
      throw new Error(
        `Entity category ${category} not registered. Use one of ${Object.keys(SimulationRegistry.managers).join(', ')}.`,
      );
    return entry;
  }

  static getConnection(
    connection: SimulationTypes.Connection,
  ) {
    const entry =
      this.connections.get(connection) ||
      new SimulationConnection(connection);
    if (!this.connections.has(connection)) {
      this.connections.set(connection, entry);
    }
    return entry;
  }

  static set(simulation: Simulation) {
    this.simulation = simulation;
  }

  static get() {
    if (!this.simulation)
      throw new Error('No simulation set');
    return this.simulation;
  }

  static fromChain<
    T extends SimulationEntity = SimulationEntity,
  >(
    chain: SimulationTypes.Entity[],
    parent: SimulationEntity | null = null,
  ): T {
    const [e, ...rest] = chain;
    if (!e) throw new Error('Empty chain');

    let entity = this.entities.get(e) as T | undefined;
    if (!entity) {
      const Ctor = this.getManager(e.category).from;
      entity = new Ctor(e, parent) as T;
      this.entities.set(e, entity);
    }

    if (rest.length === 0) return entity;
    return this.fromChain(rest, entity);
  }
}
