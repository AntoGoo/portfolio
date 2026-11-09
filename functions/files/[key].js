// Sert publiquement les fichiers déposés dans R2 via le studio.
export async function onRequestGet({ env, params }) {
  const object = await env.FILES.get(params.key);
  if (!object) return new Response('Introuvable', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
}
