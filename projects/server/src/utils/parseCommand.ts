import { Command } from '../app/types/command';

export function parseCommand(s: string): Command {
  const [command, ...args] = s.split(' ');
  return {
    command,
    args,
  };
}
