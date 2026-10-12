import { pingDatabase, type DatabaseHealth } from '../../database/connection.js';
import type { HealthResponse } from './health.types.js';

export type CheckDatabase = () => Promise<DatabaseHealth>;

export async function getHealth(
  checkDatabase: CheckDatabase = pingDatabase,
): Promise<HealthResponse> {
  const database = await checkDatabase();

  return {
    status: database === 'connected' ? 'ok' : 'degraded',
    service: 'backend',
    database,
    timestamp: new Date().toISOString(),
  };
}
