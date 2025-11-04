import express from 'express'
import cors from 'cors'
import { exerciseRoutes } from './routes/exercises.js'
import { logRoutes } from './routes/logs.js'
import { authRoutes } from './routes/auth.js'
import { initDatabase } from './db/database.js'
import { deleteExpiredSessions } from './services/userService.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Clean up expired sessions on startup and every hour
deleteExpiredSessions()
setInterval(deleteExpiredSessions, 60 * 60 * 1000)

// Initialize database
initDatabase()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use('/api/logs', logRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal server error', message: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})

