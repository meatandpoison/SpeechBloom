// Run once locally: node generate-icons.mjs
// Requires: npm install sharp (or any SVG→PNG tool)
// This is a helper script — not deployed to Vercel.
import { writeFileSync } from "fs";

const svgIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#7c5cff"/>
  <text x="50%" y="56%" font-size="${size * 0.55}" text-anchor="middle" dominant-baseline="middle" font-family="serif">🎒</text>
</svg>`;

writeFileSync("icon-192.svg", svgIcon(192));
writeFileSync("icon-512.svg", svgIcon(512));
console.log("Generated icon-192.svg and icon-512.svg");
console.log("Convert to PNG with: npx sharp-cli -i icon-192.svg -o icon-192.png && npx sharp-cli -i icon-512.svg -o icon-512.png");
