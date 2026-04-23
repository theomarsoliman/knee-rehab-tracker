import Jimp from 'jimp';
import { mkdirSync } from 'fs';
import { join } from 'path';

const SIZE_192 = 192;
const SIZE_512 = 512;

async function generateIcon(size) {
  const image = new Jimp(size, size, 0x2D9B6AFF); // #2D9B6A in hex (RGBA)
  
  // Draw a simple knee icon shape
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  
  // Draw a circle for the knee
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      if (dist < radius) {
        // Light green circle
        image.setPixelColor(0xF8F7F4FF, x, y); // #F8F7F4
      } else if (dist < radius + 2) {
        // Border
        image.setPixelColor(0x248A5CFF, x, y); // Darker green border
      }
    }
  }
  
  // Draw a checkmark in the center
  const checkSize = size * 0.2;
  const checkThickness = size * 0.05;
  const startX = centerX - checkSize * 0.4;
  const startY = centerY;
  
  for (let i = 0; i < checkSize; i++) {
    for (let t = 0; t < checkThickness; t++) {
      // First part of check (top-left to middle)
      const y1 = startY - checkSize * 0.4 + i * 0.7;
      const x1 = startX + i;
      if (Math.abs(y1 - (startY - checkSize * 0.4 + i * 0.7)) < checkThickness / 2) {
        if (x1 >= 0 && x1 < size && y1 >= 0 && y1 < size) {
          image.setPixelColor(0xFFFFFFFF, Math.round(x1), Math.round(y1));
        }
      }
    }
  }
  
  // Simpler checkmark: draw lines
  const lineColor = 0xFFFFFFFF; // White
  
  // Draw checkmark using pixel-by-pixel
  const checkStartX = centerX - checkSize * 0.3;
  const checkMidX = centerX - checkSize * 0.05;
  const checkMidY = centerY - checkSize * 0.1;
  const checkEndX = centerX + checkSize * 0.35;
  const checkEndY = centerY + checkSize * 0.25;
  
  // First stroke (going down-right from top-left)
  const dx1 = checkMidX - checkStartX;
  const dy1 = checkMidY - (centerY - checkSize * 0.3);
  const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const step1 = size * 0.005;
  
  for (let i = 0; i < len1; i += step1) {
    const t = i / len1;
    const px = Math.round(checkStartX + dx1 * t);
    const py = Math.round((centerY - checkSize * 0.3) + dy1 * t);
    for (let ox = -checkThickness / 2; ox <= checkThickness / 2; ox++) {
      for (let oy = -checkThickness / 2; oy <= checkThickness / 2; oy++) {
        if (px + ox >= 0 && px + ox < size && py + oy >= 0 && py + oy < size) {
          image.setPixelColor(lineColor, px + Math.round(ox), py + Math.round(oy));
        }
      }
    }
  }
  
  // Second stroke (going up-right from middle to end)
  const dx2 = checkEndX - checkMidX;
  const dy2 = checkEndY - checkMidY;
  const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  
  for (let i = 0; i < len2; i += step1) {
    const t = i / len2;
    const px = Math.round(checkMidX + dx2 * t);
    const py = Math.round(checkMidY + dy2 * t);
    for (let ox = -checkThickness / 2; ox <= checkThickness / 2; ox++) {
      for (let oy = -checkThickness / 2; oy <= checkThickness / 2; oy++) {
        if (px + ox >= 0 && px + ox < size && py + oy >= 0 && py + oy < size) {
          image.setPixelColor(lineColor, px + Math.round(ox), py + Math.round(oy));
        }
      }
    }
  }
  
  return image;
}

async function main() {
  const iconsDir = join(process.cwd(), 'public', 'icons');
  mkdirSync(iconsDir, { recursive: true });
  
  console.log('Generating 192x192 icon...');
  const icon192 = await generateIcon(SIZE_192);
  await icon192.writeAsync(join(iconsDir, 'icon-192.png'));
  console.log('Done: public/icons/icon-192.png');
  
  console.log('Generating 512x512 icon...');
  const icon512 = await generateIcon(SIZE_512);
  await icon512.writeAsync(join(iconsDir, 'icon-512.png'));
  console.log('Done: public/icons/icon-512.png');
  
  console.log('Icons generated successfully!');
}

main().catch(console.error);
