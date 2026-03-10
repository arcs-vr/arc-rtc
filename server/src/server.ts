import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'node:http'
import { PeerServer } from 'peer'
import { randomUUID } from 'node:crypto'

const PORT = 3000
const AUTH_COOKIE = 'peerjs_auth'
const COOKIE_TTL = 15 * 60 * 1000
const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000

const app = express()
const httpServer = createServer(app)

// Session store: sessionId -> { createdAt: timestamp }
const sessions = new Map<string, { createdAt: number }>()

// Connection attempt tracker: sessionId -> { count, timestamp }
const connectionAttempts = new Map<string, { count: number; timestamp: number }>()

function generateSessionId(): string {
  return randomUUID()
}

function createSession(): string {
  const id = generateSessionId()
  sessions.set(id, { createdAt: Date.now() })
  return id
}

function validateSession(sessionId: string): boolean {
  const session = sessions.get(sessionId)
  if (!session) {
    return false
  }

  if (Date.now() - session.createdAt > COOKIE_TTL) {
    sessions.delete(sessionId)
    return false
  }

  session.createdAt = Date.now()
  return true
}

function cleanupExpiredSessions(): void {
  const now = Date.now()
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > COOKIE_TTL) {
      sessions.delete(id)
    }
  }
}

function cleanupExpiredRateLimits(): void {
  const now = Date.now()
  for (const [id, record] of connectionAttempts.entries()) {
    if (now - record.timestamp > RATE_WINDOW) {
      connectionAttempts.delete(id)
    }
  }
}

// Clean up expired sessions every minute
setInterval(cleanupExpiredSessions, 60_000)
// Clean up expired rate limit records every minute
setInterval(cleanupExpiredRateLimits, 60_000)

function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const sessionId = req.cookies[AUTH_COOKIE]
  if (!sessionId) return next()

  const now = Date.now()
  const record = connectionAttempts.get(sessionId) || { count: 0, timestamp: now }

  if (now - record.timestamp > RATE_WINDOW) {
    record.count = 0
    record.timestamp = now
  }

  if (record.count >= RATE_LIMIT) {
    res.status(429).json({ error: 'Too many connection attempts' })
    return
  }

  record.count++
  connectionAttempts.set(sessionId, record)
  next()
}

// Auth middleware: validates the auth cookie and refreshes it on each request
function requireAuth (req: Request, res: Response, next: NextFunction): void {
  const cookie = req.cookies[AUTH_COOKIE]

  if (!cookie || !validateSession(cookie)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  res.cookie(AUTH_COOKIE, cookie, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: COOKIE_TTL,
  })

  next()
}

// Initialize session for new visitors
app.get('/session', (_req, res) => {
  const sessionId = createSession()
  res.cookie(AUTH_COOKIE, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: COOKIE_TTL,
  })
  res.json({ sessionId })
})

app.use(cors({
  credentials: true,
  origin: true,
}))
app.use(cookieParser())
app.use(express.static('public'))

const peerServer = PeerServer({
  path: '/',
})

peerServer.on("connection", (client) => {
  console.log("Client connected:", client.getId());
});

peerServer.on("disconnect", (client) => {
  console.log("Client disconnected:", client.getId());
});

peerServer.on('error', (err) => {
  console.error('PeerJS error:', err)
})

app.use('/session', requireAuth)
app.use('/', rateLimit, requireAuth, peerServer)

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})