import { error, json } from '../../_lib/db.js';
import { MAX_CONTENT_BYTES, getContent, saveContent } from '../../_lib/content.js';

// Textes du site : GET renvoie les textes enregistrés, PUT les remplace en entier.
export async function onRequestGet({ env }) {
  return json(await getContent(env.DB), 200, { 'cache-control': 'no-store' });
}

export async function onRequestPut({ env, request }) {
  const raw = await request.text();
  if (raw.length > MAX_CONTENT_BYTES) return error('Contenu trop volumineux', 413);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return error('Corps JSON attendu', 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return error('Objet JSON attendu', 400);
  return json(await saveContent(env.DB, body));
}
