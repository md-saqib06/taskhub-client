FROM oven/bun:alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# Copy all source code
COPY . .

RUN bun run build

# Production stage
FROM oven/bun:alpine AS final

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN addgroup -S appgroup && adduser -S -G appgroup -h /home/appuser appuser

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 80

CMD ["bun", "x", "serve", "-s", "dist", "-l", "80"]