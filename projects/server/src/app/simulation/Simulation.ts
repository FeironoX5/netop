import type {
  PathSegment,
  Simulation as SimulationType,
} from '@netop/types';
import {
  Timer,
  TreeUtils,
  EventTarget,
} from '@netop/utils';
import { simulationTreeWalker } from '@simulation/helpers/simulationTreeWalker';
import type { PhysicalDevice } from './entites/devices/PhysicalDevice';
import { SimulationEvent } from './events/types';
import { SimulationRegistry } from './SimulationRegistry';

export class Simulation {
  constructor(
    public root: SimulationType.Entity,
    public connections: SimulationType.Connection[] = [],
    public eventBus = new EventTarget<SimulationEvent.type>(),
    private timer = new Timer(() => this.tick()),
  ) {
    this.rootEntity.subscribe((event) =>
      this.eventBus.call(event),
    );
  }

  tick() {
    SimulationRegistry.getManager(this.root.category).tick(
      this.root,
    );
    this.connections.forEach((c) =>
      SimulationRegistry.getConnection(c).tick(),
    );
  }

  start() {
    this.timer.start(500);
  }

  stop() {
    this.timer.stop();
  }

  get rootEntity() {
    return SimulationRegistry.fromChain([this.root]);
  }

  resolve(path: PathSegment[]) {
    const chain = TreeUtils.resolveByPartialPath({
      root: this.root,
      walker: simulationTreeWalker,
    })(path);
    if (!chain) return undefined;
    return {
      entity: SimulationRegistry.fromChain(chain.chain),
      path: chain.path,
    };
  }

  resolveFull(path: PathSegment[]) {
    const chain = TreeUtils.resolveByFullPath({
      root: this.root,
      walker: simulationTreeWalker,
    })(path);
    if (!chain) return undefined;
    return SimulationRegistry.fromChain(chain);
  }

  addConnection(connection: SimulationType.Connection) {
    this.connections.push(connection);
    this.eventBus.call({
      scope: 'connection',
      operation: 'create',
      data: connection,
    });
  }

  removeConnection(id: string) {
    const index = this.connections.findIndex(
      (c) => c.id === id,
    );
    if (index === -1) return false;
    const r = this.connections.splice(index, 1);
    this.eventBus.call({
      scope: 'connection',
      operation: 'delete',
      data: r[0],
    });
    return true;
  }

  removePort(device: PhysicalDevice, portId: string) {
    const path = device.port(portId).path;
    this.connections
      .filter(({ left, right }) =>
        [left, right].some(
          (endpoint) =>
            endpoint.length === path.length &&
            endpoint.every(
              (segment, index) => segment === path[index],
            ),
        ),
      )
      .forEach(({ id }) => this.removeConnection(id));
    return device.removePort(portId);
  }

  updateConnection(connection: SimulationType.Connection) {
    const index = this.connections.findIndex(
      ({ id }) => id === connection.id,
    );
    if (index === -1)
      throw new Error(
        `Connection not found: ${connection.id}`,
      );

    const oldData = this.connections[index];
    this.connections[index] = connection;
    this.eventBus.call({
      scope: 'connection',
      operation: 'update',
      data: connection,
      oldData,
    });
  }

  resolveConnection(id: string) {
    const c = this.connections.find((c) => c.id === id);
    return c
      ? SimulationRegistry.getConnection(c)
      : undefined;
  }
}
