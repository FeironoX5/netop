export abstract class CallableEntity {
  commands: Map<string, (...args: string[]) => string>;
  commandPrefix: string;

  constructor(commandPrefix: string, commands: Map<string, (...args: string[]) => string>) {
    this.commandPrefix = commandPrefix;
    this.commands = commands;
  }

  getCommand(s: string): ((...args: string[]) => string) | undefined {
    return this.commands.get(s.slice(this.commandPrefix.length));
  }

  matchPrefix(s: string): boolean {
    return s.startsWith(this.commandPrefix);
  }
}
