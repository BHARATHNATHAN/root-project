# Backend

Express REST API for the full-stack foundation. This application installs, builds, tests, and deploys on its own. It does not belong to an npm workspace and does not share code with the frontend.

## Requirements

- Node.js 20 or newer
- MySQL 8 or newer for local development and integration tests

## Installation

```text
cd backend
npm install
```

Copy the example environment file and edit it:

```text
copy .env.example .env
```

On macOS or Linux, use `cp .env.example .env`.

## Environment variables

| Variable              | Purpose                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- |
| `NODE_ENV`            | `development`, `test`, or `production`                                                |
| `PORT`                | HTTP port. Local default in the example file is `5000`                                |
| `CORS_ORIGIN`         | Browser origin allowed to call the API. Local Vite default is `http://localhost:5173` |
| `DB_HOST`             | MySQL host                                                                            |
| `DB_PORT`             | MySQL port, usually `3306`                                                            |
| `DB_NAME`             | Database name                                                                         |
| `DB_USER`             | Database user                                                                         |
| `DB_PASSWORD`         | Database password. The variable must be present. An empty value is allowed            |
| `DB_CONNECTION_LIMIT` | Maximum connections in the pool                                                       |

The process reads environment variables only through `src/config/env.ts`. Database pool options are built in `src/config/database.config.ts`. Do not commit `.env`.

Startup fails if a required variable is missing or invalid.

## MySQL setup

Create a database and user before starting the API. Example for local development:

```sql
CREATE DATABASE app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app'@'localhost' IDENTIFIED BY 'change-me';
GRANT ALL PRIVILEGES ON app.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```

Match `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` to that instance. The API opens one `mysql2` connection pool and reuses it. Queries from repositories must pass values separately from SQL text.

This skeleton does not create business tables. `npm run db:migrate` creates only the `schema_migrations` tracking table and applies future files in `src/database/migrations/`. The server does not migrate on startup.

## Development

```text
npm run dev
```

The process listens on `PORT` and reloads when source files change.

## Production build

```text
npm run build
npm start
```

`npm run build` compiles TypeScript to `dist/`. `npm start` runs `node dist/main.js`.

## API endpoints

### `GET /api/v1/health`

Checks that the process is running and that MySQL answers `SELECT 1`. It does not read application tables.

Connected:

```json
{
  "status": "ok",
  "service": "backend",
  "database": "connected",
  "timestamp": "2026-09-25T12:00:00.000Z"
}
```

HTTP 200.

MySQL unavailable:

```json
{
  "status": "degraded",
  "service": "backend",
  "database": "disconnected",
  "timestamp": "2026-09-25T12:00:00.000Z"
}
```

HTTP 503.

Unknown routes return:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found"
  },
  "requestId": "..."
}
```

Every response includes an `X-Request-Id` header. Production error JSON does not include stack traces.

## Testing

Unit tests do not need MySQL. They call the health route with an injected database check.

```text
npm test
```

Integration tests open the real pool. Copy `.env.example` to `.env`, point it at a running MySQL 8 database, then run:

```text
npm run test:integration
```

`npm test` does not run `tests/database/`.

## Graceful shutdown

`SIGINT` and `SIGTERM` stop the HTTP server from accepting new connections, close the MySQL pool, and exit. Shutdown gives the pool up to 10 seconds to close.

## Scripts

```text
npm run dev
npm run build
npm start
npm test
npm run test:integration
npm run db:migrate
npm run lint
npm run format
```
