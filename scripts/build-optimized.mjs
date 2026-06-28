import path from "node:path";
import { spawnSync } from "node:child_process";
import { deleteOriginalImages, prepareWebpImages } from "./optimize-images.mjs";

const rootDir = process.cwd();
const astroBin = path.join(rootDir, "node_modules", "astro", "bin", "astro.mjs");
const distDir = path.join(rootDir, "dist");

const { plan } = await prepareWebpImages();
const build = spawnSync(process.execPath, [astroBin, "build"], {
  cwd: rootDir,
  stdio: "inherit",
});

if (build.status !== 0) {
  console.error("Astro build failed. Original jpg/jpeg/png files were kept.");
  process.exit(build.status ?? 1);
}

await deleteOriginalImages(plan, { distDir });
