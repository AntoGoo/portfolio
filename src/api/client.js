// Client de l'API Pages Functions (remplace le SDK Base44).

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: options.body instanceof FormData
      ? options.headers
      : { 'content-type': 'application/json', ...options.headers },
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `Erreur ${response.status}`);
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
