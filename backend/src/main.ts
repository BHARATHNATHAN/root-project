import { logger } from './lib/logger.js';
import { startServer } from './app/server.js';

try {
  startServer();
} catch (error) {
  logger.error('server failed to start', {
    message: error instanceof Error ? error.message : 'Unknown error',
  });
  process.exit(1);
}
