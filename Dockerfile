# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Copy shared package
COPY packages/shared ./packages/shared/

# Install dependencies (including workspace packages)
RUN npm ci

# Build shared package first
WORKDIR /app/packages/shared
RUN npm install && npm run build

# Go back to app root
WORKDIR /app

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY tsconfig.json ./
COPY src ./src/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy shared package (built)
COPY --from=builder /app/packages/shared/dist ./node_modules/@ai-video-learning/shared/dist
COPY --from=builder /app/packages/shared/package.json ./node_modules/@ai-video-learning/shared/

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Set ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

# Start the application
CMD ["node", "dist/index.js"]
