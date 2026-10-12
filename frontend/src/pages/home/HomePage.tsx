import { useEffect, useState } from 'react';
import { getHealth } from '../../services/api/health.api';
import type { HealthResponse } from '../../types/health';

type PageState =
  | { kind: 'loading' }
  | { kind: 'success'; health: HealthResponse }
  | { kind: 'failure'; message: string };

function backendLabel(status: HealthResponse['status']): string {
  return status === 'ok' ? 'Healthy' : 'Degraded';
}

function databaseLabel(status: HealthResponse['database']): string {
  return status === 'connected' ? 'Connected' : 'Disconnected';
}

export function HomePage() {
  const [state, setState] = useState<PageState>({ kind: 'loading' });

  useEffect(() => {
    let active = true;

    getHealth()
      .then((health) => {
        if (active) {
          setState({ kind: 'success', health });
        }
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Health check failed';
        setState({ kind: 'failure', message });
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-xl">
      <p className="text-sm font-medium tracking-wide text-slate-500 uppercase">Application</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Production-Ready Full Stack Foundation
      </h1>
      <p className="mt-3 text-base text-slate-600">
        Independent React and Express applications sharing a MySQL-backed health check.
      </p>

      <section
        aria-live="polite"
        className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        {state.kind === 'loading' ? <p>Checking backend health…</p> : null}

        {state.kind === 'failure' ? (
          <p className="text-red-700">Health check failed. {state.message}</p>
        ) : null}

        {state.kind === 'success' ? (
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-slate-500">Backend Status</dt>
              <dd className="text-lg font-medium">{backendLabel(state.health.status)}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Database Status</dt>
              <dd className="text-lg font-medium">{databaseLabel(state.health.database)}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Last Checked</dt>
              <dd className="text-lg font-medium">
                <time dateTime={state.health.timestamp}>{state.health.timestamp}</time>
              </dd>
            </div>
          </dl>
        ) : null}
      </section>
    </div>
  );
}
