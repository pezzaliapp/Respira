#!/usr/bin/env node
/**
 * generate-icons.js
 * Genera tutti gli icon PNG per la PWA a partire dall'SVG sorgente.
 *
 * Usage:
 *   npm install sharp   (una tantum)
 *   node generate-icons.js
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const SIZES = [16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 512];
const OUT   = path.join(__dirname, 'icons');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// SVG sorgente inline — cerchio con simbolo foglia stilizzata
const svgSource = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <!-- Background -->
  <rect width="512" height="512" rx="${size * 0.22}" fill="#1a1209"/>

  <!-- Orb glow -->
  <radialGradient id="g1" cx="40%" cy="35%" r="60%">
    <stop offset="0%" stop-color="#c4845a" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#1a1209" stop-opacity="0"/>
  </radialGradient>
  <rect width="512" height="512" rx="${size * 0.22}" fill="url(#g1)"/>

  <!-- Outer ring -->
  <circle cx="256" cy="256" r="200" fill="none" stroke="#c4845a" stroke-width="6" stroke-opacity="0.4"/>

  <!-- Inner ring -->
  <circle cx="256" cy="256" r="155" fill="none" stroke="#f5ede0" stroke-width="2" stroke-opacity="0.15"/>

  <!-- Leaf / breath mark -->
  <path d="M256 156 C310 190, 330 240, 256 356 C182 240, 202 190, 256 156 Z"
        fill="none" stroke="#f5ede0" stroke-width="10" stroke-linejoin="round"
        stroke-opacity="0.9"/>

  <!-- Center dot -->
  <circle cx="256" cy="256" r="8" fill="#c4845a" fill-opacity="0.9"/>
</svg>
`;

async function generateIcons() {
  console.log('Generating PWA icons...\n');

  for (const size of SIZES) {
    const outPath = path.join(OUT, `icon-${size}.png`);
    const svg     = Buffer.from(svgSource(size));

    await sharp(svg)
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(outPath);

    console.log(`  ✓ icon-${size}.png`);
  }

  console.log('\nDone! All icons generated in /icons');
}

generateIcons().catch(console.error);
