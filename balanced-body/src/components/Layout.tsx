import { Link, NavLink, Outlet } from 'react-router-dom'
import { routeTable } from '../routes/routeTable'

export default function Layout() {
    const navRoutes = routeTable.filter((r) => r.inNav)

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        [
            'px-2 py-1 rounded transition-colors',
            'hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            isActive ? 'text-blue-600 font-medium bg-slate-100' : 'text-slate-600',
        ].join(' ')

    return (
        <div className="min-h-full flex flex-col">
            <nav className="sticky top-0 z-10 bg-white border-b">
                <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
                    <Link to="/" className="font-bold text-lg">
                        BalancedBody
                    </Link>

                    <div className="flex gap-2 text-sm">
                        {navRoutes.map((r) =>
                            r.index ? (
                                <NavLink key="__index" to="/" end className={linkClass}>
                                    {r.label ?? 'Home'}
                                </NavLink>
                            ) : (
                                <NavLink key={r.path ?? '__unknown'} to={`/${r.path}`} className={linkClass}>
                                    {r.label ?? r.path}
                                </NavLink>
                            )
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-1 mx-auto max-w-5xl w-full p-4">
                <Outlet />
            </main>

            <footer className="text-center text-xs text-slate-500 py-4">
                Local-only MVP • no login
            </footer>
        </div>
    )
}
