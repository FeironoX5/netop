import { parseArgs } from 'util';

const ARGS = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: 'string',
      default: process.env.DEFAULT_SERVER_PORT,
    },
    dbPath: {
      type: 'string',
      default: process.env.DB_PATH,
    },
  },
  allowPositionals: true,
});

export const PORT: number = Number(ARGS.values.port);
export const DBPATH = ARGS.values.dbPath;
