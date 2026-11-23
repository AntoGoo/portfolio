// Algorithme pur (pas de dépendance DOM/Node) de normalisation d'un logo en blanc sur fond
// transparent. Travaille sur un buffer RGBA indexable (Uint8ClampedArray côté navigateur,
// Buffer côté Node avec sharp) : partagé tel quel entre src/lib/normalizeLogo.js (navigateur)
// et scripts/normalize-logos.mjs (migration), pour garantir le même résultat des deux côtés.

const BORDER_RING = 2;
const TRANSPARENT_ALPHA_THRESHOLD = 10;
const DEFAULT_TOLERANCE = 40;
const ALPHA_FALLOFF_RANGE = 120;

function colorDistance(data, i, bg) {
  const dr = data[i] - bg[0];
  const dg = data[i + 1] - bg[1];
  const db = data[i + 2] - bg[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function isBorderRingPixel(x, y, width, height) {
  return x < BORDER_RING || x >= width - BORDER_RING || y < BORDER_RING || y >= height - BORDER_RING;
}

// Fond déjà transparent (majorité du pourtour à alpha < 10), ou couleur de fond (médiane RGB
// du pourtour) sinon.
export function detectBackground(data, width, height) {
  const reds = [];
  const greens = [];
  const blues = [];
  let transparentCount = 0;
  let total = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!isBorderRingPixel(x, y, width, height)) continue;
      const i = (y * width + x) * 4;
      total += 1;
      if (data[i + 3] < TRANSPARENT_ALPHA_THRESHOLD) {
        transparentCount += 1;
      } else {
        reds.push(data[i]);
        greens.push(data[i + 1]);
        blues.push(data[i + 2]);
      }
    }
  }
  const isTransparent = total > 0 && transparentCount / total > 0.5;
  const bgColor = reds.length ? [median(reds), median(greens), median(blues)] : [255, 255, 255];
  return { isTransparent, bgColor };
}

// Flood fill multi-sources depuis tout le pourtour (1 px), 4-connexité, tolérance sur la
// distance couleur au fond. Renvoie un Uint8Array (0/1) marquant les pixels de fond détourés.
function floodFillBackground(data, width, height, bgColor, tolerance) {
  const filled = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const tryEnqueue = (x, y) => {
    const idx = y * width + x;
    if (filled[idx]) return;
    const i = idx * 4;
    if (colorDistance(data, i, bgColor) >= tolerance) return;
    filled[idx] = 1;
    queue[tail] = idx;
    tail += 1;
  };

  for (let x = 0; x < width; x += 1) {
    tryEnqueue(x, 0);
    tryEnqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    tryEnqueue(0, y);
    tryEnqueue(width - 1, y);
  }

  while (head < tail) {
    const idx = queue[head];
    head += 1;
    const x = idx % width;
    const y = (idx / width) | 0;
    if (x > 0) tryEnqueue(x - 1, y);
    if (x < width - 1) tryEnqueue(x + 1, y);
    if (y > 0) tryEnqueue(x, y - 1);
    if (y < height - 1) tryEnqueue(x, y + 1);
  }

  return filled;
}

// Transforme `data` (RGBA, en place) en blanc uni sur fond transparent.
export function normalizeLogoPixels(data, width, height, tolerance = DEFAULT_TOLERANCE) {
  const { isTransparent, bgColor } = detectBackground(data, width, height);

  if (isTransparent) {
    for (let p = 0; p < width * height; p += 1) {
      const i = p * 4;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      // alpha inchangé.
    }
    return;
  }

  const filled = floodFillBackground(data, width, height, bgColor, tolerance);
  for (let p = 0; p < width * height; p += 1) {
    const i = p * 4;
    if (filled[p]) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 0;
      continue;
    }
    const distance = colorDistance(data, i, bgColor);
    const alphaFactor = Math.max(0, Math.min(1, distance / ALPHA_FALLOFF_RANGE));
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = Math.round(data[i + 3] * alphaFactor);
  }
}

// Boîte englobante des pixels non transparents, avec une marge (clampée aux bords).
export function boundingBox(data, width, height, margin = 2) {
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha === 0) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < x0 || y1 < y0) return { x: 0, y: 0, width, height };
  return {
    x: Math.max(0, x0 - margin),
    y: Math.max(0, y0 - margin),
    width: Math.min(width, x1 + margin + 1) - Math.max(0, x0 - margin),
    height: Math.min(height, y1 + margin + 1) - Math.max(0, y0 - margin),
  };
}

export const LOGO_DEFAULT_TOLERANCE = DEFAULT_TOLERANCE;
export const LOGO_MAX_EXPORT_HEIGHT = 144;
