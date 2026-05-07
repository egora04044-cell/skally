/**
 * Генерирует app/icon.png, app/apple-icon.png и app/favicon.ico из исходника.
 * Замените public/favicon-source.png и выполните: npm run favicon
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "public", "favicon-source.png");
const iconOut = path.join(root, "src", "app", "icon.png");
const appleOut = path.join(root, "src", "app", "apple-icon.png");
const icoOut = path.join(root, "src", "app", "favicon.ico");

const resizeOpts = {
  fit: "cover",
  position: "attention",
};

await sharp(source).resize(512, 512, resizeOpts).png({ compressionLevel: 9 }).toFile(iconOut);
await sharp(source).resize(180, 180, resizeOpts).png({ compressionLevel: 9 }).toFile(appleOut);

const icoBuf = await pngToIco(iconOut);
fs.writeFileSync(icoOut, icoBuf);

console.log("Wrote", iconOut, appleOut, icoOut);
