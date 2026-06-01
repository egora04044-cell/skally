/**
 * Обновляет favicon из исходника (public/favicon-source.png — то же лицо, что на иконке).
 * Генерирует ICO (16/32/48/120) и icon.png 120×120 для Яндекса/Google.
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

const arg = process.argv[2];
const source = arg
  ? path.resolve(arg)
  : path.join(root, "public", "favicon-source.png");

if (!fs.existsSync(source)) {
  console.error(
    "Нет исходника. Передайте путь:\n  node scripts/generate-favicon.mjs path/to/image.png",
  );
  process.exit(1);
}

const resizeOpts = {
  fit: "cover",
  position: "attention",
};

const sizes = [16, 32, 48, 120];
const tmpDir = fs.mkdtempSync(path.join(tmpdir(), "scally-favicon-"));

try {
  const pngBuffers = await Promise.all(
    sizes.map(async (size) => {
      const out = path.join(tmpDir, `icon-${size}.png`);
      await sharp(source)
        .resize(size, size, resizeOpts)
        .png({ compressionLevel: 9 })
        .toFile(out);
      return fs.readFileSync(out);
    }),
  );

  fs.writeFileSync(icoOut, await pngToIco(pngBuffers));
  fs.copyFileSync(path.join(tmpDir, "icon-120.png"), iconOut);

  console.log("OK →", icoOut);
  console.log("OK →", iconOut);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
