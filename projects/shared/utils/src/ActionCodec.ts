import type { Action, PathSegment } from '@netop/types';

export namespace ActionCodec {
  export const DELIMITER = ':';

  export function parse(s: string): Action {
    const [commandLine = '', ...args] = s.split(' ');
    const segments = split(commandLine);
    return {
      path:
        segments.length > 1 ? segments.slice(0, -1) : [],
      commandName: segments[segments.length - 1] ?? '',
      args,
    };
  }

  export function serialize(action: Action): string {
    const prefix =
      action.path.length > 0
        ? join(action.path) + DELIMITER
        : '';
    const args =
      action.args.length > 0
        ? ' ' + action.args.join(' ')
        : '';
    return `${prefix}${action.commandName}${args}`;
  }

  export function join(path: PathSegment[]): string {
    return path.join(DELIMITER);
  }

  export function split(s: string): PathSegment[] {
    return s.split(DELIMITER);
  }
}
