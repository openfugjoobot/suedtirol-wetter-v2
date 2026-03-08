#!/usr/bin/env node

/**
 * This is a placeholder icon generator script
 * Run this to generate icons for the PWA
 */

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'static', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Placeholder icon data (1x1 transparent PNG)
const placeholderIcon = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

const sizes = [
  { size: '72x72', file: 'icon-72x72.png' },
  { size: '96x96', file: 'icon-96x96.png' },
  { size: '128x128', file: 'icon-128x128.png' },
  { size: '144x144', file: 'icon-144x144.png' },
  { size: '152x152', file: 'icon-152x152.png' },
  { size: '192x192', file: 'icon-192x192.png' },
  { size: '384x384', file: 'icon-384x384.png' },
  { size: '512x512', file: 'icon-512x512.png' }
];

sizes.forEach(({ size, file }) => {
  const filePath = path.join(iconsDir, file);
  fs.writeFileSync(filePath, placeholderIcon);
  console.log(`Created placeholder icon: ${file} (${size})`);
});

console.log('\nGenerated placeholder icons for PWA');
console.log('Replace these with actual icons for production use');
