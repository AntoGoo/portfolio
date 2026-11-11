// Textes du site public stockés dans D1 (table site_content, ligne 'main').
// La table est créée à la volée si la migration 0003 n'a pas encore été appliquée.

const ID = 'main';
export const MAX_CONTENT_BYTES = 256 * 1024;

const ensureTable = (db) =>
  db
    .prepare(
      `CREATE TABLE IF NOT EXISTS site_content (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL DEFAULT '{}',
        updated_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      )`
    )
    .run();

export async function getContent(db) {
  let row;
  try {
    row = await db.prepare('SELECT data, updated_date FROM site_content WHERE id = ?').bind(ID).first();
  } catch {
    // Table absente : rien n'a encore été enregistré.
    return { data: {}, updated_date: null };
  }
  if (!row) return { data: {}, updated_date: null };
  try {
    const data = JSON.parse(row.data || '{}');
    return { data: data && typeof data === 'object' && !Array.isArray(data) ? data : {}, updated_date: row.updated_date };
  } catch {
    return { data: {}, updated_date: row.updated_date };
  }
}

export async function saveContent(db, data) {
  await ensureTable(db);
  await db
    .prepare(
      `INSERT INTO site_content (id, data) VALUES (?, ?)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data,
         updated_date = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
    )
    .bind(ID, JSON.stringify(data))
    .run();
  return getContent(db);
}
