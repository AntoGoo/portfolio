import { createRemoteJWKSet, jwtVerify } from 'jose';
import { error } from '../../_lib/db.js';

// Toutes les routes /api/admin/* exigent un jeton Cloudflare Access valide.
// Variables attendues (Pages > Settings > Variables) :
//   ACCESS_TEAM_DOMAIN  ex. "antogoo.cloudflareaccess.com"
//   ACCESS_AUD          l'"Application Audience (AUD) Tag" de l'application Access
// En local uniquement : DEV_BYPASS_AUTH=true dans .dev.vars.

let jwks;
let jwksDomain;

export async function onRequest({ request, env, next, data }) {
  if (env.DEV_BYPASS_AUTH === 'true') {
    data.user = { email: 'dev@localhost' };
    return next();
  }
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    return error('Cloudflare Access non configuré (ACCESS_TEAM_DOMAIN / ACCESS_AUD).', 500);
  }
  const token =
    request.headers.get('cf-access-jwt-assertion') ||
    (request.headers.get('cookie') || '').match(/CF_Authorization=([^;]+)/)?.[1];
  if (!token) return error('Non authentifié', 401);

  if (!jwks || jwksDomain !== env.ACCESS_TEAM_DOMAIN) {
    jwksDomain = env.ACCESS_TEAM_DOMAIN;
    jwks = createRemoteJWKSet(new URL(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`));
  }
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://${env.ACCESS_TEAM_DOMAIN}`,
      audience: env.ACCESS_AUD,
    });
    data.user = { email: payload.email };
  } catch {
    return error('Jeton Access invalide', 403);
  }
  return next();
}
