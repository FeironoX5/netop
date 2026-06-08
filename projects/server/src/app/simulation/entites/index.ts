import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// crucial to execute static blocks
function collectFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(
    (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return collectFiles(path);
      if (entry.name === 'index.ts') return [];
      if (entry.name.endsWith('.ts')) return [path];
      return [];
    },
  );
}

await Promise.all(
  collectFiles(import.meta.dir).map((f) => import(f)),
);
