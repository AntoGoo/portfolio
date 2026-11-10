// Couleurs des repères de tags : même saturation, lisibles sur le fond sombre.
const PALETTE = [
  '#5B9CF6', // bleu
  '#F2B53A', // ambre
  '#8FC1A9', // sauge
  '#E0896C', // terracotta
  '#A99BE0', // lavande
  '#6FC3D9', // cyan
];

const normalize = (tag) =>
  tag
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

// Une couleur stable par mot-clé connu, les autres restent stables elles aussi.
// Les catégories d'un même jeu de données ont chacune leur couleur :
// en ligne (GED, Dématérialisation, Serious game, IA, Mapping) comme dans
// les exemples (Dématérialisation, Produit, Agile, Processus, Interfaces).
const KEYWORDS = {
  ged: 0,
  elo: 0,
  demat: 1,
  dematerialisation: 1,
  'serious game': 2,
  'serious games': 2,
  developpement: 2,
  produit: 2,
  agile: 3,
  scrum: 3,
  jira: 3,
  web: 4,
  api: 4,
  processus: 4,
  ia: 4,
  interface: 5,
  interfaces: 5,
  prototypage: 5,
  mapping: 5,
};

const hash = (value) => {
  let total = 0;
  for (let i = 0; i < value.length; i += 1) total += value.charCodeAt(i);
  return total;
};

export function tagColor(tag) {
  const key = normalize(tag);
  const index = KEYWORDS[key] ?? hash(key) % PALETTE.length;
  return PALETTE[index];
}
