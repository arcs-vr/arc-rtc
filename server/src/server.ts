import type { Request } from 'express'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { createServer } from 'node:http'

import { AUTH_COOKIE, COOKIE_TTL, PEERJS_PATH, PORT, RATE_LIMIT, RATE_WINDOW, } from './config'

import { createPeerServer } from './middlewares/peer.js'
import { rateLimit } from 'express-rate-limit'

const app = express()
const httpServer = createServer(app)

const limiter = rateLimit({
  windowMs: RATE_WINDOW,
  limit: RATE_LIMIT,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.sessionID ?? '',
})

const peerServer = createPeerServer(PEERJS_PATH)

app.use(cors({
  credentials: true,
  origin: true,
}))
app.use(cookieParser())
app.use(express.static('public'))
app.set('trust proxy', 1)

app.use(session({
  name: AUTH_COOKIE,
  secret: process.env.SESSION_SECRET ?? 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: COOKIE_TTL,
  },
}))

app.get('/session', (req, res) => {
  res.json({ sessionId: req.sessionID })
})

app.use(PEERJS_PATH, limiter, peerServer)

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})