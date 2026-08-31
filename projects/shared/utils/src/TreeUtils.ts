import type { PathSegment } from '@netop/types';

export type treeWalker<T> = {
  match: (s: PathSegment, e: T) => boolean;
  extract: (e: T) => PathSegment;
  join: (p: PathSegment[]) => string;
  children: (e: T) => T[];
};

type tree<T> = { root: T; walker: treeWalker<T> };

export namespace TreeUtils {
  export function flatten<T>({ root, walker }: tree<T>) {
    const result = new Map<string, T>();

    function processNode(
      node: T,
      path: PathSegment[] = [],
    ): void {
      path = [...path, walker.extract(node)];
      result.set(walker.join(path), node);
      for (const child of walker.children(node)) {
        processNode(child, path);
      }
    }

    processNode(root);
    return result;
  }

  export function resolveByFullPath<T>({
    root,
    walker,
  }: tree<T>) {
    // path includes root
    return (path: PathSegment[]): T[] | undefined => {
      const result: T[] = [root];
      let current = root;

      for (const segment of path) {
        const child = walker
          .children(current)
          .find((c) => walker.match(segment, c));
        if (!child) return undefined;
        result.push(child);
        current = child;
      }

      return result;
    };
  }

  export function resolveByPartialPath<T>({
    root,
    walker,
  }: tree<T>) {
    type TreeChainNode<T> = {
      node: T;
      parent: T | undefined;
      segment: PathSegment;
    };

    function chainedToPath(chain: TreeChainNode<T>[]) {
      const last = chain.at(-1);
      if (!last) return undefined;
      return {
        entity: last.node,
        path: chain.map((n) => n.segment),
        chain: chain.map((n) => n.node),
      };
    }

    return (path: PathSegment[]) => {
      const first = path[0];
      const rootMatches = new Set<number>([0]);
      if (first !== undefined && walker.match(first, root))
        rootMatches.add(1);
      if (rootMatches.has(path.length)) {
        return chainedToPath([
          {
            node: root,
            parent: undefined,
            segment: walker.extract(root),
          },
        ]);
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
              const current = path[matched];
              if (
                current !== undefined &&
                walker.match(current, child)
              ) {
                childMatches.add(matched + 1);
              }
            }
          }

          if (
            first !== undefined &&
            walker.match(first, child)
          ) {
            childMatches.add(1);
          }

          if (childMatches.has(path.length)) {
            return chainedToPath(childChain);
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
