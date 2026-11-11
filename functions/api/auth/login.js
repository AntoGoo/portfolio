import { error, json } from '../../_lib/db.js';
import { createSessionCookie, isConfigured, safeEqual } from '../../_lib/session.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Connexion au studio : { email, password } → cookie de session.
export async function onRequestPost({ request, env }) {
  if (!isConfigured(env)) {
    return error('Connexion non configurée : renseigner STUDIO_EMAIL et STUDIO_PASSWORD dans Cloudflare Pages.', 500);
  }
  const body = await request.json().catch(() => null);
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');

  const [emailOk, passwordOk] = await Promise.all([
    safeEqual(email, String(env.STUDIO_EMAIL).trim().toLowerCase()),
    safeEqual(password, env.STUDIO_PASSWORD),
  ]);
  if (!emailOk || !passwordOk) {
    // Ralentit les essais en série.
    await wait(900);
    return error('Identifiants incorrects', 401);
  }
  return json({ authenticated: true, email }, 200, { 'set-cookie': await createSessionCookie(env, email) });
}
