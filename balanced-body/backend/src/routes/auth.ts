import { Router, Request, Response } from 'express'
import { createUser, authenticateUser, createSession, deleteSession, getUserById } from '../services/userService.js'
import { requireAuth, AuthRequest } from '../middleware/auth.js'

export const authRoutes = Router()

// POST /api/auth/register - Register new user
authRoutes.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      res.status(400).json({ error: 'Missing required fields: username, password' })
      return
    }

    const result = await createUser(username, password)
    
    if (result.error) {
      res.status(400).json({ error: result.error })
      return
    }

    // Create session
    const session = createSession(result.user.id!)

    res.status(201).json({
      user: result.user,
      token: session.token,
      expiresAt: session.expiresAt.toISOString(),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// POST /api/auth/login - Login user
authRoutes.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      res.status(400).json({ error: 'Missing required fields: username, password' })
      return
    }

    const result = await authenticateUser(username, password)
    
    if (result.error || !result.user) {
      res.status(401).json({ error: result.error || 'Invalid credentials' })
      return
    }

    // Create session
    const session = createSession(result.user.id!)

    res.json({
      user: result.user,
      token: session.token,
      expiresAt: session.expiresAt.toISOString(),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to login', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// POST /api/auth/logout - Logout user
authRoutes.post('/logout', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      deleteSession(token)
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

// GET /api/auth/me - Get current user
authRoutes.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const user = getUserById(req.userId)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ user })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user', message: error instanceof Error ? error.message : 'Unknown error' })
  }
})

