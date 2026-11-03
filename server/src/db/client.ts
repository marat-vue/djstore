import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

export function createDatabase(filename: string) {
  const sqlite = new Database(filename);
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('journal_mode = WAL');

  return {
    sqlite,
    db: drizzle(sqlite, { schema }),
  };
}

export type DatabaseContext = ReturnType<typeof createDatabase>;
