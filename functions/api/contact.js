import { error, json, list } from '../_lib/db.js';

// Formulaire de contact public : valide le message, piège les bots via un champ
// honeypot, puis envoie l'e-mail par l'API MailChannels (gratuite sur Cloudflare Workers/Pages).
//
// Avant que l'envoi fonctionne en production, ajouter l'enregistrement DNS de
// verrouillage de domaine MailChannels sur antogouvrillon.fr une fois ce domaine
// actif dans Cloudflare :
//   TXT  _mailchannels.antogouvrillon.fr  "v=mc1 cfid=<ton-sous-domaine>.pages.dev"
// Doc officielle : https://support.mailchannels.com/hc/en-us/articles/4565898358413-Secure-Your-Domain-Name-Against-Spoofing-with-Domain-Lock
// Sans cet enregistrement, MailChannels refuse l'envoi (401/403).

const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FALLBACK_TO_EMAIL = 'antogouvrillon@gmail.com';
const FROM_EMAIL = 'contact@antogouvrillon.fr';
const FROM_NAME = 'Portfolio Anthony Gouvrillon';

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return error('Corps JSON attendu', 400);

  const { name, email, message, company } = body;

  // Honeypot : un humain ne remplit jamais ce champ. On répond 200 sans rien
  // envoyer ni révéler que c'est un piège.
  if (String(company || '').trim()) return json({ ok: true });

  const trimmedName = String(name || '').trim();
  const trimmedEmail = String(email || '').trim();
  const trimmedMessage = String(message || '').trim();

  if (!trimmedName) return error('Le nom est requis.', 400);
  if (!EMAIL_RE.test(trimmedEmail)) return error('Adresse e-mail invalide.', 400);
  if (!trimmedMessage) return error('Le message est requis.', 400);
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return error(`Le message dépasse la longueur maximale (${MAX_MESSAGE_LENGTH} caractères).`, 400);
  }

  const settings = await list(env.DB, 'site_settings');
  const toEmail = settings[0]?.email || FALLBACK_TO_EMAIL;

  const payload = {
    personalizations: [{ to: [{ email: toEmail }] }],
    from: { email: FROM_EMAIL, name: FROM_NAME },
    reply_to: { email: trimmedEmail, name: trimmedName },
    subject: `Message depuis le portfolio — ${trimmedName}`,
    content: [
      {
        type: 'text/plain',
        value: `Nom : ${trimmedName}\nE-mail : ${trimmedEmail}\n\n${trimmedMessage}`,
      },
    ],
  };

  let response;
  try {
    response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return error("L'envoi a échoué (service de messagerie injoignable).", 502);
  }

  if (!response.ok) {
    // MailChannels peut répondre en JSON (détail exploitable) ou en HTML (page d'erreur générique,
    // par ex. tant que le verrou DNS n'est pas posé) : on ne renvoie que le premier cas au visiteur.
    const detail = await response.json().catch(() => null);
    const message = Array.isArray(detail?.errors) ? detail.errors.join(' ') : null;
    return error(`L'envoi a échoué${message ? ` : ${message}` : ', réessayez plus tard'}.`, 502);
  }

  return json({ ok: true });
}
