// Migration unique : repasse tous les logos de projets déjà en base dans l'algorithme de
// src/lib/normalizeLogo.js (blanc sur fond transparent, détouré) et réécrit les fichiers R2
// en place (même clé, donc aucun changement de logo_url en base).
//
// Usage :
//   node scripts/normalize-logos.mjs --remote                  (production)
//   node scripts/normalize-logos.mjs --local                   (D1/R2 locaux de wrangler dev)
//   node scripts/normalize-logos.mjs --remote --tolerance=50
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import {
  normalizeLogoPixels,
  boundingBox,
  LOGO_MAX_EXPORT_HEIGHT,
  LOGO_DEFAULT_TOLERANCE,
} from '../src/lib/logoNormalizeCore.js';

const BUCKET = 'portfolio-files';

const args = process.argv.slice(2);
const target = args.includes('--remote') ? '--remote' : args.includes('--local') ? '--local' : null;
if (!target) {
  console.error('Précise la cible : --remote (production) ou --local.');
  process.exit(1);
}
const toleranceArg = args.find((a) => a.startsWith('--tolerance='));
const tolerance = toleranceArg ? Number(toleranceArg.split('=')[1]) : LOGO_DEFAULT_TOLERANCE;

function wrangler(cmdArgs) {
  return execFileSync('npx', ['wrangler', ...cmdArgs], { encoding: 'utf8' });
}

function listLogos() {
  const out = wrangler([
    'd1',
    'execute',
    'portfolio',
    target,
    '--command',
    "SELECT id, logo_url FROM projects WHERE logo_url != ''",
    '--json',
  ]);
  const [{ results }] = JSON.parse(out);
  return results;
}

// Charge l'image source ; un SVG est rendu à 4x la hauteur d'export cible (comme le
// navigateur), les autres formats à leur taille native.
async function loadRaster(srcPath, isSvg) {
  if (!isSvg) {
    return sharp(srcPath).ensureAlpha();
  }
  const probe = await sharp(srcPath).metadata();
  const targetHeight = LOGO_MAX_EXPORT_HEIGHT * 4;
  const density = 96 * (targetHeight / (probe.height || targetHeight));
  return sharp(srcPath, { density }).ensureAlpha();
}

async function processLogo(key, tmpDir) {
  const srcPath = join(tmpDir, `src-${key.replace(/[^a-z0-9.]/gi, '_')}`);
  const outPath = join(tmpDir, `out-${key.replace(/[^a-z0-9.]/gi, '_')}.png`);
  wrangler(['r2', 'object', 'get', `${BUCKET}/${key}`, '--file', srcPath, target]);

  const isSvg = key.toLowerCase().endsWith('.svg');
  const image = await loadRaster(srcPath, isSvg);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  normalizeLogoPixels(data, info.width, info.height, tolerance);
  const box = boundingBox(data, info.width, info.height, 2);

  let pipeline = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).extract({
    left: box.x,
    top: box.y,
    width: box.width,
    height: box.height,
  });
  if (box.height > LOGO_MAX_EXPORT_HEIGHT) {
    pipeline = pipeline.resize({ height: LOGO_MAX_EXPORT_HEIGHT });
  }
  await pipeline.png().toFile(outPath);

  wrangler(['r2', 'object', 'put', `${BUCKET}/${key}`, '--file', outPath, '--content-type', 'image/png', target]);
}

async function main() {
  const logos = listLogos();
  if (!logos.length) {
    console.log('Aucun logo à migrer.');
    return;
  }
  console.log(`${logos.length} logo(s) à traiter (${target}, tolérance ${tolerance}).`);
  const tmpDir = mkdtempSync(join(tmpdir(), 'normalize-logos-'));
  try {
    for (const { id, logo_url } of logos) {
      const key = logo_url.replace(/^\/files\//, '');
      process.stdout.write(`- ${id} (${key})... `);
      try {
        await processLogo(key, tmpDir);
        console.log('ok');
      } catch (err) {
        console.log(`échec : ${err.message}`);
      }
    }
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
  console.log('Terminé.');
}

main();
