FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy entire monorepo
COPY . .

# Install all dependencies (pnpm will resolve workspace correctly)
RUN pnpm install

# Build backend (scanner and api)
RUN pnpm run build:backend

# Verify build succeeded
RUN test -f apps/api/dist/server.js || (echo "Build failed - server.js not found" && exit 1)

# Expose port
EXPOSE 3001

# Start the server from API package
WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
