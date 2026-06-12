import { PathSegment } from '@netop/types';

export type treeWalker<T> = {
  match: (s: PathSegment, e: T) => boolean;
  extract: (e: T) => PathSegment;
  join: (p: PathSegment[]) => string;
  children: (e: T) => T[];
};

export type ResolvedTreeNode<T> = {
  entity: T;
  path: PathSegment[];
};

export type TreeChainNode<T> = {
  node: T;
  parent: T | undefined;
  segment: PathSegment;
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
    const chainResolver = resolveChain({ root, walker });

    return (path: PathSegment[]) => {
      const chain = chainResolver(path);
      if (!chain) return undefined;
      return {
        entity: chain[chain.length - 1].node,
        path: chain.map((n) => n.segment),
      };
    };
  }

  export function resolveChain<T>({
    root,
    walker,
  }: tree<T>) {
    return (path: PathSegment[]) => {
      const rootMatches = new Set<number>([0]);
      if (walker.match(path[0], root)) rootMatches.add(1);
      if (rootMatches.has(path.length)) {
        return [
          {
            node: root,
            parent: undefined,
            segment: walker.extract(root),
          },
        ];
      }

      const queue: Array<{
        node: T;
        matches: Set<number>;
        chain: TreeChainNode<T>[];
      }> = [
        {
          node: root,
          matches: rootMatches,
          chain: [
            {
              node: root,
              parent: undefined,
              segment: walker.extract(root),
            },
          ],
        },
      ];

      while (queue.length > 0) {
        const { node, matches, chain } = queue.shift()!;

        for (const child of walker.children(node)) {
          const childMatches = new Set<number>([0]);
          const segment = walker.extract(child);
          const childChain = [
            ...chain,
            { node: child, parent: node, segment },
          ];

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
            return childChain;
          }

          queue.push({
            node: child,
            matches: childMatches,
            chain: childChain,
          });
        }
      }

      return undefined;
    };
  }
}
