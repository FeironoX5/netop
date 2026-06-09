import { PathSegment } from '@netop/types';

export type treeWalker<T> = {
  match: (s: PathSegment, e: T) => boolean;
  extract: (e: T) => PathSegment;
  join: (p: PathSegment[]) => string;
  children: (e: T) => T[];
};

type tree<T> = { root: T; walker: treeWalker<T> };

export namespace TreeUtils {
  export function flatten<T>({
    root,
    walker,
  }: tree<T>): Map<string, T> {
    const result = new Map<string, T>();
    function dfs(node: T, path: PathSegment[]): void {
      result.set(walker.join(path), node);
      const childPath = [...path, walker.extract(node)];
      for (const child of walker.children(node)) {
        dfs(child, childPath);
      }
    }

    dfs(root, []);
    return result;
  }

  export function resolve<T>({ root, walker }: tree<T>) {
    return (path: PathSegment[]) => {
      const rootMatches = new Set<number>([0]);
      if (walker.match(path[0], root)) rootMatches.add(1);
      if (rootMatches.has(path.length)) return root;

      const queue: Array<{
        node: T;
        matches: Set<number>;
      }> = [{ node: root, matches: rootMatches }];

      while (queue.length > 0) {
        const { node, matches } = queue.shift()!;

        for (const child of walker.children(node)) {
          const childMatches = new Set<number>([0]);

          for (const matched of matches) {
            if (matched > 0 && matched < path.length) {
              if (walker.match(path[matched], child)) {
                childMatches.add(matched + 1);
              }
            }
          }

          if (walker.match(path[0], child)) {
            childMatches.add(1);
          }

          if (childMatches.has(path.length)) {
            return child;
          }

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
