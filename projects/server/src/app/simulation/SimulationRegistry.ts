import { SimulationEntity } from '@entites/SimulationEntity';
import { Simulation as SimulationTypes } from '@netop/types';
import { ArpMessage } from './details/ArpMessage';
import { ArpTable } from './details/ArpTable';
import { EthernetFrame } from './details/EthernetFrame';
import { IpAddress } from './details/IpAddress';
import { Ipv4Packet } from './details/Ipv4Packet';
import { MacAddress } from './details/MacAddress';
import type { Computer } from './entites/devices/Computer';
import type { DataLinkDetails } from './entites/devices/DataLinkDevice';
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
      const children = e.children!;

      children.forEach((c) =>
        SimulationRegistry.getManager(c.category).tick(c),
      );
    },
    ethernet(e) {
      const { outgoingFrames, ports, receivedFrames } =
        e.details as DataLinkDetails;

      for (const { port, frame } of outgoingFrames.splice(
        0,
      )) {
        ports[port]!.out.push(
          ...EthernetFrame.serialize(frame),
        );
      }

      ports.forEach((port, portIndex) => {
        let frame = EthernetFrame.read(port.in);
        while (frame) {
          receivedFrames.push({ port: portIndex, frame });
          frame = EthernetFrame.read(port.in);
        }
      });
    },
    arp(e) {
      const computer =
        SimulationRegistry.fromChain<Computer>([e]);
      const { networkCard, networkInterface } = computer;

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
          networkCard.transmit(
            message.senderMacAddress,
            EthernetFrame.EtherType.ARP,
            ArpMessage.serialize({
              operation: ArpMessage.Operation.REPLY,
              senderMacAddress: networkCard.macAddress,
              senderIpAddress: networkInterface.ipAddress,
              targetMacAddress: message.senderMacAddress,
              targetIpAddress: message.senderIpAddress,
            }),
          );
        }
      }
    },
    ethernetOutput(e) {
      const computer =
        SimulationRegistry.fromChain<Computer>([e]);
      const { networkCard, networkInterface } = computer;

      for (const packet of networkInterface.outgoingPackets.splice(
        0,
      )) {
        const destinationMacAddress = ArpTable.get(
          networkInterface.arpTable,
          packet.destination,
        );

        if (!destinationMacAddress) {
          networkInterface.outgoingPackets.push(packet);

          if (destinationMacAddress === undefined) {
            ArpTable.request(
              networkInterface.arpTable,
              packet.destination,
            );
            networkCard.transmit(
              MacAddress.BROADCAST,
              EthernetFrame.EtherType.ARP,
              ArpMessage.serialize({
                operation: ArpMessage.Operation.REQUEST,
                senderMacAddress: networkCard.macAddress,
                senderIpAddress: networkInterface.ipAddress,
                targetIpAddress: packet.destination,
              }),
            );
          }

          continue;
        }

        networkCard.transmit(
          destinationMacAddress,
          EthernetFrame.EtherType.IPV4,
          Ipv4Packet.serialize(packet),
        );
      }
    },
    ethernetInput(e) {
      const computer =
        SimulationRegistry.fromChain<Computer>([e]);
      const { networkCard, networkInterface } = computer;

      for (const { frame } of networkCard.receive()) {
        if (
          frame.etherType === EthernetFrame.EtherType.IPV4
        ) {
          networkInterface.receivedPackets.push(
            Ipv4Packet.deserialize(frame.payload),
          );
        } else if (
          frame.etherType === EthernetFrame.EtherType.ARP
        ) {
          networkInterface.receivedArpMessages.push(
            ArpMessage.deserialize(frame.payload),
          );
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
