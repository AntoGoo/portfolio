// Client de l'API Pages Functions (remplace le SDK Base44).

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      credentials: 'same-origin',
      // Session Access absente ou expirée : Access répond par une redirection vers sa page de
      // connexion (autre domaine). Suivie par fetch, elle échoue en « Failed to fetch » ; en
      // mode manual, on la reconnaît et on peut l'expliquer.
      redirect: 'manual',
      ...options,
      headers: options.body instanceof FormData
        ? options.headers
        : { 'content-type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error(`Serveur injoignable (${path}). En local, l'API doit tourner : npm run build && npm run dev:api.`);
  }
  if (response.type === 'opaqueredirect') {
    throw new Error('Session Cloudflare Access expirée : recharge la page pour te reconnecter, puis recommence.');
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}${data?.error ? ` : ${data.error}` : ` (${response.statusText || 'sans détail'})`}`);
  }
  return data;
}

const table = (name) => ({
  list: () => request(`/api/admin/${name}`),
  create: (payload) => request(`/api/admin/${name}`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/admin/${name}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/admin/${name}/${id}`, { method: 'DELETE' }),
});

export const api = {
  portfolio: () => request('/api/portfolio'),
  projects: table('projects'),
  experiences: table('experiences'),
  settings: table('site_settings'),
  upload: (file) => {
    const body = new FormData();
    body.append('file', file);
    return request('/api/admin/upload', { method: 'POST', body });
  },
  logoutUrl: '/cdn-cgi/access/logout',
};
