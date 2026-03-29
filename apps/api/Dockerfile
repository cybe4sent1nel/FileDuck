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

# Verify builds succeeded
RUN test -f apps/api/dist/server.js || (echo "Build failed - server.js not found" && exit 1)
RUN test -f packages/scanner/dist/index.js || (echo "Build failed - scanner index.js not found" && exit 1)

# Copy startup script
COPY apps/api/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports for API and Scanner
EXPOSE 3001 4000

# Start both services
CMD ["/app/start.sh"]

