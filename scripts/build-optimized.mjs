import path from "node:path";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { deleteOriginalImages, prepareWebpImages } from "./optimize-images.mjs";
import { generateNoteGraphLabels } from "./generate-note-graph-labels.mjs";

const rootDir = process.cwd();
const astroBin = path.join(rootDir, "node_modules", "astro", "bin", "astro.mjs");
const pagefindBin = path.join(rootDir, "node_modules", "pagefind", "lib", "runner", "bin.cjs");
const distDir = path.join(rootDir, "dist");

await generateNoteGraphLabels();
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
if (!existsSync(pagefindBin)) {
  console.error("Pagefind is not installed. Run `npm install` before building.");
  process.exit(1);
}

const index = spawnSync(process.execPath, [pagefindBin, "--site", distDir], {
  cwd: rootDir,
  stdio: "inherit",
});

if (index.status !== 0) {
  console.error("Pagefind indexing failed. The site was built but search will be unavailable.");
  process.exit(index.status ?? 1);
}
