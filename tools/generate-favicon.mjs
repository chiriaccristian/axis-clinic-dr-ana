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

const brandBackground = { r: 247, g: 243, b: 240, alpha: 1 };
const appleTouchPath = new URL(
  '../apps/clinic/public/apple-touch-icon.png',
  import.meta.url,
);
const ogImagePath = new URL(
  '../apps/clinic/public/og-image.jpg',
  import.meta.url,
);

const appleTouchIcon = await sharp(svg, { density: 384 })
  .resize(160, 160, { fit: 'contain', background: { ...brandBackground, alpha: 0 } })
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: brandBackground })
  .flatten({ background: brandBackground })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(appleTouchPath, appleTouchIcon);

console.log('apple-touch-icon.png generat (180x180, fundal opac)');

const ogLogo = await sharp(svg, { density: 384 })
  .resize(420, 420, { fit: 'contain', background: { ...brandBackground, alpha: 0 } })
  .png()
  .toBuffer();

const ogImage = await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: brandBackground,
  },
})
  .composite([{ input: ogLogo, gravity: 'centre' }])
  .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
  .toBuffer();

await writeFile(ogImagePath, ogImage);

console.log('og-image.jpg generat (1200x630)');
