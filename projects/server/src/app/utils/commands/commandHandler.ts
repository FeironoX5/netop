import { Command } from '../../types/command';
import { CallableEntity } from './callableEntity';

export class CommandHandler extends CallableEntity {
  private callableEntities: CallableEntity[];

  constructor(callableEntities: CallableEntity[] = []) {
    super(
      '',
      new Map([
        [
          'help',
          (entityCommand) => {
            const e = entityCommand;
            if (!e)
              return `Commands are written as "<prefix>:<command>", where prefix is one of: ${this.callableEntities.map((e) => `${e.commandPrefix}${e.info ? ` (${e.info})` : ''}`).join(', ')}. Use ":help <prefix>" to see commands for a specific entity.`;
            const entity = this.getCommandByPrefix(e);
            if (!entity) return `No entity matched ${e}`;
            return `Commands for ${entity.commandPrefix} entity: ${entity.getCommandNames().join(', ')}`;
          },
        ],
      ]),
      'Show help for commands',
    );
    this.callableEntities = [...callableEntities, this];
  }

  private parseCommand(s: string): Command {
    const [commandLine, ...args] = s.split(' ');
    const [prefix, command] = commandLine ? commandLine.split(':') : [];
    return {
      prefix,
      command,
      args,
    };
  }

  private getCommandByPrefix(s: string): CallableEntity | undefined {
    return this.callableEntities.find((e) => e.matchPrefix(s));
  }

  public executeCommand(s: string): string {
    const { prefix, command, args } = this.parseCommand(s);
    const entity = this.getCommandByPrefix(prefix);
    if (!entity) {
      return `No entity matched ${prefix}`;
    }
    const commandFn = entity.getCommand(command);
    if (!commandFn) {
      return `Entity command not found: ${command}`;
    }
    return commandFn(...args);
  }
}
