#!/bin/bash

# Quick Start Script for Joel's Portfolio Dashboard

echo "🎬 Joel's Portfolio Dashboard - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🚀 Starting dashboard server..."
echo "🌐 Dashboard will be available at: http://localhost:5001/dashboard/"
echo "🔐 Default password: JOELKUNDU"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
