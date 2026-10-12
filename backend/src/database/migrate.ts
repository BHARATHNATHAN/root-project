import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql, { type RowDataPacket } from 'mysql2/promise';
import { getDatabaseConfig } from '../config/database.config.js';
import { loadEnv } from '../config/env.js';
import { logger } from '../lib/logger.js';

const MIGRATION_FILE = /^\d{3}_[a-z0-9_]+\.sql$/i;

async function resolveMigrationsDirectory(): Promise<string> {
  const besideModule = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

  try {
    await readdir(besideModule);
    return besideModule;
  } catch {
    return path.resolve('src/database/migrations');
  }
}

interface MigrationRow extends RowDataPacket {
  name: string;
}

export async function runMigrations(): Promise<void> {
  loadEnv();
  const config = getDatabaseConfig();
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    charset: 'utf8mb4',
    multipleStatements: true,
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const migrationsDirectory = await resolveMigrationsDirectory();
    const entries = await readdir(migrationsDirectory);
    const files = entries.filter((name) => MIGRATION_FILE.test(name)).sort();
    const [appliedRows] = await connection.query<MigrationRow[]>(
      'SELECT name FROM schema_migrations',
    );
    const applied = new Set(appliedRows.map((row) => row.name));

    for (const file of files) {
      if (applied.has(file)) {
        continue;
      }

      const sql = await readFile(path.join(migrationsDirectory, file), 'utf8');
      try {
        await connection.beginTransaction();
        await connection.query(sql);
        await connection.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
        await connection.commit();
        logger.info('migration applied', { file });
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }
  } finally {
    await connection.end();
  }
}

runMigrations().catch((error: unknown) => {
  logger.error('migration failed', {
    message: error instanceof Error ? error.message : 'Unknown error',
  });
  process.exit(1);
});
