import { Router } from 'express'
import {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../services/exerciseService.js'

export const exerciseRoutes = Router()

// GET /api/exercises - Get all exercises
exerciseRoutes.get('/', (_req, res) => {
  try {
    const exercises = getAllExercises()
    res.json(exercises)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercises', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// GET /api/exercises/:id - Get exercise by ID
exerciseRoutes.get('/:id', (req, res) => {
  try {
    const exercise = getExerciseById(req.params.id)
    if (!exercise) {
      res.status(404).json({ error: 'Exercise not found' })
      return
    }
    res.json(exercise)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// POST /api/exercises - Create new exercise
exerciseRoutes.post('/', (req, res) => {
  try {
    const exercise = req.body
    if (!exercise.id || !exercise.name) {
      res.status(400).json({ error: 'Missing required fields: id, name' })
      return
    }
    const created = createExercise(exercise)
    res.status(201).json(created)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exercise', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// PUT /api/exercises/:id - Update exercise
exerciseRoutes.put('/:id', (req, res) => {
  try {
    const updated = updateExercise(req.params.id, req.body)
    if (!updated) {
      res.status(404).json({ error: 'Exercise not found' })
      return
    }
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exercise', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// DELETE /api/exercises/:id - Delete exercise
exerciseRoutes.delete('/:id', (req, res) => {
  try {
    const deleted = deleteExercise(req.params.id)
    if (!deleted) {
      res.status(404).json({ error: 'Exercise not found' })
      return
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exercise', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

