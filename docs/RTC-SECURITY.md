# RTC Server Security

## Overview

This document describes the security measures implemented for the PeerJS RTC server to allow anonymous usage while preventing abuse.

## Authentication Flow

1. **Session Cookie**: When a client first accesses `/session`, the server generates a UUID session ID and sets an httpOnly, secure, SameSite=strict cookie
2. **Validation**: All PeerJS connections must include a valid session cookie
3. **Refresh**: The session cookie and server-side session are refreshed on each request

## Security Features

### 1. Session Management
- Session IDs are cryptographically random UUIDs
- Sessions expire after 15 minutes of inactivity
- Expired sessions are cleaned up every 60 seconds
- Sessions are stored in-memory (consider Redis for production scale)

### 2. Rate Limiting
- Maximum 10 connection attempts per session per 60-second window
- Returns HTTP 429 (Too Many Requests) when limit exceeded

### 3. Cookie Security
- `httpOnly`: Prevents JavaScript access (mitigates XSS cookie theft)
- `secure`: Only sent over HTTPS (disable for local development)
- `SameSite: strict`: Prevents CSRF attacks

## Files Modified

- `server/src/server.ts` - Server-side session management, rate limiting, auth middleware
- `demo/src/composables/usePeerReceiver.ts` - Client receives session cookie before connecting
- `demo/src/composables/usePeerEmitter.ts` - Client receives session cookie before connecting

## Usage

### Client-side Session Initialization

```typescript
// Automatically called before PeerJS connection
await fetch('/session', {
  credentials: 'include', // includes cookies
  method: 'GET'
})
```

### Server Configuration

```typescript
// Session store (in-memory)
const sessions = new Map<string, { createdAt: number }>()

// Rate limiting
const RATE_LIMIT = 10        // max connections per window
const RATE_WINDOW = 60000    // 1 minute in ms
const COOKIE_TTL = 15 * 60 * 1000  // 15 minutes
```

## Verification

```bash
# Start server
cd server && yarn dev

# Test session creation
curl -c cookies.txt http://localhost:3000/session

# Test authenticated connection (should succeed)
# PeerJS client with valid cookie will connect

# Test unauthenticated connection (should fail)
# PeerJS client without cookie receives 401
```

## Production Considerations

1. **HTTPS**: Ensure `secure: true` cookie flag is appropriate (disable for local dev)
2. **Session Store**: Replace in-memory Map with Redis for multi-instance deployments
3. **CORS**: Restrict `origin: true` to specific origins
4. **Rate Limiting**: Adjust `RATE_LIMIT` and `RATE_WINDOW` based on expected traffic
5. **Monitoring**: Add logging for failed auth attempts and rate limit violations