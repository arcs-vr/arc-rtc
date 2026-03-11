import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { AUTH_COOKIE, COOKIE_TTL } from '../config'

export interface SessionRecord {
  createdAt: number
}

export interface SessionStore extends Map<string, SessionRecord> {}

export function generateSessionId (): string {
  return randomUUID()
}

export function getSessionId (req: Request, cookieName: string): string | null {
  const cookie = req.cookies[cookieName]

  if (!cookie) {
    return null
  }

  return cookie
}

export function createSession (store: SessionStore): string {
  const id = generateSessionId()
  store.set(id, { createdAt: Date.now() })
  return id
}

function validateSession (
  sessionId: string,
  store: SessionStore,
  cookieTtl: number
): boolean {
  const session = store.get(sessionId)
  if (!session) {
    return false
  }

  if (Date.now() - session.createdAt > cookieTtl) {
    store.delete(sessionId)
    return false
  }

  session.createdAt = Date.now()
  return true
}

export function useValidSession (sessions: SessionStore, ttl: number, cookieName: string) {
  return {
    endpoint (req: Request, res: Response) {
      let sessionId = getSessionId(req, AUTH_COOKIE)
      if (!sessionId) {
        sessionId = createSession(sessions)
      }

      // Create or extend the auth
      res.cookie(AUTH_COOKIE, sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: COOKIE_TTL,
      })

      res.json({ sessionId })
    },
    middleware (req: Request, res: Response, next: NextFunction) {
      const cookie = getSessionId(req, cookieName)

      if (!cookie || !validateSession(cookie, sessions, ttl)) {
        res.status(401).json({ error: 'Unauthorized' })
        return null
      }

      return next()
    }
  }
}

export function cleanupExpiredSessions (
  store: SessionStore,
  cookieTtl: number
): void {
  const now = Date.now()
  for (const [id, session] of store.entries()) {
    if (now - session.createdAt > cookieTtl) {
      store.delete(id)
    }
  }
}