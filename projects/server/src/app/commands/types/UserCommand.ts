import { EntityWrapper } from '../interfaces/EntityWrapper';

export type PathSegment = string;

/**
 * Command is parsed from a string containing:
 * - prefix - no-whitespace string of path segments separated by ':'
 * - name - non-empty no-whitespace string
 * - args - command arguments separated by whitespace
 */
export type UserCommand = {
  path: PathSegment[];
  name: string;
  args: string[];
};

export type Resolved = {
  entity: unknown;
  wrapper: EntityWrapper<unknown>;
};

export type Resolver = (
  path: PathSegment[],
) => Resolved | undefined;
