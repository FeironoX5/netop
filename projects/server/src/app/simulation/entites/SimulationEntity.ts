import { PathSegment, Simulation } from '@netop/types';
import { ActionCodec, EventTarget } from '@netop/utils';
import { SimulationEvent } from '../events/types';

type EntityEvent = Extract<
  SimulationEvent.type,
  { scope: 'entity' }
>;

export abstract class SimulationEntity<
  DetailsType extends object = {},
> extends EventTarget<SimulationEvent.type> {
  static ALLOWED_CHILD_CATEGORIES:
    | Simulation.Category[]
    | null = [];

  constructor(
    private e: Simulation.Entity,
    private p: SimulationEntity | null = null,
  ) {
    super();
  }

  get id() {
    return this.e.id;
  }

  get name() {
    return this.e.name;
  }

  get category() {
    return this.e.category;
  }

  get details() {
    return (this.e.details || {}) as DetailsType;
  }

  set details(details: DetailsType) {
    const oldDetails = this.e.details;
    this.e.details = details;
    this.call({
      scope: 'entity',
      operation: 'update',
      parentPath: [],
      data: this.e,
      oldData: { ...this.e, details: oldDetails },
    });
  }

  get children() {
    return this.e.children || [];
  }

  get entity(): Simulation.Entity {
    return this.e;
  }

  get parent() {
    return this.p;
  }

  get path(): PathSegment[] {
    return this.parent
      ? [...this.parent.path, this.id]
      : [this.id];
  }

  toString(): string {
    return `${ActionCodec.join(this.path)}${this.name ? ` - ${this.name}` : ''} (${this.category})`;
  }

  generateChildId(): string {
    const id = crypto.randomUUID();
    if (this.children.find((d) => d.id === id)) {
      return this.generateChildId();
    }
    return id;
  }

  addChild(child: Simulation.Entity) {
    const categories = (
      this.constructor as typeof SimulationEntity
    ).ALLOWED_CHILD_CATEGORIES;
    if (
      categories !== null &&
      !categories.includes(child.category)
    ) {
      throw new Error(
        `Child category ${child.category} not allowed. ${this.category} only allows ${categories ? categories.join(', ') : 'any category'} as child categories.`,
      );
    }
    this.e.children = this.children.concat(child);
    this.call({
      scope: 'entity',
      operation: 'create',
      parentPath: [],
      data: child,
    });
  }

  removeChild(id: string): Simulation.Entity {
    const index = this.children.findIndex(
      (c) => c.id === id,
    );
    if (index === -1)
      throw new Error(`Child not found: ${id}`);
    const [removed] = this.e.children!.splice(index, 1);
    this.call({
      scope: 'entity',
      operation: 'delete',
      parentPath: [],
      data: removed,
    });
    return removed;
  }

  override call(event: EntityEvent): void {
    const parentPath =
      event.operation === 'update'
        ? (this.parent?.path ?? [])
        : this.path;

    this.propagate({ ...event, parentPath });
  }

  private propagate(event: EntityEvent): void {
    super.call(event);
    this.parent?.propagate(event);
  }
}
