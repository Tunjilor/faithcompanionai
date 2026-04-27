import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('public/icons', { recursive: true });

// SVG: dark purple radial gradient background + white cross with glow
function makeSvg(size) {
  const cx = size / 2;
  const armW = size * 0.09;   // cross arm width
  const vH   = size * 0.52;   // vertical arm height
  const hW   = size * 0.52;   // horizontal arm width
  const vX   = cx - armW / 2;
  const hY   = cx - armW / 2;
  const r    = size / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="65%">
      <stop offset="0%"   stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#0f071a"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="${size * 0.025}" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- background -->
  <rect width="${size}" height="${size}" rx="${r * 0.22}" ry="${r * 0.22}" fill="url(#bg)"/>
  <!-- cross glow layer -->
  <g filter="url(#glow)" opacity="0.55">
    <rect x="${vX}" y="${cx - vH/2}" width="${armW}" height="${vH}" rx="${armW*0.3}" fill="#e9d5ff"/>
    <rect x="${cx - hW/2}" y="${hY}" width="${hW}" height="${armW}" rx="${armW*0.3}" fill="#e9d5ff"/>
  </g>
  <!-- cross solid -->
  <rect x="${vX}" y="${cx - vH/2}" width="${armW}" height="${vH}" rx="${armW*0.3}" fill="white"/>
  <rect x="${cx - hW/2}" y="${hY}" width="${hW}" height="${armW}" rx="${armW*0.3}" fill="white"/>
</svg>`;
}

const icons = [
  { path: 'public/icons/icon-192.png', size: 192 },
  { path: 'public/icons/icon-512.png', size: 512 },
  { path: 'public/apple-touch-icon.png', size: 180 },
  // also overwrite the brand placeholders
  { path: 'public/brand/icon-192.png', size: 192 },
  { path: 'public/brand/icon-512.png', size: 512 },
  { path: 'public/brand/icon-180.png', size: 180 },
];

for (const { path, size } of icons) {
  const svg = Buffer.from(makeSvg(size));
  await sharp(svg).png().toFile(path);
  console.log(`Created: ${path} (${size}x${size})`);
}

console.log('\nAll icons generated.');
