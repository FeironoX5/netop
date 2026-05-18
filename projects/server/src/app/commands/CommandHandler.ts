import {
  PathSegment,
  Resolver,
  UserCommand,
} from '@commands/types/UserCommand';
import { EntityWrapper } from './interfaces/EntityWrapper';

export class CommandHandler {
  private resolvers: Resolver[];
  private selfWrapper: EntityWrapper<CommandHandler>;

  constructor(
    resolvers: Resolver[],
    selfWrapper: EntityWrapper<CommandHandler>,
  ) {
    this.resolvers = resolvers;
    this.selfWrapper = selfWrapper;
  }

  public executeCommand(s: string): string {
    try {
      const { path, name, args } = this.parseCommand(s);
      if (path.length === 0) {
        return this.run(this, this.selfWrapper, name, args);
      }
      const resolved = this.resolve(path);
      if (!resolved) throw new Error('no entity found');
      return this.run(
        resolved.entity,
        resolved.wrapper,
        name,
        args,
      );
    } catch (e) {
      return `error: ${e instanceof Error ? e.message : e}`;
    }
  }

  private run<T>(
    entity: T,
    wrapper: EntityWrapper<T>,
    name: string,
    args: string[],
  ): string {
    const command = wrapper.commands.get(name);
    if (!command) throw new Error('no command found');
    return command.fn(entity, ...args);
  }

  private parseCommand(s: string): UserCommand {
    const [commandLine = '', ...args] = s.split(' ');
    const segments = commandLine.split(':');
    return {
      path:
        segments.length > 1 ? segments.slice(0, -1) : [],
      name: segments[segments.length - 1],
      args,
    };
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
