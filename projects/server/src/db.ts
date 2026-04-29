import { Database } from 'bun:sqlite';
import { DBPATH } from './config';

export const db = new Database(DBPATH, {
  create: true,
  strict: true,
});
