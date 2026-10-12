interface StackItem {
  name: string;
  description: string;
}

const stack: readonly StackItem[] = [
  { name: 'Frontend', description: 'React, TypeScript, Vite, Tailwind CSS, React Router' },
  { name: 'Backend', description: 'Node.js, Express, TypeScript, REST API' },
  { name: 'Database', description: 'MySQL 8 through a mysql2 connection pool' },
];

export function AboutPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <p className="mt-3 text-base text-slate-600">
        The frontend and backend are separate applications. Each one installs, builds, tests, and
        deploys on its own, and they communicate only over HTTP.
      </p>

      <dl className="mt-8 space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {stack.map((item) => (
          <div key={item.name}>
            <dt className="text-sm text-slate-500">{item.name}</dt>
            <dd className="text-lg font-medium">{item.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
