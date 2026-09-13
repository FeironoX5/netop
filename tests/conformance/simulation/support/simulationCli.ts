import type { ConformanceObservation } from '../../support/reportConformance';
import { ServerCli } from '../../support/ServerCli';

export function ports(output: string): string[] {
  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split(':', 1)[0]!);
}

export async function configure(
  cli: ServerCli,
  device: string,
  port: string,
  ipAddress: string,
  subnetMask: string,
): Promise<void> {
  await cli.execute(
    `${device}:interface-set ${port} ${ipAddress} ${subnetMask}`,
  );
}

export async function route(
  cli: ServerCli,
  device: string,
  network: string,
  subnetMask: string,
  port: string,
  nextHop?: string,
): Promise<void> {
  await cli.execute(
    `${device}:route-add ${network} ${subnetMask} ${port}${nextHop ? ` ${nextHop}` : ''}`,
  );
}

export async function tick(
  cli: ServerCli,
  count: number,
): Promise<void> {
  for (let tick = 0; tick < count; tick += 1) {
    await cli.execute('scene:tick');
  }
}

export async function result(
  cli: ServerCli,
  computer: string,
): Promise<ConformanceObservation<{ received: string }>> {
  const received = (
    await cli.execute(`${computer}:received`)
  ).trim();
  return {
    result: { delivered: Boolean(received) },
    details: { received },
  };
}
