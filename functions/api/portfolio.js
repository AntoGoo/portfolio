import { json, list } from '../_lib/db.js';

// Données publiques du portfolio : profil + projets et expériences publiés.
export async function onRequestGet({ env }) {
  const [settings, projects, experiences] = await Promise.all([
    list(env.DB, 'site_settings'),
    list(env.DB, 'projects', { publishedOnly: true }),
    list(env.DB, 'experiences', { publishedOnly: true }),
  ]);
  return json(
    { settings: settings[0] || null, projects, experiences },
    200,
    { 'cache-control': 'public, max-age=60' },
  );
}
