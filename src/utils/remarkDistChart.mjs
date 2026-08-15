// 노트용 분포 그래프. ```dist 코드펜스를 빌드 타임에 인라인 SVG로 치환한다.
// 외부 의존성 없음. 색은 전부 CSS 변수를 쓰므로 다크모드 자동 대응.

const W = 640;
const H = 200;
const PAD = { top: 30, right: 16, bottom: 34, left: 16 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const BASE_Y = PAD.top + PLOT_H;
const N = 150;

/* ---------- 수학 ---------- */

function normalPdf(x, mu = 0, sd = 1) {
  const z = (x - mu) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}

// Lanczos 근사. 그림용이므로 이 정밀도로 충분하다.
const LANCZOS = [
  676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012,
  9.9843695780195716e-6, 1.5056327351493116e-7,
];

function gamma(z) {
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < LANCZOS.length; i++) x += LANCZOS[i] / (z + i + 1);
  const t = z + LANCZOS.length - 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function tPdf(x, df) {
  const c = gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gamma(df / 2));
  return c * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
}

// Abramowitz & Stegun 7.1.26
function erf(x) {
  const s = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-x * x);
  return s * y;
}

const beta = (a, b) => (gamma(a) * gamma(b)) / gamma(a + b);

function fPdf(x, d1, d2) {
  if (x <= 0) return 0;
  const num = Math.pow(d1 * x, d1) * Math.pow(d2, d2);
  const den = Math.pow(d1 * x + d2, d1 + d2);
  return Math.sqrt(num / den) / (x * beta(d1 / 2, d2 / 2));
}

function chi2Pdf(x, k) {
  if (x <= 0) return 0;
  return (
    Math.pow(x, k / 2 - 1) * Math.exp(-x / 2) /
    (Math.pow(2, k / 2) * gamma(k / 2))
  );
}

function lognormalPdfWith(sigma) {
  return (x) =>
    x <= 0
      ? 0
      : Math.exp(-Math.pow(Math.log(x), 2) / (2 * sigma * sigma)) /
        (x * sigma * Math.sqrt(2 * Math.PI));
}

// 결정적 난수. 빌드마다 SVG가 달라지면 git 노이즈가 된다.
function lcg(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function gaussPair(rand) {
  const u = Math.max(rand(), 1e-12);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}


/* ---------- 파싱 ---------- */

function parseBlock(src) {
  const out = {};
  for (const rawLine of src.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const at = line.indexOf(":");
    if (at === -1) continue;
    out[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return out;
}

const num = (v, fallback) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

function parseShade(spec) {
  if (!spec) return null;
  const [mode, ...rest] = spec.trim().split(/\s+/);
  const vals = rest.map(Number).filter(Number.isFinite);
  if (mode === "right" && vals.length >= 1) return { mode, a: vals[0] };
  if (mode === "left" && vals.length >= 1) return { mode, a: vals[0] };
  if ((mode === "between" || mode === "outside") && vals.length >= 2)
    return { mode, a: Math.min(vals[0], vals[1]), b: Math.max(vals[0], vals[1]) };
  return null;
}

function parseMarks(spec) {
  if (!spec) return [];
  return spec
    .split(",")
    .map((chunk) => {
      const [rawX, ...labelParts] = chunk.split("=");
      const x = Number.parseFloat(rawX);
      if (!Number.isFinite(x)) return null;
      return { x, label: labelParts.join("=").trim() || null };
    })
    .filter(Boolean);
}
function parseData(spec) {
  if (!spec) return [];
  const values = spec.split(",").map((chunk) => Number.parseFloat(chunk.trim()));
  if (!values.length || values.some((value) => !Number.isFinite(value))) {
    throw new Error("data must be a comma-separated list of numbers");
  }
  return values;
}

/* ---------- 곡선 → path ---------- */

function makeScale(xMin, xMax, yMax) {
  return {
    sx: (x) => PAD.left + ((x - xMin) / (xMax - xMin)) * PLOT_W,
    sy: (y) => BASE_Y - (y / yMax) * PLOT_H,
  };
}

function sample(fn, xMin, xMax) {
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const x = xMin + ((xMax - xMin) * i) / N;
    pts.push([x, fn(x)]);
  }
  return pts;
}

function toPath(pts, s) {
  return pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${s.sx(x).toFixed(1)} ${s.sy(y).toFixed(1)}`)
    .join(" ");
}

function toArea(pts, s) {
  if (!pts.length) return "";
  const first = pts[0];
  const last = pts[pts.length - 1];
  return (
    `M${s.sx(first[0]).toFixed(1)} ${BASE_Y} ` +
    pts.map(([x, y]) => `L${s.sx(x).toFixed(1)} ${s.sy(y).toFixed(1)}`).join(" ") +
    ` L${s.sx(last[0]).toFixed(1)} ${BASE_Y} Z`
  );
}

function shadeRanges(shade, xMin, xMax) {
  if (!shade) return [];
  switch (shade.mode) {
    case "right":
      return [[shade.a, xMax]];
    case "left":
      return [[xMin, shade.a]];
    case "between":
      return [[shade.a, shade.b]];
    case "outside":
      return [
        [xMin, shade.a],
        [shade.b, xMax],
      ];
    default:
      return [];
  }
}

/* ---------- SVG 조립 ---------- */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function buildSvg({ curves, shade, marks, data, rugPositions, xMin, xMax, yMax, xlabel, aria }) {
  const s = makeScale(xMin, xMax, yMax);
  const parts = [];
  const hasSpreadGuides = curves.some((curve) => curve.spreadLabel);
  const svgH = H + (hasSpreadGuides ? 36 : 0);

  // 음영은 첫 곡선 기준
  const main = curves.find((c) => !c.faint) ?? curves[0];
  for (const [a, b] of shadeRanges(shade, xMin, xMax)) {
    const seg = main.pts.filter(([x]) => x >= a && x <= b);
    if (seg.length > 1) {
      parts.push(
        `<path d="${toArea(seg, s)}" fill="var(--accent)" fill-opacity="0.18" stroke="none" />`
      );
    }
  }

  // 겹침 채우기는 two-normal 전용이다.
  // t / sampling에서는 두 곡선의 최솟값이 아무 의미도 없는 얼룩이 된다.
  if (curves.length === 2 && curves[0].overlap && !shade) {
    const overlap = curves[0].pts.map(([x, y], i) => [x, Math.min(y, curves[1].pts[i][1])]);
    parts.push(
      `<path d="${toArea(overlap, s)}" fill="var(--accent)" fill-opacity="0.16" stroke="none" />`
    );
  }

  // baseline
  parts.push(
    `<line x1="${PAD.left}" y1="${BASE_Y}" x2="${W - PAD.right}" y2="${BASE_Y}" stroke="var(--line)" stroke-width="1" />`
  );
  // 원자료 러그. 곡선은 개념도이고, 점은 data의 최소–최대 범위를 별도로 사용한다.
  if (data.length) {
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    const dataSpan = dataMax - dataMin;
    const rows = [-Infinity, -Infinity, -Infinity];
    const placed = data
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value)
      .map(({ value, index }) => {
        const px = rugPositions
          ? s.sx(rugPositions[index])
          : dataSpan === 0
            ? PAD.left + PLOT_W / 2
            : PAD.left + ((value - dataMin) / dataSpan) * PLOT_W;
        let row = rows.findIndex((lastX) => px - lastX >= 18);
        if (row === -1) row = rows.indexOf(Math.min(...rows));
        rows[row] = px;
        return { value, px, row };
      });

    for (const point of placed) {
      const cy = BASE_Y + 5 + point.row * 5;
      const ly = BASE_Y + 17 + point.row * 5;
      const anchor = point.px <= PAD.left + 4 ? "start" : point.px >= W - PAD.right - 4 ? "end" : "middle";
      parts.push(
        `<circle cx="${point.px.toFixed(1)}" cy="${cy}" r="2.5" fill="var(--accent)" />`
      );
      parts.push(
        `<text x="${point.px.toFixed(1)}" y="${ly}" fill="var(--muted)" font-family="var(--font-mono, monospace)" font-size="9" text-anchor="${anchor}">${esc(point.value)}</text>`
      );
    }
  }

  // 세로 표시선
  for (const m of marks) {
    if (m.x < xMin || m.x > xMax) continue;
    const px = s.sx(m.x).toFixed(1);
    parts.push(
      `<line x1="${px}" y1="${PAD.top - 4}" x2="${px}" y2="${BASE_Y}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2 3" />`
    );
    if (m.label) {
      const ly = PAD.top - 8 + (m.row ? 12 : 0);
      parts.push(
        `<text x="${px}" y="${ly}" fill="var(--muted)" font-family="var(--font-mono, monospace)" font-size="10" text-anchor="middle">${esc(m.label)}</text>`
      );
    }
    if (!m.hideValue && !(data.length && m.label)) {
      const valueY = m.valueAboveAxis ? BASE_Y - 6 : BASE_Y + 14;
      parts.push(
        `<text x="${px}" y="${valueY}" fill="var(--muted)" font-family="var(--font-mono, monospace)" font-size="10" text-anchor="middle">${esc(m.x)}</text>`
      );
    }
  }

  // 곡선
  for (const c of curves) {
    parts.push(
      `<path d="${toPath(c.pts, s)}" fill="none" stroke="currentColor" stroke-width="1.5"` +
        (c.faint ? ` stroke-opacity="0.4" stroke-dasharray="4 3"` : "") +
        ` />`
    );
  }
  // 곡선 직접 라벨. 곡선과 겹치지 않도록 지정 지점보다 위에 둔다.
  for (const c of curves) {
    if (!c.label || !Number.isFinite(c.labelX) || !Number.isFinite(c.labelY)) continue;
    const lx = s.sx(c.labelX);
    const ly = Math.max(PAD.top + 10, s.sy(c.labelY) - 8);
    parts.push(
      `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="var(--muted)" font-family="var(--font-mono, monospace)" font-size="10" text-anchor="${c.labelAnchor || "middle"}">${esc(c.label)}</text>`
    );
  }
  // 평균에서 +1 SD까지의 거리를 직접 보여주는 수평 가이드.
  let spreadRow = 0;
  for (const c of curves) {
    if (!c.spreadLabel || !Number.isFinite(c.spreadFrom) || !Number.isFinite(c.spreadTo)) continue;
    const x1 = s.sx(c.spreadFrom);
    const x2 = s.sx(c.spreadTo);
    const gy = BASE_Y + 16 + spreadRow * 18;
    spreadRow++;
    parts.push(
      `<path d="M${x1.toFixed(1)} ${gy - 3} V${gy + 3} M${x1.toFixed(1)} ${gy} H${x2.toFixed(1)} M${x2.toFixed(1)} ${gy - 3} V${gy + 3}" fill="none" stroke="var(--muted)" stroke-width="1" />`
    );
    parts.push(
      `<text x="${((x1 + x2) / 2).toFixed(1)}" y="${gy - 6}" fill="var(--muted)" font-family="var(--font-mono, monospace)" font-size="9" text-anchor="middle">${esc(c.spreadLabel)}</text>`
    );
  }

  if (xlabel) {
    parts.push(
      `<text x="${W - PAD.right}" y="${svgH - 6}" fill="var(--muted)" font-family="var(--font-mono, monospace)" font-size="10" text-anchor="end">${esc(xlabel)}</text>`
    );
  }

  return `<svg viewBox="0 0 ${W} ${svgH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(aria)}">${parts.join("")}</svg>`;
}

/* ---------- kind별 ---------- */

function render(src) {
  const o = parseBlock(src);
  const kind = o.kind;
  const shade = parseShade(o.shade);
  const marks = parseMarks(o.mark);
  const data = parseData(o.data);
  const xlabel = o.xlabel || null;

  let curves, xMin, xMax, aria;
  let rugPositions = null;

  if (kind === "normal") {
    const mu = num(o.mean, 0);
    const sd = num(o.sd, 1);
    xMin = mu - 4 * sd;
    xMax = mu + 4 * sd;
    curves = [{ pts: sample((x) => normalPdf(x, mu, sd), xMin, xMax) }];
    rugPositions = data.length ? [...data] : null;
    aria = `평균 ${mu}, 표준편차 ${sd}인 정규분포 곡선`;
  } else if (kind === "t") {
    const df = num(o.df, 5);
    xMin = -5;
    xMax = 5;
    curves = [
      { pts: sample((x) => normalPdf(x, 0, 1), xMin, xMax), faint: true },
      { pts: sample((x) => tPdf(x, df), xMin, xMax) },
    ];
    aria = `자유도 ${df}인 t 분포와 표준정규분포 비교`;
  } else if (kind === "skew-right" || kind === "skew-left") {
    // 로그정규 형태를 쓴다. 완료 시간·오류 횟수처럼 하한이 0인 데이터의 실제 모양이고,
    // skew-normal보다 평균-중앙값 간격이 커서 모식도로서 읽힌다.
    const sigma = 0.9;
    const XR = 5;
    const lognormalPdf = (x) =>
      x <= 0
        ? 0
        : Math.exp(-Math.pow(Math.log(x), 2) / (2 * sigma * sigma)) /
          (x * sigma * Math.sqrt(2 * Math.PI));

    const shapeMedian = 1;                            // e^mu, mu = 0
    const shapeMean = Math.exp((sigma * sigma) / 2);  // e^(mu + sigma^2/2)

    const flip = kind === "skew-left";
    const fn = (x) => lognormalPdf(flip ? XR - x : x);

    xMin = 0;
    xMax = XR;
    curves = [{ pts: sample(fn, xMin, xMax) }];

    const posMedian = flip ? XR - shapeMedian : shapeMedian;
    const posMean = flip ? XR - shapeMean : shapeMean;

    const uMean = o.mean ?? null;
    const uMedian = o.median ?? null;
    // skew-right 원자료는 중앙값·평균 표시선과 같은 좌표계에 맞춘다.
    // 실제 간격을 그대로 보존하지 않고 세 구간을 단조롭게 보간한 시각적 안내다.
    const meanValue = Number.parseFloat(uMean);
    const medianValue = Number.parseFloat(uMedian);
    if (
      !flip &&
      data.length &&
      Number.isFinite(meanValue) &&
      Number.isFinite(medianValue) &&
      meanValue > medianValue
    ) {
      const dataMin = Math.min(...data);
      const dataMax = Math.max(...data);
      rugPositions = data.map((value) => {
        if (value <= medianValue) {
          const span = medianValue - dataMin;
          return span > 0
            ? xMin + ((value - dataMin) / span) * (shapeMedian - xMin)
            : shapeMedian;
        }
        if (value <= meanValue) {
          return shapeMedian +
            ((value - medianValue) / (meanValue - medianValue)) * (shapeMean - shapeMedian);
        }
        const span = dataMax - meanValue;
        return span > 0
          ? shapeMean + ((value - meanValue) / span) * (xMax - shapeMean)
          : shapeMean;
      });
    }

    marks.push(
      {
        x: posMedian,
        label: uMedian === null ? "중앙값" : `중앙값 ${uMedian}`,
        hideValue: true,
        row: 1,
      },
      {
        x: posMean,
        label: uMean === null ? "평균" : `평균 ${uMean}`,
        hideValue: true,
        row: 0,
      }
    );
    aria = `${kind === "skew-right" ? "오른쪽" : "왼쪽"}으로 치우친 분포에서 평균과 중앙값의 위치`;
  } else if (kind === "two-normal") {
    const m1 = num(o.mean, -1);
    const s1 = num(o.sd, 1);
    const m2 = num(o.mean2, 1);
    const s2 = num(o.sd2, 1);
    xMin = Math.min(m1 - 4 * s1, m2 - 4 * s2);
    xMax = Math.max(m1 + 4 * s1, m2 + 4 * s2);
    const labelX1 = m1 - 0.8 * s1;
    const labelX2 = m2 + 1.2 * s2;
    curves = [
      {
        pts: sample((x) => normalPdf(x, m1, s1), xMin, xMax),
        overlap: true,
        label: o.label || null,
        labelX: labelX1,
        labelY: normalPdf(labelX1, m1, s1),
        labelAnchor: "end",
        spreadFrom: m1,
        spreadTo: m1 + s1,
        spreadLabel: `${o.label || "X"} · 1 SD (${s1}초)`,
      },
      {
        pts: sample((x) => normalPdf(x, m2, s2), xMin, xMax),
        overlap: true,
        label: o.label2 || null,
        labelX: labelX2,
        labelY: normalPdf(labelX2, m2, s2),
        labelAnchor: "start",
        spreadFrom: m2,
        spreadTo: m2 + s2,
        spreadLabel: `${o.label2 || "Y"} · 1 SD (${s2}초)`,
      },
    ];
    // 아래쪽 SD 가이드와 겹치지 않도록 공통 평균의 축 값은 기준선 위에 둔다.
    for (const mark of marks) mark.valueAboveAxis = true;
    aria = `평균 ${m1}, 표준편차 ${s1}인 분포와 평균 ${m2}, 표준편차 ${s2}인 분포의 겹침`;
  } else if (kind === "f") {
    const d1 = num(o.df1, 3);
    const d2 = num(o.df2, 20);
    xMin = 0;
    xMax = Math.max(5, num(o.xmax, 5));
    curves = [{ pts: sample((x) => fPdf(x, d1, d2), xMin, xMax) }];
    aria = `자유도 ${d1}, ${d2}인 F 분포`;
  } else if (kind === "chi2") {
    const df = num(o.df, 4);
    xMin = 0;
    xMax = num(o.xmax, Math.max(12, df * 3));
    curves = [{ pts: sample((x) => chi2Pdf(x, df), xMin, xMax) }];
    aria = `자유도 ${df}인 카이제곱 분포`;
  } else if (kind === "sampling") {
    // 중심극한정리. 원자료 분포(치우침)와 표본평균 분포(정규, 좁음)를 같은 축에 겹친다.
    const n = Math.max(2, num(o.n, 25));
    const sigma = num(o.sigma, 0.9);
    const pop = lognormalPdfWith(sigma);
    const popMean = Math.exp((sigma * sigma) / 2);
    const popSd = Math.sqrt((Math.exp(sigma * sigma) - 1) * Math.exp(sigma * sigma));
    const se = popSd / Math.sqrt(n);

    xMin = 0;
    xMax = 5;
    curves = [
      { pts: sample(pop, xMin, xMax), faint: true },
      { pts: sample((x) => normalPdf(x, popMean, se), xMin, xMax) },
    ];
    marks.push({ x: popMean, label: `모평균`, hideValue: true, row: 0 });
    aria = `원자료 분포와 표본크기 ${n}일 때 표본평균의 분포`;
  } else if (kind === "ci") {
    return renderCi(o);
  } else {
    return null; // 알 수 없는 kind → 코드블록으로 남긴다
  }

  const yMax = Math.max(...curves.flatMap((c) => c.pts.map(([, y]) => y)));
  const svg = buildSvg({ curves, shade, marks, data, rugPositions, xMin, xMax, yMax, xlabel, aria });
  const caption = o.caption
    ? `<figcaption>${esc(o.caption)}</figcaption>`
    : "";

  return `<figure class="note-dist">${svg}${caption}</figure>`;
}

/* ---------- 신뢰구간 반복표집 그림 ---------- */

function renderCi(o) {
  const count = Math.min(40, Math.max(5, Math.round(num(o.n, 20))));
  const level = num(o.level, 0.95);
  const z = level >= 0.99 ? 2.576 : level >= 0.95 ? 1.96 : 1.645;
  const rand = lcg(Math.round(num(o.seed, 7)));

  const H2 = 40 + count * 7;
  const padX = 16;
  const midX = W / 2;
  const scale = (W - padX * 2) / 12; // ±6 SE 폭. 좁으면 구간이 화면 밖으로 나간다

  const parts = [];
  parts.push(
    `<line x1="${midX}" y1="14" x2="${midX}" y2="${H2 - 20}" stroke="var(--line)" stroke-width="1" />`
  );
  parts.push(
    `<text x="${midX}" y="10" fill="var(--muted)" font-family="var(--font-mono, monospace)" font-size="10" text-anchor="middle">모평균</text>`
  );

  let missed = 0;
  for (let i = 0; i < count; i++) {
    const center = gaussPair(rand);
    const lo = center - z;
    const hi = center + z;
    const covers = lo <= 0 && hi >= 0;
    if (!covers) missed++;
    const y = 20 + i * 7;
    const x1 = midX + lo * scale;
    const x2 = midX + hi * scale;
    const cx = midX + center * scale;
    const stroke = covers ? "currentColor" : "var(--accent)";
    const op = covers ? "0.45" : "1";
    parts.push(
      `<line x1="${x1.toFixed(0)}" y1="${y}" x2="${x2.toFixed(0)}" y2="${y}" stroke="${stroke}" stroke-opacity="${op}" stroke-width="1.5" />`
    );
    parts.push(
      `<circle cx="${cx.toFixed(0)}" cy="${y}" r="1.6" fill="${stroke}" fill-opacity="${op}" />`
    );
  }

  parts.push(
    `<text x="${W - padX}" y="${H2 - 4}" fill="var(--muted)" font-family="var(--font-mono, monospace)" font-size="10" text-anchor="end">${count}개 중 ${count - missed}개가 모평균을 포함</text>`
  );

  const aria = `${Math.round(level * 100)}% 신뢰구간을 ${count}번 반복 표집한 그림`;
  const svg = `<svg viewBox="0 0 ${W} ${H2}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(aria)}">${parts.join("")}</svg>`;
  const caption = o.caption ? `<figcaption>${esc(o.caption)}</figcaption>` : "";
  return `<figure class="note-dist">${svg}${caption}</figure>`;
}

/* ---------- remark 플러그인 ---------- */

export default function remarkDistChart() {
  return (tree) => walk(tree);
}

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === "code" && child.lang === "dist") {
      let html = null;
      try {
        html = render(child.value);
      } catch (err) {
        console.warn("[dist] render failed:", err.message);
      }
      if (html) {
        node.children[i] = { type: "html", value: html };
        continue;
      }
      console.warn("[dist] unrecognised block, left as code");
    }
    walk(child);
  }
}

export { render as renderDistBlock };