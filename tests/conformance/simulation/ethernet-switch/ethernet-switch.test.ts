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

test('switched Ethernet IPv4 delivery conforms to NetEmul', async () => {
  const netemul = await runNetemul<
    ConformanceObservation<{ receivedPackets: number }>
  >(resolve(import.meta.dir, 'netemul.js'));
  const cli = await ServerCli.start();

  try {
    await cli.execute('scene:new computer pc1');
    await cli.execute('scene:new computer pc2');
    await cli.execute('scene:new switch switch1');

    const pc1Port = ports(
      await cli.execute('pc1:interfaces'),
    )[0]!;
    const pc2Port = ports(
      await cli.execute('pc2:interfaces'),
    )[0]!;
    const switchPorts = ports(
      await cli.execute('switch1:ports'),
    );
    const switch1Port = switchPorts[0]!;
    const switch2Port = switchPorts[1]!;

    await cli.execute(
      `${pc1Port}:link ${switch1Port} 10000 0`,
    );
    await cli.execute(
      `${pc2Port}:link ${switch2Port} 10000 0`,
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
      'pc2',
      pc2Port,
      '192.168.1.2',
      '255.255.255.0',
    );
    await route(
      cli,
      'pc1',
      '192.168.1.0',
      '255.255.255.0',
      pc1Port,
    );
    await route(
      cli,
      'pc2',
      '192.168.1.0',
      '255.255.255.0',
      pc2Port,
    );
    await cli.execute('pc1:send 192.168.1.2 17 1');
    await tick(cli, 15);

    const netop = await result(cli, 'pc2');

    reportConformance(
      {
        topology: 'pc1 <Ethernet> switch <Ethernet> pc2',
        packet: 'IPv4/UDP 192.168.1.1 -> 192.168.1.2',
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
