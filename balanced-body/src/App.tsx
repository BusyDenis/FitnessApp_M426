import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { Dashboard, Exercises, ExerciseDetail, Log, Progress } from './routes'
import Login from './routes/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="exercises/:id" element={<ExerciseDetail />} />
        <Route path="log" element={<Log />} />
        <Route path="progress" element={<Progress />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
