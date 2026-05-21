import type { PathSegment } from '@netop/types';
import { ActionCodec } from '@netop/utils';
import { EntityWrapper } from './interfaces/EntityWrapper';
import { Resolver } from './utils/treeResolver';

export class ActionHandler {
  private resolvers: Resolver[];
  private selfWrapper: EntityWrapper<ActionHandler>;

  constructor(
    resolvers: Resolver[],
    selfWrapper: EntityWrapper<ActionHandler>,
  ) {
    this.resolvers = resolvers;
    this.selfWrapper = selfWrapper;
  }

  public execute(s: string): string {
    const { path, commandName, args } =
      ActionCodec.parse(s);
    if (path.length === 0) {
      return this.run(
        this,
        this.selfWrapper,
        commandName,
        args,
      );
    }
    const resolved = this.resolve(path);
    if (!resolved) throw new Error('no entity found');
    return this.run(
      resolved.entity,
      resolved.wrapper,
      commandName,
      args,
    );
  }

  private run<T>(
    entity: T,
    wrapper: EntityWrapper<T>,
    commandName: string,
    args: string[],
  ): string {
    const cmd = wrapper.commands.get(commandName);
    if (!cmd) throw new Error('no command found');
    return cmd.fn(entity, ...args);
  }

  public resolve(
    path: PathSegment[],
  ): ReturnType<Resolver> {
    if (path.length === 0) {
      return {
        entity: this,
        wrapper: this.selfWrapper as EntityWrapper<unknown>,
      };
    }
    for (const resolver of this.resolvers) {
      const result = resolver(path);
      if (result) return result;
    }
    return undefined;
  }
}
