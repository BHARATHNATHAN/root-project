import type { Server } from 'node:http';
import { loadEnv } from '../config/env.js';
import { closePool } from '../database/pool.js';
import { logger } from '../lib/logger.js';
import { createApp } from './app.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

export function startServer(): Server {
  const env = loadEnv();
  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info('http server listening', { port: env.port });
  });

  bindShutdown(server);
  return server;
}

function bindShutdown(server: Server): void {
  let shuttingDown = false;

  const shutdown = (signal: NodeJS.Signals): void => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    logger.info('shutdown started', { signal });

    const forceExit = setTimeout(() => {
      logger.error('shutdown timed out');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    server.close((closeError) => {
      void finishShutdown(forceExit, closeError);
    });
  };

  process.on('SIGTERM', () => {
    shutdown('SIGTERM');
  });
  process.on('SIGINT', () => {
    shutdown('SIGINT');
  });
}

async function finishShutdown(
  forceExit: NodeJS.Timeout,
  closeError: Error | undefined,
): Promise<void> {
  try {
    await closePool();
    clearTimeout(forceExit);

    if (closeError) {
      logger.error('http server close failed', { message: closeError.message });
      process.exit(1);
    }

    logger.info('shutdown complete');
    process.exit(0);
  } catch (error) {
    clearTimeout(forceExit);
    logger.error('database pool close failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}
