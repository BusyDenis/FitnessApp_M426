import { Router } from 'express'
import {
  getAllLogs,
  getLogById,
  getLogsByExerciseId,
  getLogsByDateRange,
  createLog,
  updateLog,
  deleteLog,
} from '../services/logService.js'
import { requireAuth, AuthRequest } from '../middleware/auth.js'
import { db } from '../db/database.js'

export const logRoutes = Router()

// All log routes require authentication
logRoutes.use(requireAuth)

// GET /api/logs - Get all logs
logRoutes.get('/', (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const { exerciseId, startDate, endDate } = req.query
    
    let logs
    if (exerciseId && typeof exerciseId === 'string') {
      logs = getLogsByExerciseId(req.userId, exerciseId)
    } else if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
      logs = getLogsByDateRange(req.userId, startDate, endDate)
    } else {
      logs = getAllLogs(req.userId)
    }
    
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// GET /api/logs/:id - Get log by ID
logRoutes.get('/:id', (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const log = getLogById(req.params.id)
    if (!log) {
      res.status(404).json({ error: 'Log not found' })
      return
    }
    // Verify ownership (check if log belongs to user)
    const ownerCheck = db.prepare('SELECT user_id FROM logs WHERE id = ?').get(req.params.id) as { user_id: string } | undefined
    if (!ownerCheck || ownerCheck.user_id !== req.userId) {
      res.status(404).json({ error: 'Log not found' })
      return
    }
    res.json(log)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch log', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// POST /api/logs - Create new log entry
logRoutes.post('/', (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const log = req.body
    if (!log.id || !log.exerciseId || !log.dateISO || !log.sets || !log.credits) {
      res.status(400).json({ error: 'Missing required fields: id, exerciseId, dateISO, sets, credits' })
      return
    }
    const created = createLog(req.userId, log)
    res.status(201).json(created)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create log', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// PUT /api/logs/:id - Update log entry
logRoutes.put('/:id', (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const updated = updateLog(req.userId, req.params.id, req.body)
    if (!updated) {
      res.status(404).json({ error: 'Log not found' })
      return
    }
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update log', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// DELETE /api/logs/:id - Delete log entry
logRoutes.delete('/:id', (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const deleted = deleteLog(req.userId, req.params.id)
    if (!deleted) {
      res.status(404).json({ error: 'Log not found' })
      return
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete log', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

