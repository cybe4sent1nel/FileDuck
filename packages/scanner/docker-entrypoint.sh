#!/bin/sh
set -e

# Ensure ClamAV is configured to listen on TCP (necessary for NodeClam)
CLAMD_CONF=/etc/clamav/clamd.conf
echo "Configuring clamd for TCP..."
if [ -f "$CLAMD_CONF" ]; then
	# Add TCP settings if not already present
	grep -q "^TCPSocket" "$CLAMD_CONF" || echo "TCPSocket 3310" >> "$CLAMD_CONF"
	grep -q "^TCPAddr" "$CLAMD_CONF" || echo "TCPAddr 0.0.0.0" >> "$CLAMD_CONF"
fi

# Update virus definitions before starting
echo "Updating ClamAV databases (freshclam)..."
freshclam || echo "freshclam returned non-zero; continuing"

echo "Starting clamd daemon (background)..."
# Start clamd in the background and allow it to create the TCP socket
clamd --foreground=false &

echo "Waiting for clamd to start and listen on port 3310 (IPv4 check)..."
TRIES=0
until nc -z 127.0.0.1 3310 >/dev/null 2>&1; do
	TRIES=$((TRIES+1))
	if [ "$TRIES" -gt 20 ]; then
		echo "clamd did not start within expected time; continuing and letting app handle retries"
		break
	fi
	sleep 1
done

echo "Starting scanner service..."
node dist/index.js
