const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(process.cwd(), 'public', 'images');
const outputDir = path.join(process.cwd(), 'public', 'images', 'optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Optimize logo
sharp(path.join(inputDir, 'logo_transparent.png'))
  .webp({ quality: 80 })
  .toFile(path.join(outputDir, 'logo.webp'))
  .then(() => {
    console.log('Logo optimized successfully!');
  })
  .catch(err => {
    console.error('Error optimizing logo:', err);
  }); 