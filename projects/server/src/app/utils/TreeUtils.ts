import { PathSegment } from '@netop/types';
import { EntityWrapper } from '../commands/interfaces/EntityWrapper';
import { Resolver } from '../commands/resolvers/types';

export class TreeUtils {
  static flatten<T>(
    root: T,
    config: {
      extract: (e: T) => PathSegment;
      join: (s: PathSegment[]) => string;
      children: (e: T) => T[];
    },
  ): Map<string, T> {
    const result = new Map<string, T>();
    function dfs(node: T, path: PathSegment[]): void {
      result.set(config.join(path), node);
      const childPath = [...path, config.extract(node)];
      for (const child of config.children(node)) {
        dfs(child, childPath);
      }
    }

    dfs(root, []);
    return result;
  }
  static resolve<T>(
    root: T,
    config: {
      match: (s: PathSegment, e: T) => boolean;
      children: (e: T) => T[];
      wrap: (e: T) => EntityWrapper<T>;
    },
  ): Resolver<T> {
    function pack(e: T) {
      return { entity: e, wrapper: config.wrap(e) };
    }

    return (path: PathSegment[]) => {
      const rootMatches = new Set<number>([0]);
      if (config.match(path[0], root)) rootMatches.add(1);
      if (rootMatches.has(path.length)) return pack(root);

      const queue: Array<{
        node: T;
        matches: Set<number>;
      }> = [{ node: root, matches: rootMatches }];

      while (queue.length > 0) {
        const { node, matches } = queue.shift()!;

        for (const child of config.children(node)) {
          const childMatches = new Set<number>([0]);

          for (const matched of matches) {
            if (matched > 0 && matched < path.length) {
              if (config.match(path[matched], child)) {
                childMatches.add(matched + 1);
              }
            }
          }

          if (config.match(path[0], child)) {
            childMatches.add(1);
          }

          if (childMatches.has(path.length))
            return pack(child);

          queue.push({
            node: child,
            matches: childMatches,
          });
        }
      }
      return undefined;
    };
  }
}
