import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { getHttpEnv } from '../config/env.js';
import { errorMiddleware } from '../middleware/error.middleware.js';
import { notFoundMiddleware } from '../middleware/not-found.middleware.js';
import { requestIdMiddleware } from '../middleware/request-id.middleware.js';
import { requestLoggerMiddleware } from '../middleware/request-logger.middleware.js';
import type { CheckDatabase } from '../modules/health/health.service.js';
import { createApiRouter } from '../routes/index.js';

export interface AppDependencies {
  checkDatabase?: CheckDatabase;
}

export function createApp(dependencies: AppDependencies = {}): Express {
  const env = getHttpEnv();
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Accept', 'Content-Type', 'X-Request-Id'],
    }),
  );
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(express.json({ limit: '100kb' }));
  app.use('/api/v1', createApiRouter(dependencies.checkDatabase));
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
