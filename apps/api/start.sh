#!/bin/sh
set -e

echo "🚀 Starting FileDuck services..."

# Start ClamAV daemon
echo "🦠 Starting ClamAV daemon..."
clamd &
CLAMD_PID=$!

# Wait for ClamAV to be ready (check if port 3310 is listening)
echo "⏳ Waiting for ClamAV to be ready..."
MAX_WAIT=30
WAITED=0
while ! nc -z 127.0.0.1 3310 2>/dev/null; do
    if [ $WAITED -ge $MAX_WAIT ]; then
        echo "⚠️ ClamAV failed to start after ${MAX_WAIT}s, scanner will use VirusTotal only"
        break
    fi
    sleep 1
    WAITED=$((WAITED + 1))
done

if nc -z 127.0.0.1 3310 2>/dev/null; then
    echo "✓ ClamAV daemon ready on port 3310"
else
    echo "⚠️ ClamAV not available, continuing without it"
fi

# Start scanner service in background
echo "📡 Starting scanner service on port 4000..."
cd /app/packages/scanner
node dist/index.js &
SCANNER_PID=$!

# Wait a moment for scanner to initialize
sleep 2

# Start API service
echo "🌐 Starting API service on port 3001..."
cd /app/apps/api
node dist/server.js &
API_PID=$!

# Function to handle shutdown
shutdown() {
    echo "🛑 Shutting down services..."
    kill $SCANNER_PID $API_PID $CLAMD_PID 2>/dev/null || true
    exit 0
}

# Trap termination signals
trap shutdown SIGTERM SIGINT

# Wait for all processes
wait $SCANNER_PID $API_PID $CLAMD_PID
