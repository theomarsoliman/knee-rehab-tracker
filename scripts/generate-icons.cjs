const { PNG } = require('pngjs');
const { mkdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const SIZE_192 = 192;
const SIZE_512 = 512;

function generateIcon(size) {
  const png = new PNG({
    width: size,
    height: size,
    filterType: -1,
  });

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.38;
  const borderWidth = size * 0.04;

  // Colors
  const bgColor = { r: 45, g: 155, b: 106, a: 255 }; // #2D9B6A
  const innerColor = { r: 248, g: 247, b: 244, a: 255 }; // #F8F7F4
  const borderColor = { r: 36, g: 138, b: 92, a: 255 }; // #248A5C
  const checkColor = { r: 255, g: 255, b: 255, a: 255 }; // White

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      if (dist < radius - borderWidth) {
        // Inner circle - cream color
        png.data[idx] = innerColor.r;
        png.data[idx + 1] = innerColor.g;
        png.data[idx + 2] = innerColor.b;
        png.data[idx + 3] = innerColor.a;
      } else if (dist < radius) {
        // Border ring - darker green
        png.data[idx] = borderColor.r;
        png.data[idx + 1] = borderColor.g;
        png.data[idx + 2] = borderColor.b;
        png.data[idx + 3] = borderColor.a;
      } else {
        // Outside - main green (will be transparent but let's make it green for now)
        png.data[idx] = bgColor.r;
        png.data[idx + 1] = bgColor.g;
        png.data[idx + 2] = bgColor.b;
        png.data[idx + 3] = 0; // Transparent
      }
    }
  }

  // Draw checkmark
  const checkSize = size * 0.25;
  const checkThickness = Math.max(3, Math.round(size * 0.045));
  
  const checkStartX = centerX - checkSize * 0.4;
  const checkStartY = centerY - checkSize * 0.1;
  const checkMidX = centerX - checkSize * 0.05;
  const checkMidY = centerY + checkSize * 0.15;
  const checkEndX = centerX + checkSize * 0.4;
  const checkEndY = centerY - checkSize * 0.25;

  function setCheckPixel(px, py) {
    if (px >= 0 && px < size && py >= 0 && py < size) {
      const idx = (size * Math.round(py) + Math.round(px)) << 2;
      png.data[idx] = checkColor.r;
      png.data[idx + 1] = checkColor.g;
      png.data[idx + 2] = checkColor.b;
      png.data[idx + 3] = checkColor.a;
    }
  }

  function drawLine(x1, y1, x2, y2, thickness) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(len * 2);
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = x1 + dx * t;
      const cy = y1 + dy * t;
      const half = Math.floor(thickness / 2);
      for (let ox = -half; ox <= half; ox++) {
        for (let oy = -half; oy <= half; oy++) {
          if (ox * ox + oy * oy <= half * half) {
            setCheckPixel(cx + ox, cy + oy);
          }
        }
      }
    }
  }

  // First stroke of check (top-left to middle-bottom)
  drawLine(checkStartX, checkStartY, checkMidX, checkMidY, checkThickness);
  
  // Second stroke of check (middle-bottom to top-right)
  drawLine(checkMidX, checkMidY, checkEndX, checkEndY, checkThickness);

  return png;
}

function main() {
  const iconsDir = join(process.cwd(), 'public', 'icons');
  mkdirSync(iconsDir, { recursive: true });
  
  console.log('Generating 192x192 icon...');
  const icon192 = generateIcon(SIZE_192);
  const buffer192 = PNG.sync.write(icon192);
  writeFileSync(join(iconsDir, 'icon-192.png'), buffer192);
  console.log('Done: public/icons/icon-192.png');
  
  console.log('Generating 512x512 icon...');
  const icon512 = generateIcon(SIZE_512);
  const buffer512 = PNG.sync.write(icon512);
  writeFileSync(join(iconsDir, 'icon-512.png'), buffer512);
  console.log('Done: public/icons/icon-512.png');
  
  console.log('Icons generated successfully!');
}

main();
