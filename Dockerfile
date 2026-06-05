# CareerCraft CN - CloudBase CloudRun Dockerfile
# 稳定构建版本 (node:22, 4GB 内存, 公开 ENV 硬编码)

FROM node:22-alpine AS builder
WORKDIR /app

# 安装依赖
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

# 复制源码
COPY . .

# 构建时环境变量 (NEXT_PUBLIC_* 是公开 Key，设计上可暴露)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_PUBLIC_CLOUDBASE_ENV_ID=careercraft-d4gfk3hi163786996
ENV NEXT_PUBLIC_CLOUDBASE_REGION=ap-shanghai
ENV NEXT_PUBLIC_CLOUDBASE_PUBLISHABLE_KEY=eyJhbGciOiJSUzI1NiIsImtpZCI6IjlkMWRjMzFlLWI0ZDAtNDQ4Yi1hNzZmLWIwY2M2M2Q4MTQ5OCJ9.eyJpc3MiOiJodHRwczovL2NhcmVlcmNyYWZ0LWQ0Z2ZrM2hpMTYzNzg2OTk2LmFwLXNoYW5naGFpLnRjYi1hcGkudGVuY2VudGNsb3VkYXBpLmNvbSIsInN1YiI6ImFub24iLCJhdWQiOiJjYXJlZXJjcmFmdC1kNGdmazNoaTE2Mzc4Njk5NiIsImV4cCI6NDA4NDE2MTk4MCwiaWF0IjoxNzgwNDc4NzgwLCJub25jZSI6IkFtSm83T1AwVE9tdnVVeXFMU1BURWciLCJhdF9oYXNoIjoiQW1KbzdPUDBUT212dVV5cUxTUFRFZyIsIm5hbWUiOiJBbm9ueW1vdXMiLCJzY29wZSI6ImFub255bW91cyIsInByb2plY3RfaWQiOiJjYXJlZXJjcmFmdC1kNGdmazNoaTE2Mzc4Njk5NiIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJ1c2VyX3R5cGUiOiIiLCJjbGllbnRfdHlwZSI6ImNsaWVudF91c2VyIiwiaXNfc3lzdGVtX2FkbWluIjpmYWxzZX0.ZFWzEVNTPLX4kxFA3wAccGLUPsSGwhf7O7myMxNXF-oJ30_Ymng_uTMRu21urTTx4g7BB5lkGZGcHv-G8CACFzP7oLvmnZWfu7NLDJBrkyKVIYqJVnypapsNW9mQfC5eTxgs-SYFrblmC_TWKHKg2iq5U6mVmGsVLmCRmsRcjUspKvtRCoYHInxnyOrwE2Cri4PPWm7jquj_cIbvpJBYOvIhpN5r1L88TB8m2RI5utV6I1x2rJI7NBdwNnO4mYkLGgjGOXPQrDId7alG5kGePOF5wr-gMl2qibmq1O5z9kfvH7_QL-eNZ93LU89oRmC4PADn5q0JX292EL7Ru92A5w
# JWT_SECRET 构建时需要，运行时在 CloudRun 控制台配置
ENV JWT_SECRET=crcft-prod-k8xR9vL2mN7pQ4wY6hJ3fD5sA1gB0eC8

# 构建 Next.js
RUN npx next build

# 运行阶段
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 确保 pdf-parse / mammoth / word-extractor 的完整目录被复制（standalone 可能遗漏内部模块）
COPY --from=builder /app/node_modules/pdf-parse ./node_modules/pdf-parse
COPY --from=builder /app/node_modules/mammoth ./node_modules/mammoth
COPY --from=builder /app/node_modules/word-extractor ./node_modules/word-extractor
COPY --from=builder /app/node_modules/sql.js ./node_modules/sql.js

RUN mkdir -p /data && chown node:node /data

EXPOSE 3000
USER node
CMD ["node", "server.js"]
