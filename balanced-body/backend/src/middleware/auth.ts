import { Request, Response, NextFunction } from 'express'
import { getSession } from '../services/userService.js'

export interface AuthRequest extends Request {
  userId?: string
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'No valid token provided' })
    return
  }

  const token = authHeader.substring(7)
  const session = getSession(token)
  
  if (!session) {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' })
    return
  }

  req.userId = session.userId
  next()
}

