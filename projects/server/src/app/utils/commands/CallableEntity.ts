export abstract class CallableEntity {
  commands: Map<string, (...args: string[]) => string>;
  commandPrefix: string;
  info?: string;

  constructor(
    commandPrefix: string,
    commands: Map<string, (...args: string[]) => string>,
    info?: string,
  ) {
    this.commandPrefix = commandPrefix;
    this.commands = commands;
    this.info = info;
  }

  getCommand(s: string): ((...args: string[]) => string) | undefined {
    return this.commands.get(s);
  }

  getCommandNames(): string[] {
    return Array.from(this.commands.keys());
  }

  matchPrefix(s: string): boolean {
    return s.startsWith(this.commandPrefix);
  }
}
