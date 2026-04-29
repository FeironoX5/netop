import { CallableEntity } from './callableEntity';

export class CommandHandler {
  private callableEntities: CallableEntity[];

  constructor(callableEntities: CallableEntity[] = []) {
    this.callableEntities = callableEntities;
  }

  executeCommand(s: string, ...args: any[]): string {
    const entity = this.callableEntities.find((e) => e.matchPrefix(s));
    if (!entity) {
      return `No entity matched ${s}`;
    }
    const command = entity.getCommand(s);
    if (!command) {
      return `Command not found: ${command}`;
    }
    return command(...args);
  }
}
