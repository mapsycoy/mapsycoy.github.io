import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const imageRoots = ["public/uploads", "public/works"];
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const maxWidth = 2400;
const jpegQuality = 82;
const webpQuality = 82;

const formatBytes = (bytes) => `${(bytes / 1024).toFixed(bytes > 1024 * 1024 ? 1 : 0)} KB`;

const pathExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const collectImages = async (dir) => {
  if (!(await pathExists(dir))) return [];

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) return collectImages(entryPath);
      if (!entry.isFile()) return [];

      return supportedExtensions.has(path.extname(entry.name).toLowerCase()) ? [entryPath] : [];
    })
  );

  return files.flat();
};

const optimizeImage = async (filePath) => {
  const original = await fs.readFile(filePath);
  const metadata = await sharp(original).metadata();
  const extension = path.extname(filePath).toLowerCase();
  const shouldResize = metadata.width && metadata.width > maxWidth;
  const pipeline = sharp(original).rotate();

  if (shouldResize) {
    pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  if (extension === ".jpg" || extension === ".jpeg") {
    pipeline.jpeg({ quality: jpegQuality, mozjpeg: true });
  } else if (extension === ".png") {
    pipeline.png({ compressionLevel: 9, palette: true });
  } else if (extension === ".webp") {
    pipeline.webp({ quality: webpQuality });
  }

  const optimized = await pipeline.toBuffer();

  if (optimized.length >= original.length) {
    return {
      filePath,
      originalSize: original.length,
      optimizedSize: original.length,
      changed: false,
      reason: "already optimal",
    };
  }

  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, optimized);
  await fs.rename(tempPath, filePath);

  return {
    filePath,
    originalSize: original.length,
    optimizedSize: optimized.length,
    changed: true,
    reason: shouldResize ? `resized to ${maxWidth}px wide` : "recompressed",
  };
};

const imageFiles = (
  await Promise.all(imageRoots.map((dir) => collectImages(path.join(rootDir, dir))))
).flat();

let savedBytes = 0;
let changedCount = 0;

for (const filePath of imageFiles) {
  const result = await optimizeImage(filePath);
  const relativePath = path.relative(rootDir, result.filePath);

  if (result.changed) {
    changedCount += 1;
    savedBytes += result.originalSize - result.optimizedSize;
    console.log(
      `optimized ${relativePath}: ${formatBytes(result.originalSize)} -> ${formatBytes(result.optimizedSize)} (${result.reason})`
    );
  } else {
    console.log(`skipped ${relativePath}: ${formatBytes(result.originalSize)} (${result.reason})`);
  }
}

console.log(`Image optimization complete: ${changedCount}/${imageFiles.length} changed, ${formatBytes(savedBytes)} saved.`);
