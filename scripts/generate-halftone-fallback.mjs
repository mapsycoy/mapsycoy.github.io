import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import gifenc from "gifenc";
import sharp from "sharp";

const { GIFEncoder } = gifenc;

const SCREENTONE = {
  cellSize: 4,
  contrast: 1.22,
  gamma: 1.15,
  minDotRadius: 0,
  maxDotRadius: 1.32,
  paper: { r: 248, g: 248, b: 245, a: 255 },
  ink: { r: 23, g: 23, b: 23, a: 255 }
};

const sourcePath = "public/uploads/home-instrument.gif";
const outputDir = "public/uploads/landing";
const targets = [
  {
    width: 390,
    height: 520,
    output: "home-instrument-halftone.gif"
  },
  {
    width: 728,
    height: 971,
    output: "home-instrument-halftone-large.gif"
  }
];

const getFrame = async (index, width, height) => {
  const { data } = await sharp(sourcePath, { animated: true, page: index, pages: 1 })
    .resize(width, height, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return data;
};

const renderHalftoneFrame = (source, width, height) => {
  const output = Buffer.alloc(width * height);
  const { cellSize, contrast, gamma, minDotRadius, maxDotRadius, paper, ink } = SCREENTONE;

  const fillDot = (centerX, centerY, radius) => {
    const left = Math.max(0, Math.floor(centerX - radius));
    const right = Math.min(width - 1, Math.ceil(centerX + radius));
    const top = Math.max(0, Math.floor(centerY - radius));
    const bottom = Math.min(height - 1, Math.ceil(centerY + radius));
    const radiusSquared = radius * radius;

    for (let y = top; y <= bottom; y += 1) {
      for (let x = left; x <= right; x += 1) {
        const dx = x + 0.5 - centerX;
        const dy = y + 0.5 - centerY;
        if (dx * dx + dy * dy > radiusSquared) continue;

        output[y * width + x] = 1;
      }
    }
  };

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      let luminance = 0;
      let count = 0;
      const cellRight = Math.min(width, x + cellSize);
      const cellBottom = Math.min(height, y + cellSize);

      for (let sampleY = y; sampleY < cellBottom; sampleY += 1) {
        for (let sampleX = x; sampleX < cellRight; sampleX += 1) {
          const index = (sampleY * width + sampleX) * 4;
          const alpha = source[index + 3] / 255;
          const red = source[index] * alpha + paper.r * (1 - alpha);
          const green = source[index + 1] * alpha + paper.g * (1 - alpha);
          const blue = source[index + 2] * alpha + paper.b * (1 - alpha);
          luminance += red * 0.299 + green * 0.587 + blue * 0.114;
          count += 1;
        }
      }

      const average = count ? luminance / count / 255 : 1;
      const contrasted = Math.min(1, Math.max(0, (average - 0.5) * contrast + 0.5));
      const inkAmount = Math.pow(1 - contrasted, gamma);
      const radius = minDotRadius + inkAmount * (maxDotRadius - minDotRadius);

      if (radius < 0.12) continue;

      const offset = Math.floor(y / cellSize) % 2 === 0 ? 0 : cellSize * 0.45;
      const centerX = x + cellSize / 2 + offset;
      const centerY = y + cellSize / 2;

      if (centerX > width + radius) continue;
      fillDot(centerX, centerY, radius);
    }
  }

  return output;
};

const encodeGif = ({ width, height, frames, delay, loop }) => {
  const { paper, ink } = SCREENTONE;
  const gif = GIFEncoder();
  const palette = [
    [paper.r, paper.g, paper.b],
    [ink.r, ink.g, ink.b]
  ];

  frames.forEach((frame, index) => {
    gif.writeFrame(frame, width, height, {
      palette,
      delay: delay[index] ?? 100,
      repeat: loop,
      dispose: 1
    });
  });

  gif.finish();
  return Buffer.from(gif.bytes());
};

const buildTarget = async ({ width, height, output }) => {
  const metadata = await sharp(sourcePath, { animated: true }).metadata();
  const frameCount = metadata.pages ?? 1;
  const delay = metadata.delay?.length ? metadata.delay : Array.from({ length: frameCount }, () => 100);
  const frames = [];

  for (let index = 0; index < frameCount; index += 1) {
    const frame = await getFrame(index, width, height);
    frames.push(renderHalftoneFrame(frame, width, height));
  }

  const outputPath = path.join(outputDir, output);
  const encoded = encodeGif({ width, height, frames, delay, loop: metadata.loop ?? 0 });

  await writeFile(outputPath, encoded);

  console.log(`Generated ${outputPath} (${width}x${height}, ${frameCount} frames)`);
};

await mkdir(outputDir, { recursive: true });

for (const target of targets) {
  await buildTarget(target);
}
