import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { loadConfig } from '../config.js';
import { createDatabase, type DatabaseContext } from './client.js';

const migrationsFolder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../drizzle');

export function migrateDatabase(database: DatabaseContext): void {
  const existing = database.sqlite.prepare(
    "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'core_venue'",
  ).get();

  // The repository ships with a Django-era SQLite database. Its table layout is
  // intentionally reused, so it must not be recreated by Drizzle.
  if (!existing) {
    migrate(database.db, { migrationsFolder });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const config = loadConfig();
  const database = createDatabase(config.databaseUrl);
  migrateDatabase(database);
  database.sqlite.close();
  console.log(`Database is ready: ${config.databaseUrl}`);
}
