import type { NextFunction, Request, Response } from 'express';
import { getHealth, type CheckDatabase } from './health.service.js';

export function createHealthController(checkDatabase?: CheckDatabase) {
  return async function healthController(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const health = await getHealth(checkDatabase);
      res.status(health.status === 'ok' ? 200 : 503).json(health);
    } catch (error) {
      next(error);
    }
  };
}
