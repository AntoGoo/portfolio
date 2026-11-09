const MONTHS = ['janv', 'fevr', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct', 'nov', 'dec'];

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// « sept. 2024 », « 2012 », « 2021-03 »… → année décimale (2024.67), ou null
// si aucune année n'est lisible (« aujourd'hui », vide).
export function toYearFraction(value) {
  const text = normalize(value);
  const year = text.match(/(19|20)\d{2}/);
  if (!year) return null;
  const numeric = text.match(/(?:19|20)\d{2}-(\d{1,2})/);
  let month = numeric ? parseInt(numeric[1], 10) - 1 : MONTHS.findIndex((m) => text.includes(m));
  if (!(month >= 0 && month < 12)) month = 0;
  return parseInt(year[0], 10) + month / 12;
}

export function currentYearFraction() {
  const now = new Date();
  return now.getFullYear() + now.getMonth() / 12;
}
