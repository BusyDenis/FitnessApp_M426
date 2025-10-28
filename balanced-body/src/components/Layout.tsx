import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../lib/api'

export default function Layout() {
  const navigate = useNavigate()
  const userStr = localStorage.getItem('bb_user')
  const user = userStr ? JSON.parse(userStr) : null

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-full flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BB</span>
              </div>
              <span className="font-bold text-xl gradient-text">BalancedBody</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
              <NavLink 
                to="/" 
                end 
                className={({isActive}) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/exercises" 
                className={({isActive}) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                Exercises
              </NavLink>
              <NavLink 
                to="/log" 
                className={({isActive}) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                Log
              </NavLink>
              <NavLink 
                to="/progress" 
                className={({isActive}) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                Progress
              </NavLink>
              </div>
              
              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <span className="text-sm text-slate-600">{user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-slate-500">
            BalancedBody Coach • Track your fitness journey
          </p>
        </div>
      </footer>
    </div>
  )
}


