import { expect, test } from 'bun:test';
import { resolve } from 'node:path';
import {
  type ConformanceObservation,
  reportConformance,
} from '../../support/reportConformance';
import { runNetemul } from '../../support/runNetemul';
import { ServerCli } from '../../support/ServerCli';
import {
  configure,
  ports,
  result,
  route,
  tick,
} from '../support/simulationCli';

test('routed IPv4 delivery conforms to NetEmul', async () => {
  const netemul = await runNetemul<
    ConformanceObservation<{ receivedPackets: number }>
  >(resolve(import.meta.dir, 'netemul.js'));
  const cli = await ServerCli.start();

  try {
    await cli.execute('scene:new computer pc1');
    await cli.execute('scene:new computer pc2');
    await cli.execute('scene:new router router1');

    const pc1Port = ports(
      await cli.execute('pc1:interfaces'),
    )[0]!;
    const pc2Port = ports(
      await cli.execute('pc2:interfaces'),
    )[0]!;
    const routerPorts = ports(
      await cli.execute('router1:interfaces'),
    );
    const router1Port = routerPorts[0]!;
    const router2Port = routerPorts[1]!;

    await cli.execute(
      `${pc1Port}:link ${router1Port} 10000 0`,
    );
    await cli.execute(
      `${pc2Port}:link ${router2Port} 10000 0`,
    );

    await configure(
      cli,
      'pc1',
      pc1Port,
      '192.168.1.1',
      '255.255.255.0',
    );
    await configure(
      cli,
      'router1',
      router1Port,
      '192.168.1.254',
      '255.255.255.0',
    );
    await configure(
      cli,
      'pc2',
      pc2Port,
      '192.168.2.1',
      '255.255.255.0',
    );
    await configure(
      cli,
      'router1',
      router2Port,
      '192.168.2.254',
      '255.255.255.0',
    );

    await route(
      cli,
      'pc1',
      '0.0.0.0',
      '0.0.0.0',
      pc1Port,
      '192.168.1.254',
    );
    await route(
      cli,
      'pc2',
      '0.0.0.0',
      '0.0.0.0',
      pc2Port,
      '192.168.2.254',
    );
    await route(
      cli,
      'router1',
      '192.168.1.0',
      '255.255.255.0',
      router1Port,
    );
    await route(
      cli,
      'router1',
      '192.168.2.0',
      '255.255.255.0',
      router2Port,
    );

    await cli.execute('pc1:send 192.168.2.1 17 1');
    await tick(cli, 20);

    const netop = await result(cli, 'pc2');

    reportConformance(
      {
        topology: 'pc1 <Ethernet> router <Ethernet> pc2',
        packet: 'IPv4/UDP 192.168.1.1 -> 192.168.2.1',
      },
      netemul,
      netop,
    );
    expect(netop.result).toEqual(netemul.result);
    expect(netop.result).toEqual({ delivered: true });
  } finally {
    await cli.stop();
  }
});
