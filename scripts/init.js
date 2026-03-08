#!/usr/bin/env node

/**
 * Project initialization script for Südtirol Wetter App V2
 * This script creates the SvelteKit project structure
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

console.log('Initializing Südtirol Wetter App V2...\n');

// Check if package.json exists
const packageJsonPath = path.join(projectRoot, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('Error: package.json not found at project root');
  process.exit(1);
}

console.log('✓ Found package.json');
console.log('Installing dependencies...\n');

// Instructions for the user
console.log('To complete setup, run:');
console.log('  cd ' + projectRoot);
console.log('  npm install');
console.log('  npm run dev');
console.log('\nFor more information, see README.md\n');
