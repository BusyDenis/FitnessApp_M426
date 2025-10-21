import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      <nav className="sticky top-0 z-10 bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-bold text-lg">BalancedBody</Link>
          <div className="flex gap-3 text-sm">
            <NavLink to="/" end className={({isActive}) => isActive ? 'text-blue-600' : 'text-slate-600'}>Dashboard</NavLink>
            <NavLink to="/exercises" className={({isActive}) => isActive ? 'text-blue-600' : 'text-slate-600'}>Exercises</NavLink>
            <NavLink to="/log" className={({isActive}) => isActive ? 'text-blue-600' : 'text-slate-600'}>Log</NavLink>
            <NavLink to="/progress" className={({isActive}) => isActive ? 'text-blue-600' : 'text-slate-600'}>Progress</NavLink>
              <NavLink
                  to="/routines/create"
                  className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-slate-600')}
              >
                  Routines
              </NavLink>
          </div>
        </div>
      </nav>
      <main className="flex-1 mx-auto max-w-5xl w-full p-4">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-slate-500 py-4">Local-only MVP • no login</footer>
    </div>
  )
}


