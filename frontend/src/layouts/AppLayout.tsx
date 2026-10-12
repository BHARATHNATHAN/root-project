import { NavLink, Outlet } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
}

const navItems: readonly NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
];

function navLinkClass({ isActive }: { isActive: boolean }): string {
  const base = 'rounded-md px-3 py-2 text-sm font-medium transition-colors';
  return isActive
    ? `${base} bg-slate-900 text-white`
    : `${base} text-slate-600 hover:bg-slate-200 hover:text-slate-900`;
}

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="text-base font-semibold tracking-tight">Application</span>
          <nav aria-label="Main">
            <ul className="flex gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}
