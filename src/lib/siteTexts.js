import { siteTexts as defaults } from '@/data/portfolioContent';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// Fusionne les textes enregistrés (stored) sur les valeurs par défaut (base).
// - objets : fusion clé par clé ; une clé absente garde la valeur par défaut ;
// - listes : la liste enregistrée remplace celle par défaut, chaque élément objet
//   étant complété par l'élément de même rang (clés techniques comme `key` ou `id`) ;
// - valeur d'un autre type que la valeur par défaut : ignorée.
export function mergeTexts(base, stored) {
  if (stored === undefined || stored === null) return base;
  if (isObject(base)) {
    if (!isObject(stored)) return base;
    const out = { ...base };
    Object.keys(base).forEach((key) => {
      out[key] = mergeTexts(base[key], stored[key]);
    });
    return out;
  }
  if (Array.isArray(base)) {
    if (!Array.isArray(stored)) return base;
    return stored.map((item, i) => {
      const ref = i < base.length ? base[i] : blankLike(base[0]);
      if (isObject(ref)) return mergeTexts(ref, item);
      if (Array.isArray(ref)) return Array.isArray(item) ? item : ref;
      return typeof item === typeof ref || ref === undefined ? item : String(item ?? '');
    });
  }
  return typeof stored === typeof base ? stored : base;
}

// Modèle vide d'un élément de liste (ajout depuis le studio, ou élément au-delà des défauts).
export function blankLike(ref) {
  if (Array.isArray(ref)) return [];
  if (isObject(ref)) {
    const out = {};
    Object.keys(ref).forEach((key) => {
      out[key] = blankLike(ref[key]);
    });
    return out;
  }
  return typeof ref === 'string' ? '' : ref;
}

export const resolveTexts = (stored) => mergeTexts(defaults, stored);

export { defaults as defaultTexts };
