import type { RowDataPacket } from 'mysql2/promise';
import { getPool } from './pool.js';

export type DatabaseHealth = 'connected' | 'disconnected';

interface PingRow extends RowDataPacket {
  ok: number;
}

export async function pingDatabase(): Promise<DatabaseHealth> {
  try {
    const pool = getPool();
    const [rows] = await pool.query<PingRow[]>('SELECT 1 AS ok');
    return rows[0]?.ok === 1 ? 'connected' : 'disconnected';
  } catch {
    return 'disconnected';
  }
}
