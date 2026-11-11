// Session du studio : cookie signé HMAC-SHA256, sans stockage côté serveur.
// Variables attendues (Pages > Settings > Variables, en « Secret ») :
//   STUDIO_EMAIL     adresse de connexion
//   STUDIO_PASSWORD  mot de passe
// La clé de signature dérive du mot de passe : le changer déconnecte toutes les sessions.

export const COOKIE = 'studio_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours
const enc = new TextEncoder();

const b64url = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function key(env) {
  const secret = env.SESSION_SECRET || `studio-session:${env.STUDIO_PASSWORD}`;
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function sign(env, payload) {
  return b64url(await crypto.subtle.sign('HMAC', await key(env), enc.encode(payload)));
}

// Comparaison à durée constante (hachage préalable : longueurs égales).
export async function safeEqual(a, b) {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(String(a))),
    crypto.subtle.digest('SHA-256', enc.encode(String(b))),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i += 1) diff |= x[i] ^ y[i];
  return diff === 0;
}

export const isConfigured = (env) => Boolean(env.STUDIO_EMAIL && env.STUDIO_PASSWORD);

export async function createSessionCookie(env, email) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${exp}.${b64url(enc.encode(email))}`;
  const value = `${payload}.${await sign(env, payload)}`;
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export const clearSessionCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

// Renvoie { email } si le cookie de session est valide, sinon null.
export async function readSession(request, env) {
  if (!isConfigured(env)) return null;
  const raw = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))?.[1];
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length !== 3) return null;
  const [exp, emailPart, signature] = parts;
  if (!(await safeEqual(signature, await sign(env, `${exp}.${emailPart}`)))) return null;
  if (!(Number(exp) > Date.now() / 1000)) return null;
  try {
    const email = new TextDecoder().decode(
      Uint8Array.from(atob(emailPart.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))
    );
    return { email };
  } catch {
    return null;
  }
}
