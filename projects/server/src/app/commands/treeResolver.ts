import { EntityWrapper } from './interfaces/EntityWrapper';
import { Resolver } from './types/UserCommand';

export const treeResolver = (
  roots: unknown[],
  {
    match,
    children,
    wrap,
  }: {
    match: (segment: string, entity: unknown) => boolean;
    children: (entity: unknown) => unknown[];
    wrap: (entity: unknown) => EntityWrapper<unknown>;
  },
): Resolver => {
  return (path) => {
    const queue = [...roots];
    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];
      if (match(path[0], node)) {
        const found = descend(node, path, 0, match, children);
        if (found) return { entity: found, wrapper: wrap(found) };
      }
      queue.push(...children(node));
    }
    return undefined;
  };
};

const descend = (
  node: unknown,
  path: string[],
  depth: number,
  match: (s: string, e: unknown) => boolean,
  children: (e: unknown) => unknown[],
): unknown | undefined => {
  if (!match(path[depth], node)) return undefined;
  if (depth === path.length - 1) return node;
  for (const child of children(node)) {
    const found = descend(child, path, depth + 1, match, children);
    if (found) return found;
  }
  return undefined;
};
