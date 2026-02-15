#!/bin/sh
set -e

echo "🚀 Starting FileDuck services..."

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
    kill $SCANNER_PID $API_PID 2>/dev/null || true
    exit 0
}

# Trap termination signals
trap shutdown SIGTERM SIGINT

# Wait for both processes
wait $SCANNER_PID $API_PID
