#!/bin/bash
# Azure App Service startup script for Next.js application

set -euo pipefail

# Navigate to app directory (the deployment package root)
cd /home/site/wwwroot

echo "Starting Next.js app..."
export NODE_ENV=production

# Check if .next directory exists (production build)
if [ ! -d ".next" ]; then
  echo "Warning: .next directory not found. Building Next.js app..."
  # NEXT_PUBLIC_API_BASE_URL should be set in Azure App Settings
  npm run build
fi

# Start the production server
npm start

