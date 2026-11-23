// Normalise un logo importé (PNG, JPG, WEBP, SVG) en blanc uni sur fond transparent,
// détouré et recadré. Utilisé par le formulaire d'upload (src/components/studio/ProjectForm.jsx) :
// le fichier envoyé à l'API est déjà la version normalisée, jamais l'original.
import {
  normalizeLogoPixels,
  boundingBox,
  LOGO_DEFAULT_TOLERANCE,
  LOGO_MAX_EXPORT_HEIGHT,
} from '@/lib/logoNormalizeCore';

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de lire l'image."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Export PNG impossible.'))), 'image/png');
  });
}

export default async function normalizeLogo(file, { tolerance = LOGO_DEFAULT_TOLERANCE } = {}) {
  const { img, url } = await loadImageElement(file);
  try {
    const isSvg = file.type === 'image/svg+xml' || /\.svg$/i.test(file.name || '');
    const naturalWidth = img.naturalWidth || img.width;
    const naturalHeight = img.naturalHeight || img.height;

    // Un SVG est rendu à 4x la hauteur d'export cible pour rester net (vecteur -> raster) ;
    // un format déjà raster est chargé à sa taille native, sans l'agrandir.
    let width = naturalWidth;
    let height = naturalHeight;
    if (isSvg) {
      height = LOGO_MAX_EXPORT_HEIGHT * 4;
      width = Math.round((naturalWidth / naturalHeight) * height) || height;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    normalizeLogoPixels(imageData.data, width, height, tolerance);
    ctx.putImageData(imageData, 0, 0);

    const box = boundingBox(imageData.data, width, height, 2);
    const cropped = document.createElement('canvas');
    cropped.width = box.width;
    cropped.height = box.height;
    cropped
      .getContext('2d')
      .drawImage(canvas, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

    if (box.height <= LOGO_MAX_EXPORT_HEIGHT) {
      return canvasToBlob(cropped);
    }

    const scale = LOGO_MAX_EXPORT_HEIGHT / box.height;
    const resized = document.createElement('canvas');
    resized.width = Math.round(box.width * scale);
    resized.height = LOGO_MAX_EXPORT_HEIGHT;
    resized.getContext('2d').drawImage(cropped, 0, 0, resized.width, resized.height);
    return canvasToBlob(resized);
  } finally {
    URL.revokeObjectURL(url);
  }
}
