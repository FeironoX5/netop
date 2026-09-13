import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  ClientMessageType,
  ServerMessageType,
  type ActionResponseMessage,
  type ServerMessage,
} from '@netop/types';
import { SERVER_ROOT } from './paths';

export class ServerCli {
  private constructor(
    private process: Bun.Subprocess,
    private socket: WebSocket,
    private directory: string,
  ) {}

  static async start(): Promise<ServerCli> {
    const directory = await mkdtemp(
      join(tmpdir(), 'netop-conformance-'),
    );
    const port = await this.findPort();
    const serverProcess = Bun.spawn(
      [
        'bun',
        'src/index.ts',
        '--port',
        String(port),
        '--dbPath',
        join(directory, 'netop.db'),
      ],
      {
        cwd: SERVER_ROOT,
        stdout: 'pipe',
        stderr: 'inherit',
      },
    );
    await this.waitForStartup(serverProcess.stdout);
    const socket = await this.connect(port);
    return new ServerCli(serverProcess, socket, directory);
  }

  async execute(body: string): Promise<string> {
    const response =
      await new Promise<ActionResponseMessage>(
        (resolve, reject) => {
          const message = ({
            data,
          }: MessageEvent<string>) => {
            const serverMessage = JSON.parse(
              data,
            ) as ServerMessage;
            if (
              serverMessage.type !==
              ServerMessageType.ActionResponse
            )
              return;
            this.socket.removeEventListener(
              'message',
              message,
            );
            this.socket.removeEventListener('error', error);
            resolve(serverMessage);
          };
          const error = () => {
            this.socket.removeEventListener(
              'message',
              message,
            );
            reject(new Error('WebSocket command failed'));
          };
          this.socket.addEventListener('message', message);
          this.socket.addEventListener('error', error, {
            once: true,
          });
          this.socket.send(
            JSON.stringify({
              type: ClientMessageType.Action,
              body,
            }),
          );
        },
      );

    if (response.status === 'fail') {
      throw new Error(`${body}: ${response.result}`);
    }
    return response.result;
  }

  async stop(): Promise<void> {
    this.socket.close();
    this.process.kill();
    await this.process.exited;
    await rm(this.directory, {
      recursive: true,
      force: true,
    });
  }

  private static async connect(
    port: number,
  ): Promise<WebSocket> {
    const socket = new WebSocket(`ws://127.0.0.1:${port}`);
    await new Promise<void>((resolve, reject) => {
      socket.addEventListener('open', () => resolve(), {
        once: true,
      });
      socket.addEventListener('error', () => reject(), {
        once: true,
      });
    });
    return socket;
  }

  private static async findPort(): Promise<number> {
    const server = createServer();
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    await new Promise<void>((resolve, reject) =>
      server.close((error) =>
        error ? reject(error) : resolve(),
      ),
    );
    if (!address || typeof address === 'string') {
      throw new Error('Failed to allocate server port');
    }
    return address.port;
  }

  private static async waitForStartup(
    stdout: ReadableStream<Uint8Array>,
  ): Promise<void> {
    const reader = stdout.getReader();
    const decoder = new TextDecoder();
    let output = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done)
        throw new Error('Server stopped before startup');
      output += decoder.decode(value, { stream: true });
      if (/runs on \d+ port/.test(output)) {
        reader.releaseLock();
        void stdout.pipeTo(new WritableStream());
        return;
      }
    }
  }
}
