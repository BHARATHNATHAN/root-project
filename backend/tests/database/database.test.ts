import { afterAll, describe, expect, it } from 'vitest';
import { pingDatabase } from '../../src/database/connection.js';
import { closePool } from '../../src/database/pool.js';

describe('MySQL connectivity', () => {
  afterAll(async () => {
    await closePool();
  });

  it('reaches MySQL with SELECT 1', async () => {
    const status = await pingDatabase();
    expect(status).toBe('connected');
  });
});
