import { NETEMUL_EXECUTABLE, NETEMUL_ROOT } from './paths';

export async function runNetemul<Result>(
  script: string,
): Promise<Result> {
  const process = Bun.spawn(
    [NETEMUL_EXECUTABLE, '--script', script],
    {
      cwd: NETEMUL_ROOT,
      env: {
        ...Bun.env,
        QT_QPA_PLATFORM:
          Bun.env.QT_QPA_PLATFORM ?? 'offscreen',
      },
      stdout: 'pipe',
      stderr: 'pipe',
    },
  );
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);
  const output = stdout + stderr;
  if (exitCode !== 0) throw new Error(output);

  const result = output.match(
    /CONFORMANCE_RESULT:(\{[^\n]+\})/,
  )?.[1];
  if (!result)
    throw new Error(`Result not found:\n${output}`);
  return JSON.parse(result) as Result;
}
