// Client de l'API Pages Functions (remplace le SDK Base44).

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      credentials: 'same-origin',
      // Si Cloudflare Access protège aussi le site, une session Access expirée répond par une
      // redirection vers sa page de connexion (autre domaine) : en mode manual, on la reconnaît.
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
  if (response.status === 401 && path.startsWith('/api/admin')) {
    // Session du studio expirée : /studio réaffiche le formulaire de connexion.
    window.dispatchEvent(new Event('studio:unauthorized'));
  }
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
  content: {
    get: () => request('/api/admin/content'),
    save: (texts) => request('/api/admin/content', { method: 'PUT', body: JSON.stringify(texts) }),
  },
  auth: {
    session: () => request('/api/auth/session'),
    login: (email, password) =>
      request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
  },
};
