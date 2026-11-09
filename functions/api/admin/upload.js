import { error, json } from '../../_lib/db.js';

const MAX_BYTES = 5 * 1024 * 1024;

// Upload d'une image (logo, visuel) vers R2. Renvoie { file_url } servi par /files/*.
export async function onRequestPost({ env, request }) {
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') return error('Fichier manquant', 400);
  if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
    return error('Seules les images et les PDF sont acceptés', 415);
  }
  if (file.size > MAX_BYTES) return error('Fichier trop lourd (5 Mo max)', 413);

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const key = `${crypto.randomUUID()}.${ext}`;
  await env.FILES.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
  return json({ file_url: `/files/${key}` }, 201);
}
