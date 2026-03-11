import type { Request } from 'express'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'node:http'

import { AUTH_COOKIE, COOKIE_TTL, PEERJS_PATH, PORT, RATE_LIMIT, RATE_WINDOW, } from './config'

import {
  cleanupExpiredSessions,
  generateSessionId,
  getSessionId,
  type SessionStore,
  useValidSession,
} from './middlewares/session.js'

import { createPeerServer } from './middlewares/peer.js'
import { rateLimit } from 'express-rate-limit'

const app = express()
const httpServer = createServer(app)

const sessions: SessionStore = new Map()

const limiter = rateLimit({
  windowMs: RATE_WINDOW,
  limit: RATE_LIMIT,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req: Request) => getSessionId(req, AUTH_COOKIE) ?? generateSessionId(),
})

const {
  middleware: sessionValidator,
  endpoint: getSession
} = useValidSession(sessions, COOKIE_TTL, AUTH_COOKIE)

const peerServer = createPeerServer(PEERJS_PATH)

app.use(cors({
  credentials: true,
  origin: true,
}))
app.use(cookieParser())
app.use(express.static('public'))
app.set('trust proxy', 1)

app.get('/session', getSession)
app.use(PEERJS_PATH, sessionValidator, limiter, peerServer)

cleanupExpiredSessions(sessions, COOKIE_TTL)
setInterval(cleanupExpiredSessions, 60_000)

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})