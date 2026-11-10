import { TABLES, error, get, invalid, json, remove, update } from '../../../_lib/db.js';

export async function onRequestGet({ env, params }) {
  if (!TABLES[params.table]) return error('Table inconnue', 404);
  const row = await get(env.DB, params.table, params.id);
  return row ? json(row) : error('Introuvable', 404);
}

export async function onRequestPut({ env, params, request }) {
  if (!TABLES[params.table]) return error('Table inconnue', 404);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return error('Corps JSON attendu', 400);
  const problem = invalid(params.table, body);
  if (problem) return error(problem, 400);
  const row = await update(env.DB, params.table, params.id, body);
  return row ? json(row) : error('Introuvable', 404);
}

export async function onRequestDelete({ env, params }) {
  if (!TABLES[params.table]) return error('Table inconnue', 404);
  await remove(env.DB, params.table, params.id);
  return new Response(null, { status: 204 });
}
