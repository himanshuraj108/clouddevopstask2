# ─── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci --only=production

# ─── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeapp -u 1001

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder --chown=nodeapp:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodeapp:nodejs . .

# Remove dev files
RUN rm -f .env.example

# Switch to non-root user
USER nodeapp

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:5000/health || exit 1

# Start the app
CMD ["node", "server.js"]
