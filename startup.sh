#!/bin/bash
# Azure App Service startup script for Next.js application

set -euo pipefail

# Navigate to app directory (the deployment package root)
cd /home/site/wwwroot

echo "Starting Next.js app..."
export NODE_ENV=production

# The GitHub Actions build step already ran `npm ci` and `npm run build`,
# and the deployed package includes `node_modules` and `.next`.
# We only need to start the server here.
npm start

