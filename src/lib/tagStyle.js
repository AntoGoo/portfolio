const PALETTE = [
  'border-primary/45 bg-primary/10 text-primary',
  'border-violet-500/45 bg-violet-500/10 text-violet-300',
  'border-emerald-500/45 bg-emerald-500/10 text-emerald-300',
  'border-amber-500/45 bg-amber-500/10 text-amber-300',
  'border-sky-500/45 bg-sky-500/10 text-sky-300',
  'border-rose-500/45 bg-rose-500/10 text-rose-300',
];

// Même ordre que PALETTE : couleur seule, pour les pastilles (carré), le texte
// et le soulignement des filtres.
const COLORS = [
  { dot: 'bg-primary', text: 'text-primary', line: 'border-primary' },
  { dot: 'bg-violet-300', text: 'text-violet-300', line: 'border-violet-300' },
  { dot: 'bg-emerald-300', text: 'text-emerald-300', line: 'border-emerald-300' },
  { dot: 'bg-amber-300', text: 'text-amber-300', line: 'border-amber-300' },
  { dot: 'bg-sky-300', text: 'text-sky-300', line: 'border-sky-300' },
  { dot: 'bg-rose-300', text: 'text-rose-300', line: 'border-rose-300' },
];

const normalize = (tag) =>
  tag
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

// Une couleur stable par mot-clé connu, les autres restent stables elles aussi.
const KEYWORDS = {
  ged: 0,
  elo: 0,
  demat: 1,
  dematerialisation: 1,
  'serious game': 2,
  'serious games': 2,
  developpement: 2,
  agile: 3,
  scrum: 3,
  jira: 3,
  web: 4,
  api: 4,
  processus: 4,
  interface: 5,
  interfaces: 5,
  prototypage: 5,
};

const hash = (value) => {
  let total = 0;
  for (let i = 0; i < value.length; i += 1) total += value.charCodeAt(i);
  return total;
};

const paletteIndex = (tag) => {
  const key = normalize(tag);
  return KEYWORDS[key] ?? hash(key) % PALETTE.length;
};

export function tagStyle(tag) {
  return PALETTE[paletteIndex(tag)];
}

export function tagColor(tag) {
  return COLORS[paletteIndex(tag)];
}