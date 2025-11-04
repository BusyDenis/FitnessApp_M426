import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './routes/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { routeTable, notFoundRoute } from './routes/routeTable'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {routeTable.map((route) => (
          <Route
            key={route.path || 'index'}
            index={route.index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
      <Route path={notFoundRoute.path} element={notFoundRoute.element} />
    </Routes>
  )
}
