#!/bin/bash
# Build script for Südtirol Wetter App V2

set -e

echo "Building Südtirol Wetter App V2..."

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the app
echo "Building application..."
npm run build

echo "Build complete! Output is in the 'build' directory."
echo "To preview the production build, run: npm run preview"
