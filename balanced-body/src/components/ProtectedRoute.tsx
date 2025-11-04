import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser, getLogs } from '../lib/api'
import { useStore } from '../state/store'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { dispatch } = useStore()
  const token = localStorage.getItem('bb_token')

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false)
      return
    }

    // Verify token is still valid and load user data
    getCurrentUser()
      .then(async () => {
        setIsAuthenticated(true)
        // Reload logs after successful auth
        try {
          const logs = await getLogs()
          dispatch({ type: 'SET_LOGS', logs })
        } catch {
          // Logs might be empty, that's okay
        }
      })
      .catch(() => {
        localStorage.removeItem('bb_token')
        localStorage.removeItem('bb_user')
        setIsAuthenticated(false)
      })
  }, [token, dispatch])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Lädt...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

