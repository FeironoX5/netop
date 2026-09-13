import { resolve } from 'node:path';

export const PROJECT_ROOT = resolve(
  import.meta.dir,
  '../../..',
);
export const NETEMUL_ROOT = resolve(
  PROJECT_ROOT,
  'netemul_sources/netemul-1.0',
);
export const NETEMUL_EXECUTABLE = resolve(
  NETEMUL_ROOT,
  process.platform === 'win32' ? 'netemul.exe' : 'netemul',
);
export const SERVER_ROOT = resolve(
  PROJECT_ROOT,
  'projects/server',
);
