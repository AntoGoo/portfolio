import { json } from '../../_lib/db.js';
import { isConfigured, readSession } from '../../_lib/session.js';

// État de la session, pour que /studio affiche le formulaire de connexion ou l'espace privé.
export async function onRequestGet({ request, env }) {
  if (env.DEV_BYPASS_AUTH === 'true') return json({ authenticated: true, email: 'dev@localhost', configured: true });
  const session = await readSession(request, env);
  return json(
    { authenticated: Boolean(session), email: session?.email || null, configured: isConfigured(env) },
    200,
    { 'cache-control': 'no-store' }
  );
}
