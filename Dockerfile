FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat && npm install -g pnpm@12.3.4
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN test -n "$NEXT_PUBLIC_API_URL" || { \
        echo "NEXT_PUBLIC_API_URL обязателен: он вшивается в бандл при сборке, а не читается в рантайме."; \
        echo "Пример: docker build --build-arg NEXT_PUBLIC_API_URL=https://api.upstudy.kz ."; \
        exit 1; \
    }
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
