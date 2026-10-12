export type HealthStatus = 'ok' | 'degraded';
export type DatabaseStatus = 'connected' | 'disconnected';

export interface HealthResponse {
  status: HealthStatus;
  service: 'backend';
  database: DatabaseStatus;
  timestamp: string;
}
