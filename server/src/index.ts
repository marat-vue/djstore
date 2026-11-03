import { loadConfig } from './config.js';
import { createDatabase } from './db/client.js';
import { migrateDatabase } from './db/migrate.js';
import { createApp } from './app.js';

const config = loadConfig();
const database = createDatabase(config.databaseUrl);
migrateDatabase(database);

const server = createApp(database, config).listen(config.port, () => {
  console.log(`DJ Store API is listening on http://localhost:${config.port}`);
});

function shutdown() {
  server.close(() => {
    database.sqlite.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
