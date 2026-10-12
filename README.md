# Full-Stack Foundation

Two independent applications: a React frontend and an Express API with MySQL. There is no root `package.json`, no npm workspace, and no shared package. Install, build, test, and deploy each application on its own.

## Architecture

The browser talks only to the frontend. The frontend calls the backend over HTTP. The backend is the only process that opens MySQL.

```text
Browser
  -> React (Vite)
    -> HTTP client
      -> Express API
        -> health service
          -> MySQL pool
            -> MySQL 8
```

Business SQL, when you add it, stays in repositories. Routes, controllers, and React components do not open database connections or write queries.

Details, request flow, and extension points are in [docs/architecture.md](docs/architecture.md).

## Applications

| Directory | Role |
| --- | --- |
| [frontend](frontend/README.md) | React, TypeScript, Vite, Tailwind, React Router |
| [backend](backend/README.md) | Express, TypeScript, REST, mysql2 connection pool |

## MySQL

The backend uses `mysql2/promise` and one shared pool. Pool settings come from environment variables through `backend/src/config/database.config.ts`. The health check runs `SELECT 1`. It does not read application tables.

Local database example:

```sql
CREATE DATABASE app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'app'@'localhost' IDENTIFIED BY 'change-me';
GRANT ALL PRIVILEGES ON app.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```

Set the same values in `backend/.env`:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=app
DB_USER=app
DB_PASSWORD=change-me
DB_CONNECTION_LIMIT=10
```

There is no ORM. Future schema changes are SQL files in `backend/src/database/migrations/`, applied with `npm run db:migrate` from the backend directory. The API does not migrate on startup.

## Setup

Use two terminals. Node.js 20 or newer is required. MySQL 8 or newer is required for a running API and for backend integration tests.

Terminal 1:

```text
cd backend
npm install
copy .env.example .env
npm run dev
```

Terminal 2:

```text
cd frontend
npm install
copy .env.example .env
npm run dev
```

On macOS or Linux, use `cp .env.example .env` instead of `copy`.

The API listens on port `5000`. The Vite app listens on port `5173`. `CORS_ORIGIN` must be `http://localhost:5173` so the browser can call the API. `VITE_API_BASE_URL` must be `http://localhost:5000`.

Open `http://localhost:5173`. The home page shows backend status, database status, and the health-check timestamp.

## Development commands

There is no root install and there are no root npm scripts.

Backend, from `backend/`:

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

Frontend, from `frontend/`:

```text
npm run dev
npm run build
npm run preview
npm test
npm run lint
npm run format
```

`npm test` in the backend does not need MySQL. `npm run test:integration` does. See the backend README.

## Folder structure

```text
.
├── docs/
│   └── architecture.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── config/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── about/
│   │   │   ├── home/
│   │   │   └── not-found/
│   │   ├── services/api/
│   │   ├── styles/
│   │   └── types/
│   ├── tests/
│   ├── package.json
│   └── vite.config.ts
└── backend/
    ├── src/
    │   ├── app/
    │   ├── config/
    │   ├── database/
    │   ├── errors/
    │   ├── lib/
    │   ├── middleware/
    │   ├── modules/health/
    │   ├── repositories/base/
    │   └── routes/
    ├── tests/
    └── package.json
```

## Health API

`GET /api/v1/health`

MySQL reachable:

```json
{
  "status": "ok",
  "service": "backend",
  "database": "connected",
  "timestamp": "2026-09-25T12:00:00.000Z"
}
```

HTTP 200.

MySQL unreachable:

```json
{
  "status": "degraded",
  "service": "backend",
  "database": "disconnected",
  "timestamp": "2026-09-25T12:00:00.000Z"
}
```

HTTP 503.

The frontend treats a JSON health body as a successful read and shows Healthy or Degraded. If the network request fails, the page shows a failure state.

## Environment configuration

Backend (`backend/.env.example`):

```text
NODE_ENV=
PORT=
CORS_ORIGIN=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_CONNECTION_LIMIT=
```

Frontend (`frontend/.env.example`):

```text
VITE_API_BASE_URL=
```

Do not commit `.env` files. Do not put database credentials in source code.
