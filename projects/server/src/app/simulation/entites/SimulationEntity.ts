import { PathSegment, Simulation } from '@netop/types';
import { ActionCodec, EventTarget } from '@netop/utils';

export abstract class SimulationEntity<
  DetailsType = {},
> extends EventTarget<Simulation.Event> {
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
  }

  removeChild(id: string): Simulation.Entity {
    const index = this.children.findIndex(
      (c) => c.id === id,
    );
    if (index === -1)
      throw new Error(`Child not found: ${id}`);
    const [removed] = this.e.children!.splice(index, 1);
    return removed;
  }

  protected override call(event: Simulation.Event): void {
    super.call(event);

    const parent = this.parent;
    if (!parent) return;

    parent.call({
      ...event,
      path: [this.id, ...event.path],
    });
  }
}
