import { deflateSync } from "zlib";
import { writeFileSync } from "fs";

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) | 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4); crcBuf.writeInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function makePNG(size) {
  const [R, G, B] = [124, 92, 255]; // #7c5cff
  const rad = Math.round(size * 0.22);
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0;
    for (let x = 0; x < size; x++) {
      const corners = [
        x < rad     && y < rad     && Math.hypot(x - rad,          y - rad)          > rad,
        x >= size-rad && y < rad   && Math.hypot(x - (size-rad),   y - rad)          > rad,
        x < rad     && y >= size-rad && Math.hypot(x - rad,         y - (size-rad))  > rad,
        x >= size-rad && y >= size-rad && Math.hypot(x-(size-rad),  y-(size-rad))    > rad,
      ];
      const i = 1 + x * 4;
      if (corners.some(Boolean)) { row[i] = row[i+1] = row[i+2] = row[i+3] = 0; }
      else { row[i] = R; row[i+1] = G; row[i+2] = B; row[i+3] = 255; }
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(Buffer.concat(rows), {level:6})), chunk("IEND", Buffer.alloc(0))]);
}

writeFileSync("icon-192.png", makePNG(192));
writeFileSync("icon-512.png", makePNG(512));
console.log("✓ icon-192.png (192×192) and icon-512.png (512×512) written");
