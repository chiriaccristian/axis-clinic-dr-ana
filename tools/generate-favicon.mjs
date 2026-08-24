import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svgPath = new URL('../apps/clinic/public/logo.svg', import.meta.url);
const icoPath = new URL('../apps/clinic/public/favicon.ico', import.meta.url);
const sizes = [16, 32, 48, 64, 128, 256];

const svg = await readFile(svgPath);

const pngs = await Promise.all(
  sizes.map((size) =>
    sharp(svg, { density: 384 })
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);

let offset = 6 + sizes.length * 16;
const entries = pngs.map((png, index) => {
  const size = sizes[index];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});

await writeFile(icoPath, Buffer.concat([header, ...entries, ...pngs]));

console.log(`favicon.ico generat cu dimensiunile: ${sizes.join(', ')}`);
