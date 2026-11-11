import { json } from '../../_lib/db.js';
import { clearSessionCookie } from '../../_lib/session.js';

export async function onRequestPost() {
  return json({ authenticated: false }, 200, { 'set-cookie': clearSessionCookie() });
}
