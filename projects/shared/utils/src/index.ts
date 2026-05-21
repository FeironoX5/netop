import type { Action } from '@netop/types';

export class ActionCodec {
  static readonly PATH_DELIMITER = ':';

  static parse(s: string): Action {
    const [commandLine = '', ...args] = s.split(' ');
    const segments = commandLine.split(this.PATH_DELIMITER);
    return {
      path:
        segments.length > 1 ? segments.slice(0, -1) : [],
      command: segments[segments.length - 1] ?? '',
      args,
    };
  }

  static serialize(action: Action): string {
    const prefix =
      action.path.length > 0
        ? action.path.join(this.PATH_DELIMITER) +
          this.PATH_DELIMITER
        : '';
    const args =
      action.args.length > 0
        ? ' ' + action.args.join(' ')
        : '';
    return `${prefix}${action.command}${args}`;
  }
}
