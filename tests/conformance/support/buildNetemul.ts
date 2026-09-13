import { resolve } from 'node:path';
import { NETEMUL_ROOT } from './paths';

async function run(command: string[]): Promise<void> {
  const process = Bun.spawn(command, {
    cwd: NETEMUL_ROOT,
    stdout: 'inherit',
    stderr: 'inherit',
  });
  if ((await process.exited) !== 0) {
    throw new Error(command.join(' ') + ' failed');
  }
}

const main = await Bun.file(
  resolve(NETEMUL_ROOT, 'src/main.cpp'),
);
if (!(await main.exists())) {
  throw new Error(
    `NetEmul source not found at ${NETEMUL_ROOT}`,
  );
}

const source = await main.text();
if (!source.includes('runScript')) {
  const patch = Bun.which('patch');
  if (!patch)
    throw new Error('Required tool not found: patch');
  await run([
    patch,
    '-p1',
    '-i',
    resolve(import.meta.dir, 'netemul-headless.patch'),
  ]);
}

const qmake = Bun.which('qmake-qt5') ?? Bun.which('qmake');
if (!qmake)
  throw new Error('Required tool not found: qmake');

const make =
  process.platform === 'win32'
    ? (Bun.which('mingw32-make') ?? Bun.which('make'))
    : Bun.which('make');
if (!make) throw new Error('Required tool not found: make');

await run([qmake]);
await run([make]);
