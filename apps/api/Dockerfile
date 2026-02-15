FROM node:18-alpine

WORKDIR /app

# Install ClamAV and dependencies
RUN apk add --no-cache \
    clamav \
    clamav-daemon \
    clamav-libunrar \
    netcat-openbsd \
    && mkdir -p /var/log/clamav /var/lib/clamav /var/run/clamav \
    && chown -R clamav:clamav /var/log/clamav /var/lib/clamav /var/run/clamav

# Install pnpm globally
RUN npm install -g pnpm

# Copy entire monorepo
COPY . .

# Copy custom ClamAV configuration (optimized for large files)
COPY apps/api/clamd.conf /etc/clamav/clamd.conf
RUN chown clamav:clamav /etc/clamav/clamd.conf

# Install all dependencies (pnpm will resolve workspace correctly)
RUN pnpm install

# Build backend (scanner and api)
RUN pnpm run build:backend

# Verify builds succeeded
RUN test -f apps/api/dist/server.js || (echo "Build failed - server.js not found" && exit 1)
RUN test -f packages/scanner/dist/index.js || (echo "Build failed - scanner index.js not found" && exit 1)

# Update ClamAV virus database (use smaller main.cvd for faster builds)
RUN freshclam --config-file=/etc/clamav/freshclam.conf || echo "Warning: Could not update virus database, using bundled version"

# Copy startup script
COPY apps/api/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose ports for API and Scanner
EXPOSE 3001 4000

# Start both services
CMD ["/app/start.sh"]
