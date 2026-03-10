# Why We Protect the RTC Service

## The Threat Landscape

Our PeerJS server is a shared resource that enables real-time communication between users. Without proper protections, it becomes vulnerable to multiple attack vectors that could:

1. **Deplete server resources** through connection flooding
2. **Enable abuse** for unrelated applications
3. **Compromise user security** through unauthorized access
4. **Degrade performance** for legitimate users

## Why We Need These Specific Protections

### 1. Session Authentication

**Threat:** Anyone on the internet could connect to our PeerJS server. Without authentication, a malicious actor could:
- Use our server as a free RTC backend for their own application
- Launch attacks against other peers through our infrastructure
- Consume bandwidth and CPU resources without accountability

**Solution:** Cookie-based sessions create an accountability layer. While still anonymous (no login required), each connection is tied to a server-tracked session that can be monitored, rate-limited, and revoked.

### 2. Rate Limiting

**Threat:** Connection attempts are cheap for attackers. A single malicious IP could:
- Open hundreds of connections per second
- Exhaust server memory and file descriptors
- Cause denial of service for legitimate users
- Trigger PeerJS relay costs (if applicable)

**Solution:** 10 connections per minute per session prevents abuse while allowing normal usage. This is a "soft" limit that doesn't block users but makes automated attacks impractical.

### 3. In-Memory Session Store (vs. No Store)

**Threat:** Without session tracking, we cannot:
- Detect replay attacks (stolen session reuse)
- Implement graceful session expiration
- Clean up stale connections
- Provide any audit trail

**Solution:** Server-side sessions allow us to validate, refresh, and expire connections deterministically.

### 4. Secure Cookie Flags

**Threat:** Plain cookies are vulnerable to:
- **XSS theft**: JavaScript could read and exfiltrate session cookies
- **CSRF**: Cross-site requests could hijack sessions
- **Person-in-the-middle**: Unencrypted transmission allows interception

**Solution:**
- `httpOnly`: JavaScript cannot access the cookie (mitigates XSS)
- `secure`: Only sent over HTTPS (prevents MITM on modern browsers)
- `SameSite: strict`: Blocks cross-site request forgery

## Why Not Simpler Approaches?

### "Trust All Connections"
**Problem:** Once connected, a malicious client can:
- Send arbitrary data to other peers
- Impersonate legitimate users
- Use our infrastructure for spam or attacks
- We have no way to distinguish friend from foe

### "IP-Based Rate Limiting Only"
**Problem:**
- Modern networks share IPs (NAT, mobile carriers, offices)
- A single attacker can rotate IPs easily
- Legitimate users behind shared IPs get collateral-banned
- Doesn't solve the "unauthorized application" problem

### "Require User Login"
**Problem:**
- Creates friction for anonymous use cases
- Requires user data storage and compliance (GDPR, etc.)
- Overkill for a simple RTC relay service
- Our session approach achieves security without identity

## Why Not Stronger Protections?

### "Strict Payload Validation"
We chose to allow all messages because:
- The PeerJS protocol itself is already constrained to data connections
- Our application-level protocol (event IDs) provides natural boundaries
- Adding schema validation increases complexity without proportional benefit
- The rate limit and auth provide sufficient abuse prevention

### "Redis for Sessions"
We use in-memory storage because:
- Single-instance deployment is typical for this scale
- Sessions are short-lived (15 minutes)
- Redis adds infrastructure complexity and failure points
- Can migrate to Redis later if needed

## The Balance

This security model achieves:

| Goal                      | Achieved? | How                                           |
|---------------------------|-----------|-----------------------------------------------|
| Anonymous use             | Yes       | No login required, cookie-only                |
| Prevent unauthorized apps | Yes       | Auth middleware rejects unauthenticated peers |
| Prevent flooding          | Yes       | Rate limiting per session                     |
| Low friction              | Yes       | Session obtained automatically                |
| Minimal infrastructure    | Yes       | In-memory, no external services               |

## When to Strengthen Further

Consider additional protections if:
- Attackers circumvent rate limits (add IP-based limits)
- Performance degrades under load (move to Redis, add caching)
- Specific abuse patterns emerge (add payload validation, connection whitelisting)
- Multiple server instances (add Redis session store)

## Summary

We protect the RTC service not because we distrust users, but because shared resources require guardrails. This implementation provides a reasonable security baseline that:

1. Allows legitimate anonymous use
2. Makes abuse inconvenient without blocking users
3. Uses minimal infrastructure
4. Can be strengthened incrementally if needed