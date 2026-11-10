// Période des projets (`start_date` / `end_date`, « AAAA-MM »). Mois abrégés
// comme les dates saisies dans Parcours (« sept. 2024 »).
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

const parse = (value) => {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec((value || '').trim());
  return match ? { year: match[1], month: MONTHS[Number(match[2]) - 1] } : null;
};

// « mars 2023 », « mars — juin 2023 », « sept. 2024 — sept. 2026 », ou '' sans date.
export function formatProjectDate(start, end) {
  const from = parse(start);
  const to = parse(end);
  if (!from && !to) return '';
  if (!from || !to) {
    const only = from || to;
    return `${only.month} ${only.year}`;
  }
  if (start === end) return `${from.month} ${from.year}`;
  if (from.year === to.year) return `${from.month} — ${to.month} ${to.year}`;
  return `${from.month} ${from.year} — ${to.month} ${to.year}`;
}

const sortKey = (project) => parse(project.end_date) ? project.end_date : parse(project.start_date) ? project.start_date : '';

// Du plus récent au plus ancien (fin, sinon début) ; les projets sans date
// gardent leur ordre d'origine, à la fin.
export function sortProjectsByDate(projects) {
  return projects
    .map((project, index) => ({ project, index, key: sortKey(project) }))
    .sort((a, b) => {
      if (a.key && b.key && a.key !== b.key) return a.key < b.key ? 1 : -1;
      if (a.key && !b.key) return -1;
      if (!a.key && b.key) return 1;
      return a.index - b.index;
    })
    .map(({ project }) => project);
}
