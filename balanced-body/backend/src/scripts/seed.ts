import { initDatabase } from '../db/database.js'
import { createExercises } from '../services/exerciseService.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import type { Exercise } from '../models/exercise.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read seed data from frontend
const seedPath = join(__dirname, '../../../src/data/exercises.seed.json')
const seedData = JSON.parse(readFileSync(seedPath, 'utf-8')) as Exercise[]

console.log('🌱 Seeding database...')

// Initialize database
initDatabase()

// Check if exercises already exist
const { getExerciseCount } = await import('../services/exerciseService.js')
const count = getExerciseCount()

if (count > 0) {
  console.log(`⚠️  Database already contains ${count} exercises. Skipping seed.`)
  console.log('💡 Delete the database file to re-seed.')
} else {
  // Insert exercises
  createExercises(seedData)
  console.log(`✅ Seeded ${seedData.length} exercises`)
}

console.log('✨ Database ready!')

