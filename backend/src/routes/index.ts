import { Router } from 'express';
import { createHealthRouter } from '../modules/health/health.routes.js';
import type { CheckDatabase } from '../modules/health/health.service.js';

export function createApiRouter(checkDatabase?: CheckDatabase): Router {
  const router = Router();
  router.use('/health', createHealthRouter(checkDatabase));
  return router;
}
