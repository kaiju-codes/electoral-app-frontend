#!/bin/bash
# Azure App Service startup script for Next.js application

# Navigate to app directory
cd /home/site/wwwroot

# Install dependencies if node_modules doesn't exist or is incomplete
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/next" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the application
npm start

