FROM node:18-alpine

# Install ClamAV
RUN apk add --no-cache clamav clamav-daemon clamav-libunrar

# Create directories
RUN mkdir -p /var/log/clamav /var/lib/clamav
RUN chown -R clamav:clamav /var/log/clamav /var/lib/clamav

# Update virus definitions
RUN freshclam

# Create app directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy scanner package
COPY packages/scanner/package*.json ./packages/scanner/
COPY packages/scanner/tsconfig.json ./packages/scanner/
COPY packages/scanner/src ./packages/scanner/src

# Install dependencies from workspace root
RUN pnpm install --filter @fileduck/scanner --filter @fileduck/shared

# Build TypeScript
WORKDIR /app/packages/scanner
RUN pnpm exec tsc

# Copy entrypoint script
COPY packages/scanner/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set working directory
WORKDIR /app/packages/scanner

EXPOSE 4000

ENTRYPOINT ["/docker-entrypoint.sh"]
