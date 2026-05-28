import { EntityWrapper } from '@commands/interfaces/EntityWrapper';
import type { Action, PathSegment } from '@netop/types';
import { ActionCodec } from '@netop/utils';
import {
  Resolver,
  ResolverFactory,
} from './resolvers/types';
import { ActionHandlerWrapper } from './wrappers/ActionHandler.wrapper';

export class ActionHandler {
  constructor(
    private factories: ResolverFactory<any>[],
    private selfWrapper: EntityWrapper<ActionHandler> = ActionHandlerWrapper,
  ) {}

  public execute(s: string): string {
    const action = ActionCodec.parse(s);
    return this.executeAction(action);
  }

  private executeAction(action: Action): string {
    if (action.path.length === 0) {
      return this.run(
        this,
        this.selfWrapper,
        action.commandName,
        action.args,
      );
    }
    const resolved = this.resolve(action.path);
    if (!resolved) throw new Error('no entity found');
    return this.run(
      resolved.entity,
      resolved.wrapper,
      action.commandName,
      action.args,
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

  private resolve(
    path: PathSegment[],
  ): ReturnType<Resolver<any>> {
    if (path.length === 0) {
      return { entity: this, wrapper: this.selfWrapper };
    }
    for (const factory of this.factories) {
      const result = factory.resolver(path);
      if (result) return result;
    }
    return undefined;
  }

  public getFactories(): ResolverFactory<any>[] {
    return this.factories;
  }
}
