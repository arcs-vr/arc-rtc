# Build stage: install dependencies and build demo app
FROM node:24-alpine AS builder

WORKDIR /app

# Copy workspace config and package.json
COPY package.json yarn.lock .yarnrc.yml .yarn/ .yarn/
COPY demo/package.json demo/package.json
COPY design/package.json design/package.json
COPY server/package.json server/package.json

# Install dependencies
RUN corepack enable && yarn workspace @arcs/demo install --immutable

# Copy source code
COPY demo demo
COPY design design
COPY server server

# Build demo app
RUN yarn workspace @arcs/demo build

# Production stage: minimal runtime
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy built demo assets to server's public folder
COPY --from=builder /app/demo/dist /app/server/public

# Copy server code
COPY server/package.json server/yarn.lock ./server/
COPY server/src ./server/src

# Install production dependencies only
RUN corepack enable && \
    cd /app/server && \
    yarn workspace @arcs/server install --immutable --production

# Set ownership and switch to non-root user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose server port
EXPOSE 3000

# Start server
CMD ["node", "server/src/server.ts"]