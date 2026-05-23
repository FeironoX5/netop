export interface EntityWrapperCommand<T> {
  fn: (entity: T, ...args: string[]) => string;
  info?: string;
  args?: string[];
}

export interface EntityWrapper<T> {
  info?: string;
  commands: Map<string, EntityWrapperCommand<T>>;
}
