const PALETTE = [
  'border-primary/45 bg-primary/10 text-primary',
  'border-violet-500/45 bg-violet-500/10 text-violet-300',
  'border-emerald-500/45 bg-emerald-500/10 text-emerald-300',
  'border-amber-500/45 bg-amber-500/10 text-amber-300',
  'border-sky-500/45 bg-sky-500/10 text-sky-300',
  'border-rose-500/45 bg-rose-500/10 text-rose-300',
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

export function tagStyle(tag) {
  const key = normalize(tag);
  const index = KEYWORDS[key] ?? hash(key) % PALETTE.length;
  return PALETTE[index];
}