import { json, list } from '../_lib/db.js';
import { getContent } from '../_lib/content.js';

// Données publiques du portfolio : profil, textes du site, projets et expériences publiés.
export async function onRequestGet({ env }) {
  const [settings, projects, experiences, content] = await Promise.all([
    list(env.DB, 'site_settings'),
    list(env.DB, 'projects', { publishedOnly: true }),
    list(env.DB, 'experiences', { publishedOnly: true }),
    getContent(env.DB),
  ]);
  return json(
    { settings: settings[0] || null, texts: content.data, projects, experiences },
    200,
    { 'cache-control': 'public, max-age=60' },
  );
}
