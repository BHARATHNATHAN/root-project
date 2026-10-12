# Frontend

React application for the full-stack foundation. It has its own dependencies, TypeScript project, lint setup, tests, and build. It does not import backend source code.

## Requirements

- Node.js 20 or newer
- The backend API, when you want live health data

## Installation

```text
cd frontend
npm install
```

Copy the example environment file:

```text
copy .env.example .env
```

On macOS or Linux, use `cp .env.example .env`.

## Environment variables

`VITE_API_BASE_URL` is the origin of the backend, without a trailing path. The example value is:

```text
VITE_API_BASE_URL=http://localhost:5000
```

Components do not read this variable. `src/config/env.ts` is the only place that reads `import.meta.env`, and `src/services/api/client.ts` is the only place that calls `fetch`.

Vite inlines `VITE_` variables at build time. Set the variable in the environment you build for. Do not commit `.env`.

## Development

Start the backend first, then:

```text
npm run dev
```

Vite serves the app at `http://localhost:5173`. The home page calls `GET /api/v1/health` through `src/services/api/health.api.ts`.

The backend `CORS_ORIGIN` must allow `http://localhost:5173`.

## Pages and routing

| Path     | Page                                   | Purpose                            |
| -------- | -------------------------------------- | ---------------------------------- |
| `/`      | `src/pages/home/HomePage.tsx`          | Backend and database health        |
| `/about` | `src/pages/about/AboutPage.tsx`        | Static description of the stack    |
| `*`      | `src/pages/not-found/NotFoundPage.tsx` | Shown for any path without a route |

All pages render inside `src/layouts/AppLayout.tsx`, which provides the header and navigation. Routes are declared in `src/app/routes.tsx`. `src/app/router.tsx` wraps them in `BrowserRouter`.

To add a page:

1. Create the component under `src/pages/<name>/`.
2. Add a `<Route>` inside the layout route in `src/app/routes.tsx`.
3. Add a navigation entry in `navItems` in `src/layouts/AppLayout.tsx` if it should appear in the header.
4. If the page needs backend data, add a function in `src/services/api/` and call it from the page.

Static hosts must serve `index.html` for unknown paths so that direct links such as `/about` reach the client-side router.

## Production build

```text
npm run build
npm run preview
```

`npm run build` typechecks the project and writes static files to `dist/`. `npm run preview` serves that build locally. Deploy the `dist/` directory to any static host. This app does not need the backend repository at deploy time, only a reachable API base URL.

## Testing

```text
npm test
```

Tests mock the health API, so a running backend is not required.

- `tests/pages/HomePage.test.tsx` covers the initial render, the loading state, a successful health payload, and a failed request.
- `tests/app/routes.test.tsx` covers `/`, `/about`, and the not-found page, including the active navigation link.

## API configuration

| Piece                            | Responsibility                   |
| -------------------------------- | -------------------------------- |
| `VITE_API_BASE_URL`              | Backend origin                   |
| `src/config/env.ts`              | Reads and checks that variable   |
| `src/services/api/client.ts`     | Generic HTTP GET                 |
| `src/services/api/health.api.ts` | `GET /api/v1/health`             |
| `src/pages/home/HomePage.tsx`    | Loading, success, and failure UI |

A health JSON body is shown for both HTTP 200 and HTTP 503. Network failures and unexpected payloads use the failure state.

## Scripts

```text
npm run dev
npm run build
npm run preview
npm test
npm run lint
npm run format
```
