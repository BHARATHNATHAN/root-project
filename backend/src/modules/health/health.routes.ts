import { Router } from 'express';
import { createHealthController } from './health.controller.js';
import type { CheckDatabase } from './health.service.js';

export function createHealthRouter(checkDatabase?: CheckDatabase): Router {
  const router = Router();
  router.get('/', createHealthController(checkDatabase));
  return router;
}
