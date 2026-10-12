import type { PoolOptions } from 'mysql2/promise';
import { getDatabaseEnv } from './env.js';

export function getDatabaseConfig(): PoolOptions {
  const database = getDatabaseEnv();

  return {
    host: database.host,
    port: database.port,
    database: database.name,
    user: database.user,
    password: database.password,
    connectionLimit: database.connectionLimit,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: 'utf8mb4',
    timezone: 'Z',
    multipleStatements: false,
  };
}
