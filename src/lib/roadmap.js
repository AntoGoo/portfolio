// Outils de la feuille de route : dates françaises du parcours, clients et chiffres clés.
// Tout est calculé depuis les données du studio, rien n'est saisi en dur.

const MONTHS = {
  janv: 0,
  janvier: 0,
  fevr: 1,
  fev: 1,
  fevrier: 1,
  mars: 2,
  avr: 3,
  avril: 3,
  mai: 4,
  juin: 5,
  juil: 6,
  juillet: 6,
  aout: 7,
  sept: 8,
  septembre: 8,
  oct: 9,
  octobre: 9,
  nov: 10,
  novembre: 10,
  dec: 11,
  decembre: 11,
};

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

// « sept. 2024 » → 2024.67 ; « 2021 » → 2021 ; « aujourd'hui » → maintenant.
export function parseFrDate(value, now = new Date()) {
  const text = normalize(value);
  if (!text || text.startsWith('aujourd') || text === 'present' || text === 'en cours') {
    return now.getFullYear() + now.getMonth() / 12;
  }
  const year = text.match(/(19|20)\d{2}/);
  if (!year) return null;
  const word = text.match(/[a-z]+/);
  const month = word && word[0] in MONTHS ? MONTHS[word[0]] : 0;
  return Number(year[0]) + month / 12;
}

export function isOngoing(value) {
  const text = normalize(value);
  return !text || text.startsWith('aujourd') || text === 'en cours';
}

export function experienceSpans(experiences = [], now = new Date()) {
  return experiences
    .map((job) => {
      const start = parseFrDate(job.start, now);
      const end = parseFrDate(job.end, now);
      if (start == null || end == null) return null;
      return { ...job, startValue: start, endValue: Math.max(end, start + 1 / 12), ongoing: isOngoing(job.end) };
    })
    .filter(Boolean)
    .sort((a, b) => a.startValue - b.startValue);
}

// « CDI · Clients : LVMH, La Poste » → ['LVMH', 'La Poste']
export function extractClients(experiences = []) {
  const seen = new Map();
  experiences.forEach((job) => {
    const match = String(job.context || '').match(/clients?\s*:\s*(.+)$/i);
    if (!match) return;
    match[1]
      .split(',')
      .map((name) => name.replace(/[.…]+$/, '').trim())
      .filter(Boolean)
      .forEach((name) => {
        const key = normalize(name);
        if (!seen.has(key)) seen.set(key, name);
      });
  });
  return [...seen.values()];
}

export function yearsOfExperience(spans, now = new Date()) {
  if (!spans.length) return null;
  return now.getFullYear() - Math.floor(spans[0].startValue);
}

// Plus grande équipe coordonnée, lue dans les missions (« Coordination de 13 personnes »).
export function largestTeam(experiences = []) {
  let best = 0;
  experiences.forEach((job) =>
    (job.missions || []).forEach((mission) => {
      const match = normalize(mission).match(/coordination de (?:\d+ a )?(\d+) (?:personnes|salaries)/);
      if (match) best = Math.max(best, Number(match[1]));
    })
  );
  return best || null;
}
