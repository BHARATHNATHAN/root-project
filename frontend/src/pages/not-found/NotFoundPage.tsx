import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="max-w-xl">
      <p className="text-sm font-medium tracking-wide text-slate-500 uppercase">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-base text-slate-600">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Back to home
      </Link>
    </div>
  );
}
