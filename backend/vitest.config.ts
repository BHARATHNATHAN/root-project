import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/database/**'],
    env: {
      NODE_ENV: 'test',
      PORT: '5000',
      CORS_ORIGIN: 'http://localhost:5173',
    },
  },
});
