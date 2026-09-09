import sharp from "sharp";
const f = process.argv[2];
const outBase = process.argv[3];
const maxH = Number(process.argv[4] || 2400);
const m = await sharp(f).metadata();
const scale = Math.min(1, 1000 / m.width);
const w = Math.round(m.width * scale);
const h = Math.round(m.height * scale);
const resized = await sharp(f).resize(w, h).toBuffer();
const slices = Math.ceil(h / maxH);
for (let i = 0; i < slices; i++) {
  const top = i * maxH;
  const height = Math.min(maxH, h - top);
  await sharp(resized).extract({ left: 0, top, width: w, height }).jpeg({ quality: 72 }).toFile(`${outBase}-${i + 1}.jpg`);
  console.log(`${outBase}-${i + 1}.jpg`, `${w}x${height}`);
}
