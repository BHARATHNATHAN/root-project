import type { HealthResponse } from '../../types/health';
import { ApiError, apiGet } from './client';

function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const status = candidate.status === 'ok' || candidate.status === 'degraded';
  const database = candidate.database === 'connected' || candidate.database === 'disconnected';

  return (
    status && candidate.service === 'backend' && database && typeof candidate.timestamp === 'string'
  );
}

export async function getHealth(): Promise<HealthResponse> {
  const body = await apiGet<unknown>('/api/v1/health', { acceptedStatuses: [503] });

  if (!isHealthResponse(body)) {
    throw new ApiError(0, 'The server returned an unexpected health payload');
  }

  return body;
}
