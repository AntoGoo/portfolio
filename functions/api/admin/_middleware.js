import { createRemoteJWKSet, jwtVerify } from 'jose';
import { error } from '../../_lib/db.js';
import { readSession } from '../../_lib/session.js';

// Toutes les routes /api/admin/* exigent d'être connecté :
//   1. session du studio (cookie posé par /api/auth/login, voir _lib/session.js) ;
//   2. à défaut, jeton Cloudflare Access valide, si Access est configuré
//      (ACCESS_TEAM_DOMAIN et ACCESS_AUD).
// En local uniquement : DEV_BYPASS_AUTH=true dans .dev.vars.

let jwks;
let jwksDomain;

async function readAccess(request, env) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
  const token =
    request.headers.get('cf-access-jwt-assertion') ||
    (request.headers.get('cookie') || '').match(/CF_Authorization=([^;]+)/)?.[1];
  if (!token) return null;
  if (!jwks || jwksDomain !== env.ACCESS_TEAM_DOMAIN) {
    jwksDomain = env.ACCESS_TEAM_DOMAIN;
    jwks = createRemoteJWKSet(new URL(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`));
  }
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://${env.ACCESS_TEAM_DOMAIN}`,
      audience: env.ACCESS_AUD,
    });
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function onRequest({ request, env, next, data }) {
  if (env.DEV_BYPASS_AUTH === 'true') {
    data.user = { email: 'dev@localhost' };
    return next();
  }
  const user = (await readSession(request, env)) || (await readAccess(request, env));
  if (!user) return error('Non authentifié', 401);
  data.user = user;
  return next();
}
