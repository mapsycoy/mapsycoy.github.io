import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const sourceExtensions = new Set([".jpg", ".jpeg", ".png"]);
const textExtensions = new Set([
  ".astro",
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);
const referenceRoots = ["src", "public/admin", "scripts"];
const maxWidth = 2400;
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

const collectFiles = async (dir, filter) => {
  if (!(await pathExists(dir))) return [];

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) return collectFiles(entryPath, filter);
      if (!entry.isFile()) return [];

      return filter(entryPath) ? [entryPath] : [];
    })
  );

  return files.flat();
};

const toWebPath = (filePath) => `/${path.relative(publicDir, filePath).replaceAll(path.sep, "/")}`;

const toWebpPath = (filePath, hasNameCollision = false) => {
  const parsed = path.parse(filePath);
  const extensionName = parsed.ext.slice(1).toLowerCase();
  const suffix = hasNameCollision ? `-${extensionName}` : "";
  return path.join(parsed.dir, `${parsed.name}${suffix}.webp`);
};

const buildImagePlan = async () => {
  const imageFiles = await collectFiles(publicDir, (filePath) =>
    sourceExtensions.has(path.extname(filePath).toLowerCase())
  );
  const groups = new Map();

  for (const filePath of imageFiles) {
    const parsed = path.parse(filePath);
    const key = path.join(parsed.dir, parsed.name).toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), filePath]);
  }

  return imageFiles.map((sourcePath) => {
    const parsed = path.parse(sourcePath);
    const key = path.join(parsed.dir, parsed.name).toLowerCase();
    const webpPath = toWebpPath(sourcePath, (groups.get(key) ?? []).length > 1);

    return {
      sourcePath,
      webpPath,
      sourceWebPath: toWebPath(sourcePath),
      webpWebPath: toWebPath(webpPath),
    };
  });
};

const convertToWebp = async ({ sourcePath, webpPath }) => {
  const original = await fs.readFile(sourcePath);
  const metadata = await sharp(original).metadata();
  const shouldResize = metadata.width && metadata.width > maxWidth;
  const pipeline = sharp(original).rotate();

  if (shouldResize) {
    pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const optimized = await pipeline.webp({ quality: webpQuality }).toBuffer();
  let changed = true;

  if (await pathExists(webpPath)) {
    const existing = await fs.readFile(webpPath);
    changed = !existing.equals(optimized);
  }

  if (changed) {
    const tempPath = `${webpPath}.tmp`;
    await fs.writeFile(tempPath, optimized);
    await fs.rename(tempPath, webpPath);
  }

  return {
    originalSize: original.length,
    optimizedSize: optimized.length,
    changed,
    reason: shouldResize ? `resized to ${maxWidth}px wide and converted` : "converted",
  };
};

const collectReferenceFiles = async () => {
  const files = await Promise.all(
    referenceRoots.map((dir) =>
      collectFiles(path.join(rootDir, dir), (filePath) => textExtensions.has(path.extname(filePath).toLowerCase()))
    )
  );

  return files.flat();
};

const updateReferences = async (plan) => {
  const referenceFiles = await collectReferenceFiles();
  let changedFiles = 0;
  let replacementCount = 0;

  for (const filePath of referenceFiles) {
    const originalText = await fs.readFile(filePath, "utf8");
    let nextText = originalText;

    for (const item of plan) {
      const beforeLength = nextText.length;
      nextText = nextText.replaceAll(item.sourceWebPath, item.webpWebPath);
      replacementCount += (beforeLength - nextText.length) / (item.sourceWebPath.length - item.webpWebPath.length || 1);
    }

    if (nextText !== originalText) {
      await fs.writeFile(filePath, nextText);
      changedFiles += 1;
    }
  }

  return { changedFiles, replacementCount: Math.max(0, Math.round(replacementCount)) };
};

export const prepareWebpImages = async () => {
  const plan = await buildImagePlan();
  let changedCount = 0;
  let savedBytes = 0;

  for (const item of plan) {
    const result = await convertToWebp(item);
    const sourceRelative = path.relative(rootDir, item.sourcePath);
    const webpRelative = path.relative(rootDir, item.webpPath);

    savedBytes += Math.max(0, result.originalSize - result.optimizedSize);
    if (result.changed) changedCount += 1;

    console.log(
      `${result.changed ? "created" : "verified"} ${webpRelative}: ${formatBytes(result.originalSize)} -> ${formatBytes(result.optimizedSize)} from ${sourceRelative} (${result.reason})`
    );
  }

  const references = await updateReferences(plan);
  console.log(
    `WebP preparation complete: ${changedCount}/${plan.length} files written, ${formatBytes(savedBytes)} potential savings, ${references.changedFiles} reference files updated.`
  );

  return { plan, references };
};

export const deleteOriginalImages = async (plan, { distDir } = {}) => {
  let deletedCount = 0;

  for (const item of plan) {
    if (await pathExists(item.webpPath)) {
      await fs.rm(item.sourcePath, { force: true });
      deletedCount += 1;
    }

    if (distDir) {
      const distOriginal = path.join(distDir, item.sourceWebPath.slice(1));
      await fs.rm(distOriginal, { force: true });
    }
  }

  console.log(`Deleted ${deletedCount}/${plan.length} original jpg/jpeg/png files after successful build.`);
};

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  await prepareWebpImages();
}

