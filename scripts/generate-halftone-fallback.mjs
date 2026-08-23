import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import gifenc from "gifenc";
import sharp from "sharp";

const { GIFEncoder } = gifenc;

const SCREENTONE = {
  cellSize: 5,
  contrast: 1.18,
  gamma: 1.02,
  minDotRadius: 0.24,
  maxDotRadius: 2.35,
  paper: { r: 248, g: 248, b: 245, a: 255 },
  ink: { r: 23, g: 23, b: 23, a: 255 }
};

const sourcePath = "public/uploads/home-instrument.gif";
const outputDir = "public/uploads";
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
  const { cellSize: baseCellSize, contrast, gamma, minDotRadius, maxDotRadius, paper, ink } = SCREENTONE;
  const cellSize = width >= 600 ? 7 : baseCellSize;
  const dotScale = cellSize / baseCellSize;

  const seededUnit = (gridX, gridY, salt) => {
    const value = Math.sin(gridX * 12.9898 + gridY * 78.233 + salt * 37.719) * 43758.5453;
    return value - Math.floor(value);
  };

  const fillDot = (centerX, centerY, radius, gridX, gridY) => {
    const stretchX = 0.88 + seededUnit(gridX, gridY, 1) * 0.24;
    const stretchY = 0.88 + seededUnit(gridX, gridY, 2) * 0.24;
    const phase = seededUnit(gridX, gridY, 3) * Math.PI * 2;
    const frequencyA = 2 + Math.floor(seededUnit(gridX, gridY, 6) * 4);
    const frequencyB = frequencyA + 1 + Math.floor(seededUnit(gridX, gridY, 7) * 2);
    const wobbleA = 0.035 + seededUnit(gridX, gridY, 8) * 0.065;
    const wobbleB = 0.018 + seededUnit(gridX, gridY, 9) * 0.04;
    const shiftX = (seededUnit(gridX, gridY, 4) - 0.5) * radius * 0.28;
    const shiftY = (seededUnit(gridX, gridY, 5) - 0.5) * radius * 0.28;
    const reach = radius * 1.35;
    const left = Math.max(0, Math.floor(centerX - reach));
    const right = Math.min(width - 1, Math.ceil(centerX + reach));
    const top = Math.max(0, Math.floor(centerY - reach));
    const bottom = Math.min(height - 1, Math.ceil(centerY + reach));
    const radiusSquared = radius * radius;

    for (let y = top; y <= bottom; y += 1) {
      for (let x = left; x <= right; x += 1) {
        const dx = (x + 0.5 - centerX - shiftX) / stretchX;
        const dy = (y + 0.5 - centerY - shiftY) / stretchY;
        const angle = Math.atan2(dy, dx);
        const edge = 1 + Math.sin(angle * frequencyA + phase) * wobbleA + Math.sin(angle * frequencyB - phase * 0.7) * wobbleB;
        if (dx * dx + dy * dy > radiusSquared * edge * edge) continue;

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
      const radius = (minDotRadius + inkAmount * (maxDotRadius - minDotRadius)) * dotScale;

      if (radius < 0.12) continue;

      const offset = Math.floor(y / cellSize) % 2 === 0 ? 0 : cellSize * 0.45;
      const centerX = x + cellSize / 2 + offset;
      const centerY = y + cellSize / 2;

      if (centerX > width + radius) continue;
      fillDot(centerX, centerY, radius, x / cellSize, y / cellSize);
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
