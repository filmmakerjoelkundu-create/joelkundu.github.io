#!/bin/bash
# Portfolio Site Server - Port 5001
# This script starts the portfolio site on the correct port (5001)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=5001

echo "🎬 Starting Joel Kundu Portfolio Site"
echo "📍 Location: $SCRIPT_DIR"
echo "🔌 Port: $PORT"
echo "🌐 URL: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
python3 -m http.server $PORT
