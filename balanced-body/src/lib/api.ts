const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export type ApiError = {
  error: string
  message?: string
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('bb_token')
  
  const existingHeaders = options.headers as Record<string, string> | undefined
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(existingHeaders || {}),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.message || error.error || `HTTP ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// Auth API
export async function register(username: string, password: string) {
  return apiRequest<{ user: { id: string; username: string }; token: string; expiresAt: string }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }
  )
}

export async function login(username: string, password: string) {
  return apiRequest<{ user: { id: string; username: string }; token: string; expiresAt: string }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }
  )
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } catch {
    // Ignore errors on logout
  } finally {
    localStorage.removeItem('bb_token')
    localStorage.removeItem('bb_user')
  }
}

export async function getCurrentUser() {
  return apiRequest<{ user: { id: string; username: string } }>('/auth/me')
}

// Exercises API
export async function getExercises() {
  return apiRequest<Array<{
    id: string
    name: string
    primary: string[]
    secondary: string[]
    equipment: string[]
    difficulty: 'easy' | 'med' | 'hard'
    instructions: string
  }>>('/exercises')
}

export async function getExerciseById(id: string) {
  return apiRequest<{
    id: string
    name: string
    primary: string[]
    secondary: string[]
    equipment: string[]
    difficulty: 'easy' | 'med' | 'hard'
    instructions: string
  }>(`/exercises/${id}`)
}

// Logs API
export async function getLogs(exerciseId?: string, startDate?: string, endDate?: string) {
  const params = new URLSearchParams()
  if (exerciseId) params.append('exerciseId', exerciseId)
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)
  
  const query = params.toString() ? `?${params.toString()}` : ''
  return apiRequest<Array<{
    id: string
    dateISO: string
    exerciseId: string
    sets: Array<{ reps: number; weightKg: number }>
    credits: Array<{ muscle: string; sets: number }>
    created_at?: string
  }>>(`/logs${query}`)
}

export async function createLog(log: {
  id: string
  dateISO: string
  exerciseId: string
  sets: Array<{ reps: number; weightKg: number }>
  credits: Array<{ muscle: string; sets: number }>
}) {
  return apiRequest<typeof log>('/logs', {
    method: 'POST',
    body: JSON.stringify(log),
  })
}

export async function updateLog(id: string, log: Partial<typeof createLog extends (...args: any[]) => Promise<infer T> ? T : never>) {
  return apiRequest(`/logs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(log),
  })
}

export async function deleteLog(id: string) {
  return apiRequest(`/logs/${id}`, {
    method: 'DELETE',
  })
}

