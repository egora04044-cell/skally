/**
 * Обновляет иконки в `src/app/` из PNG (favicon.ico, icon.png, apple-icon.png).
 * Пример: `node scripts/generate-favicon.mjs ./my-icon.png`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDir = path.join(root, "src", "app");
const icoOut = path.join(appDir, "favicon.ico");
const iconOut = path.join(appDir, "icon.png");
const appleOut = path.join(appDir, "apple-icon.png");

const arg = process.argv[2];
const defaults = [
  path.join(root, "public", "favicon-source.png"),
  path.join(root, "public", "hero-main.png"),
];
const source = arg
  ? path.resolve(arg)
  : defaults.find((p) => fs.existsSync(p));

if (!source) {
  console.error(
    "Нет PNG. Передайте путь:\n  node scripts/generate-favicon.mjs path/to/image.png",
  );
  process.exit(1);
}

const resizeOpts = {
  fit: "cover",
  position: "attention",
};

const tmpDir = fs.mkdtempSync(path.join(tmpdir(), "scally-favicon-"));
const iconTmp = path.join(tmpDir, "icon.png");

try {
  await sharp(source).resize(512, 512, resizeOpts).png({ compressionLevel: 9 }).toFile(iconTmp);

  const icoBuf = await pngToIco(iconTmp);
  fs.writeFileSync(icoOut, icoBuf);
  fs.copyFileSync(iconTmp, iconOut);
  await sharp(iconTmp).resize(180, 180, resizeOpts).png({ compressionLevel: 9 }).toFile(appleOut);

  console.log("OK →", icoOut);
  console.log("OK →", iconOut);
  console.log("OK →", appleOut);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
