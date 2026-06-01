/**
 * Обновляет `src/app/favicon.ico` из PNG.
 * Пример: `node scripts/generate-favicon.mjs ./my-icon.png`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const icoOut = path.join(root, "src", "app", "favicon.ico");

const arg = process.argv[2];
const source = arg
  ? path.resolve(arg)
  : path.join(root, "public", "favicon-source.png");

if (!fs.existsSync(source)) {
  console.error(
    "Нет файла PNG. Передайте путь:\n  node scripts/generate-favicon.mjs path/to/image.png\n(или временно верните public/favicon-source.png)",
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
  console.log("OK →", icoOut);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
