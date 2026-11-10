// Accès D1 partagé par les Pages Functions.

export const TABLES = {
  projects: {
    columns: ['title', 'year', 'start_date', 'end_date', 'context', 'problem', 'objectives', 'role', 'methodology',
      'solutions', 'results', 'tags', 'link', 'link_label', 'logo_url', 'image_url', 'published', 'order'],
    json: ['tags'],
    months: ['start_date', 'end_date'],
    orderBy: '"order" ASC, created_date ASC',
  },
  experiences: {
    columns: ['company', 'role', 'start', 'end', 'context', 'missions', 'published', 'order'],
    json: ['missions'],
    orderBy: '"order" ASC, created_date ASC',
  },
  site_settings: {
    columns: ['name', 'initials', 'role', 'tagline', 'intro', 'location', 'email', 'linkedin', 'cv_url'],
    json: [],
    orderBy: 'created_date DESC',
  },
};

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });

export const error = (message, status) => json({ error: message }, status);

const fromRow = (table, row) => {
  if (!row) return row;
  const out = { ...row };
  for (const col of TABLES[table].json) {
    try {
      out[col] = JSON.parse(row[col] || '[]');
    } catch {
      out[col] = [];
    }
  }
  if ('published' in out) out.published = out.published !== 0;
  return out;
};

// Mois « AAAA-MM » ; toute autre valeur devient vide.
const toMonth = (value) => {
  const month = value == null ? '' : String(value).trim();
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : '';
};

const toValue = (table, col, value) => {
  if (TABLES[table].json.includes(col)) return JSON.stringify(Array.isArray(value) ? value : []);
  if (col === 'published') return value === false || value === 0 ? 0 : 1;
  if (col === 'order') {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : 99;
  }
  if (TABLES[table].months?.includes(col)) return toMonth(value);
  return value == null ? '' : String(value);
};

// Contrôle des valeurs croisées avant écriture ; renvoie un message d'erreur ou null.
export function invalid(table, body) {
  const [start, end] = [toMonth(body.start_date), toMonth(body.end_date)];
  if (table === 'projects' && start && end && end < start) {
    return 'La fin du projet ne peut pas précéder son début.';
  }
  return null;
}

export async function list(db, table, { publishedOnly = false } = {}) {
  const where = publishedOnly && TABLES[table].columns.includes('published') ? 'WHERE published = 1' : '';
  const { results } = await db.prepare(`SELECT * FROM ${table} ${where} ORDER BY ${TABLES[table].orderBy}`).all();
  return results.map((row) => fromRow(table, row));
}

export async function get(db, table, id) {
  const row = await db.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first();
  return fromRow(table, row);
}

export async function create(db, table, body) {
  const id = crypto.randomUUID().replace(/-/g, '');
  const cols = TABLES[table].columns.filter((col) => col in body);
  const names = ['id', ...cols].map((c) => `"${c}"`).join(', ');
  const marks = ['?', ...cols.map(() => '?')].join(', ');
  const values = [id, ...cols.map((col) => toValue(table, col, body[col]))];
  await db.prepare(`INSERT INTO ${table} (${names}) VALUES (${marks})`).bind(...values).run();
  return get(db, table, id);
}

export async function update(db, table, id, body) {
  const cols = TABLES[table].columns.filter((col) => col in body);
  if (cols.length) {
    const sets = cols.map((col) => `"${col}" = ?`).join(', ');
    const values = cols.map((col) => toValue(table, col, body[col]));
    await db
      .prepare(`UPDATE ${table} SET ${sets}, updated_date = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`)
      .bind(...values, id)
      .run();
  }
  return get(db, table, id);
}

export async function remove(db, table, id) {
  await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
}
