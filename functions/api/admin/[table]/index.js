import { TABLES, create, error, invalid, json, list } from '../../../_lib/db.js';

export async function onRequestGet({ env, params }) {
  if (!TABLES[params.table]) return error('Table inconnue', 404);
  return json(await list(env.DB, params.table));
}

export async function onRequestPost({ env, params, request }) {
  if (!TABLES[params.table]) return error('Table inconnue', 404);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return error('Corps JSON attendu', 400);
  const problem = invalid(params.table, body);
  if (problem) return error(problem, 400);
  return json(await create(env.DB, params.table, body), 201);
}
