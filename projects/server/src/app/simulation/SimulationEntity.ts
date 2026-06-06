import { Simulation } from '@netop/types';

export abstract class SimulationEntity<DetailsType = {}> {
  static ALLOWED_CHILD_CATEGORIES:
    | Simulation.Category[]
    | null = [];

  constructor(private readonly e: Simulation.Entity) {}

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

  toString(): string {
    return `${this.category}:${this.id}${this.name ? `:${this.name}` : ''}`;
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
        `Child category ${child.category} not allowed`,
      );
    }
    this.e.children = this.children.concat(child);
  }

  removeChild(id: string): Simulation.Entity | undefined {
    const index = this.children.findIndex(
      (c) => c.id === id,
    );
    if (index === -1)
      throw new Error(`Child not found: ${id}`);
    const [removed] = this.e.children!.splice(index, 1);
    return removed;
  }
}
