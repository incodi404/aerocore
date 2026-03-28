# ============
# Base (Shared)
# ============
FROM node:20-alpine As base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# ============
# Development
# ============
FROM base As dev
CMD ["npm", "run", "dev"]

# ============
# Build
# ============
FROM base As build

RUN npm run build

# ============
# Production
# ============