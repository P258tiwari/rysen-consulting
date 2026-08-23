import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const imageRoot = fileURLToPath(new URL("../public/assets/images/", import.meta.url));
const minimumBytes = 250 * 1024;

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "logos") continue;
      files.push(...await filesIn(path));
    } else {
      files.push(path);
    }
  }
  return files;
}

const sourceFiles = (await filesIn(imageRoot)).filter((path) => [".jpg", ".jpeg", ".png"].includes(extname(path).toLowerCase()));
let before = 0;
let after = 0;
let converted = 0;

for (const source of sourceFiles) {
  const sourceStats = await stat(source);
  if (sourceStats.size < minimumBytes) continue;
  const output = source.replace(/\.(?:jpe?g|png)$/i, ".webp");
  await sharp(source)
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5, smartSubsample: true })
    .toFile(output);
  const outputStats = await stat(output);
  before += sourceStats.size;
  after += outputStats.size;
  converted += 1;
  console.log(`${source.replaceAll("\\", "/")} -> ${Math.round(outputStats.size / 1024)} KB`);
}

console.log(`Optimized ${converted} images: ${Math.round(before / 1024 / 1024)} MB -> ${Math.round(after / 1024 / 1024)} MB.`);
