FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# ---- Development ----
FROM base AS development
CMD ["npm", "run", "dev"]

# ---- Production ----
FROM base AS production
RUN npm run build
CMD ["npm", "start"]
