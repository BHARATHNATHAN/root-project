import { env } from '../../config/env';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ApiGetOptions {
  acceptedStatuses?: readonly number[];
}

export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
  const accepted = new Set<number>([200, ...(options.acceptedStatuses ?? [])]);
  let response: Response;

  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch {
    throw new ApiError(0, 'Unable to reach the server');
  }

  let body: unknown;
  try {
    body = (await response.json()) as unknown;
  } catch {
    throw new ApiError(response.status, 'The server returned an unreadable response');
  }

  if (!accepted.has(response.status)) {
    throw new ApiError(response.status, 'Request failed');
  }

  return body as T;
}
