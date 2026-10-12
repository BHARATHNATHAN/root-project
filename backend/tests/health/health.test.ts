import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app/app.js';

describe('GET /api/v1/health', () => {
  it('returns ok when the database check succeeds', async () => {
    const app = createApp({
      checkDatabase: async () => 'connected',
    });

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      service: 'backend',
      database: 'connected',
    });
    expect(response.body.timestamp).toEqual(expect.any(String));
    expect(response.headers['x-request-id']).toEqual(expect.any(String));
  });

  it('returns degraded when the database check fails', async () => {
    const app = createApp({
      checkDatabase: async () => 'disconnected',
    });

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({
      status: 'degraded',
      service: 'backend',
      database: 'disconnected',
    });
    expect(response.body.timestamp).toEqual(expect.any(String));
  });

  it('returns a not-found envelope for unknown routes', async () => {
    const app = createApp({
      checkDatabase: async () => 'connected',
    });

    const response = await request(app).get('/api/v1/missing');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: 'RESOURCE_NOT_FOUND',
        message: 'Resource not found',
      },
    });
    expect(response.body.requestId).toEqual(expect.any(String));
  });
});
