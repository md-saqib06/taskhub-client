# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy all source files
COPY . .

# Build the Vite app → dist/
RUN bun run build

# ─── Stage 2: Production (Nginx) ──────────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S -G appgroup appuser

# Remove default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx config (SPA fallback + gzip + asset caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Give ownership of static files to non-root user
RUN chown -R appuser:appgroup /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
