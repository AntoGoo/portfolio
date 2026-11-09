# AGENTS.md

Portfolio React/Vite déployé sur Cloudflare Pages (D1 + R2 + Access). Voir `README.md` pour l'architecture et les commandes.

- Le front n'a aucune logique d'authentification : `/studio` et `/api/admin/*` sont protégés par Cloudflare Access, et le middleware `functions/api/admin/_middleware.js` vérifie le jeton.
- Toute nouvelle colonne passe par une migration dans `migrations/` et par la liste `TABLES` de `functions/_lib/db.js`.
- Avant de terminer : `npm run lint` et `npm run build`.
- Textes du site en français, sans tics d'écriture IA.
