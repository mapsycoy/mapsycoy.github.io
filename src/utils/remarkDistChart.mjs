const WIDTH = 640;
const HEIGHT = 200;
const MARGIN = { top: 30, right: 16, bottom: 34, left: 16 };
const SAMPLES = 200;
const KINDS = new Set(["normal", "t", "skew-right", "skew-left", "two-normal"]);

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const number = (value, fallback) => {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const parseSpec = (source) => {
  const spec = {};
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error(`invalid line: ${rawLine}`);
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (!key || !value) throw new Error(`invalid line: ${rawLine}`);
    spec[key] = value;
  }
  if (!KINDS.has(spec.kind)) throw new Error(`unknown kind: ${spec.kind ?? "(missing)"}`);
  return spec;
};

const gamma = (z) => {
  const p = [0.9999999999998099, 676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.5073432786869, -0.13857109526572, 9.98436957801957e-6,
    1.50563273514931e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  const shifted = z - 1;
  let sum = p[0];
  for (let index = 1; index < p.length; index += 1) sum += p[index] / (shifted + index);
  const t = shifted + p.length - 1.5;
  return Math.sqrt(2 * Math.PI) * t ** (shifted + 0.5) * Math.exp(-t) * sum;
};

const normalPdf = (x, mean, sd) =>
  Math.exp(-0.5 * ((x - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));

const tPdf = (x, df) =>
  gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gamma(df / 2)) * (1 + x ** 2 / df) ** (-(df + 1) / 2);

const LOG_NORMAL_SIGMA = 0.9;
const LOG_NORMAL_MEDIAN = 1;
const LOG_NORMAL_MEAN = Math.exp(LOG_NORMAL_SIGMA ** 2 / 2);
const logNormalPdf = (x) => x <= 0
  ? 0
  : Math.exp(-(Math.log(x) ** 2) / (2 * LOG_NORMAL_SIGMA ** 2))
    / (x * LOG_NORMAL_SIGMA * Math.sqrt(2 * Math.PI));

const parseShade = (value) => {
  if (!value) return null;
  const [mode, ...rawValues] = value.split(/\s+/);
  const values = rawValues.map(Number);
  if (mode === "right" && values.length === 1 && values.every(Number.isFinite)) return { mode, values };
  if (mode === "left" && values.length === 1 && values.every(Number.isFinite)) return { mode, values };
  if (["between", "outside"].includes(mode) && values.length === 2 && values.every(Number.isFinite)) {
    return { mode, values: values.sort((a, b) => a - b) };
  }
  throw new Error(`invalid shade: ${value}`);
};

const parseMarks = (value) => {
  if (!value) return [];
  return value.split(",").map((item) => {
    const [rawPosition, ...labelParts] = item.trim().split("=");
    const position = Number(rawPosition);
    if (!Number.isFinite(position)) throw new Error(`invalid mark: ${item}`);
    return { position, label: labelParts.join("=").trim() || rawPosition.trim() };
  });
};

const makePoints = (min, max, pdf) => Array.from({ length: SAMPLES + 1 }, (_, index) => {
  const x = min + (max - min) * index / SAMPLES;
  return { x, y: Math.max(0, pdf(x)) };
});

const linePath = (points, xScale, yScale) => points
  .map((point, index) => `${index ? "L" : "M"}${xScale(point.x).toFixed(2)} ${yScale(point.y).toFixed(2)}`)
  .join(" ");

const areaPath = (points, xScale, yScale, baseline) => {
  if (points.length < 2) return "";
  const first = points[0];
  const last = points.at(-1);
  return `M${xScale(first.x).toFixed(2)} ${baseline} ${points.map((point) =>
    `L${xScale(point.x).toFixed(2)} ${yScale(point.y).toFixed(2)}`).join(" ")} L${xScale(last.x).toFixed(2)} ${baseline} Z`;
};

const shadeGroups = (points, shade) => {
  if (!shade) return [];
  const [a, b] = shade.values;
  const included = (x) => shade.mode === "right" ? x >= a
    : shade.mode === "left" ? x <= a
      : shade.mode === "between" ? x >= a && x <= b
        : x <= a || x >= b;
  const groups = [];
  let current = [];
  for (const point of points) {
    if (included(point.x)) current.push(point);
    else if (current.length) { groups.push(current); current = []; }
  }
  if (current.length) groups.push(current);
  return groups;
};

const kindLabel = {
  normal: "Normal distribution",
  t: "Student t distribution",
  "skew-right": "Right-skewed distribution",
  "skew-left": "Left-skewed distribution",
  "two-normal": "Two normal distributions",
};

const renderChart = (spec) => {
  const kind = spec.kind;
  const mean = number(spec.mean, 0);
  const sd = number(spec.sd, 1);
  let min;
  let max;
  let points;
  let secondPoints = null;
  let overlapPoints = null;
  const marks = parseMarks(spec.mark);
  const shade = parseShade(spec.shade);

  if (!Number.isFinite(mean) || !Number.isFinite(sd) || sd <= 0) throw new Error("mean and sd must be finite; sd must be positive");

  if (kind === "normal") {
    min = mean - 4 * sd; max = mean + 4 * sd;
    points = makePoints(min, max, (x) => normalPdf(x, mean, sd));
  } else if (kind === "t") {
    const df = number(spec.df, NaN);
    if (!Number.isFinite(df) || df <= 0) throw new Error("t requires a positive df");
    min = -5; max = 5;
    points = makePoints(min, max, (x) => tPdf(x, df));
    secondPoints = makePoints(min, max, (x) => normalPdf(x, 0, 1));
  } else if (kind === "two-normal") {
    const mean2 = number(spec.mean2, NaN);
    const sd2 = number(spec.sd2, NaN);
    if (!Number.isFinite(mean2) || !Number.isFinite(sd2) || sd2 <= 0) throw new Error("two-normal requires mean2 and a positive sd2");
    min = Math.min(mean - 4 * sd, mean2 - 4 * sd2);
    max = Math.max(mean + 4 * sd, mean2 + 4 * sd2);
    points = makePoints(min, max, (x) => normalPdf(x, mean, sd));
    secondPoints = makePoints(min, max, (x) => normalPdf(x, mean2, sd2));
    overlapPoints = points.map((point, index) => ({ x: point.x, y: Math.min(point.y, secondPoints[index].y) }));
  } else {
    const skewMean = number(spec.mean, NaN);
    const median = number(spec.median, NaN);
    if (!Number.isFinite(skewMean) || !Number.isFinite(median)) throw new Error(`${kind} requires mean and median`);
    min = 0;
    max = 5;
    points = makePoints(min, max, (x) => logNormalPdf(kind === "skew-right" ? x : 5 - x));
    const medianPosition = kind === "skew-right" ? LOG_NORMAL_MEDIAN : 5 - LOG_NORMAL_MEDIAN;
    const meanPosition = kind === "skew-right" ? LOG_NORMAL_MEAN : 5 - LOG_NORMAL_MEAN;
    marks.push(
      { position: medianPosition, label: `median ${median}` },
      { position: meanPosition, label: `mean ${skewMean}` },
    );
  }

  const plotLeft = MARGIN.left;
  const plotRight = WIDTH - MARGIN.right;
  const baseline = HEIGHT - MARGIN.bottom;
  const peak = Math.max(...points.map((point) => point.y), ...(secondPoints ?? []).map((point) => point.y));
  const xScale = (x) => plotLeft + (x - min) / (max - min) * (plotRight - plotLeft);
  const yScale = (y) => baseline - y / peak * (baseline - MARGIN.top);
  const areas = shadeGroups(points, shade).map((group) => areaPath(group, xScale, yScale, baseline)).filter(Boolean);
  const caption = spec.caption || "";
  const ariaLabel = caption || kindLabel[kind];
  const xlabel = spec.xlabel ? `<text class="note-dist-label" x="${(plotLeft + plotRight) / 2}" y="194" text-anchor="middle">${escapeHtml(spec.xlabel)}</text>` : "";
  let previousMarkX = -Infinity;
  let collisionRow = 0;
  const markSvg = marks.filter(({ position }) => position >= min && position <= max).map(({ position, label }) => {
    const scaledX = xScale(position);
    if (scaledX - previousMarkX < 64) collisionRow = (collisionRow + 1) % 2;
    else collisionRow = 0;
    previousMarkX = scaledX;
    const x = scaledX.toFixed(2);
    const anchor = scaledX > plotRight - 55 ? "end" : scaledX < plotLeft + 55 ? "start" : "middle";
    const labelX = anchor === "end" ? scaledX - 3 : anchor === "start" ? scaledX + 3 : scaledX;
    const labelY = 11 + collisionRow * 12;
    return `<line class="note-dist-mark" x1="${x}" y1="${MARGIN.top}" x2="${x}" y2="${baseline}"/><text class="note-dist-label" x="${labelX.toFixed(2)}" y="${labelY}" text-anchor="${anchor}">${escapeHtml(label)}</text>`;
  }).join("");
  const secondaryClass = kind === "t" ? " note-dist-curve-reference" : "";

  return `<figure class="note-dist"><svg viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escapeHtml(ariaLabel)}"><line class="note-dist-axis" x1="${plotLeft}" y1="${baseline}" x2="${plotRight}" y2="${baseline}"/>${overlapPoints ? `<path class="note-dist-overlap" d="${areaPath(overlapPoints, xScale, yScale, baseline)}"/>` : ""}${areas.map((path) => `<path class="note-dist-shade" d="${path}"/>`).join("")}<path class="note-dist-curve" d="${linePath(points, xScale, yScale)}"/>${secondPoints ? `<path class="note-dist-curve${secondaryClass}" d="${linePath(secondPoints, xScale, yScale)}"/>` : ""}${markSvg}${xlabel}</svg>${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
};

export const renderDistChart = (source) => renderChart(parseSpec(source));

const visit = (node, file) => {
  if (!node || !Array.isArray(node.children)) return;
  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];
    if (child?.type === "code" && child.lang === "dist") {
      try {
        node.children[index] = { type: "html", value: renderDistChart(child.value ?? "") };
      } catch (error) {
        const location = file?.path ? ` in ${file.path}` : "";
        console.warn(`[remark-dist-chart] Keeping invalid dist block${location}: ${error.message}`);
      }
      continue;
    }
    visit(child, file);
  }
};

export default function remarkDistChart() {
  return (tree, file) => visit(tree, file);
}