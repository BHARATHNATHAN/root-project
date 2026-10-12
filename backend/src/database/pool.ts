import mysql, { type Pool } from 'mysql2/promise';
import { getDatabaseConfig } from '../config/database.config.js';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool(getDatabaseConfig());
  }

  return pool;
}

export async function closePool(): Promise<void> {
  if (!pool) {
    return;
  }

  const current = pool;
  pool = null;
  await current.end();
}
