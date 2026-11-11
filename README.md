# Portfolio — Anthony Gouvrillon

React + Vite, hébergé sur Cloudflare Pages. Les données vivent dans D1, les fichiers envoyés depuis le studio dans R2, et l'espace `/studio` demande une connexion (e-mail + mot de passe).

```
src/                    front React (site public + /studio)
functions/              API Pages Functions
  api/portfolio.js        GET public : profil, projets et expériences publiés
  api/auth/*              connexion, déconnexion et état de la session du studio
  api/admin/_middleware   exige une session du studio (ou un jeton Cloudflare Access)
  api/admin/[table]       CRUD projects | experiences | site_settings
  api/admin/content.js    textes du site (titres, cartes, libellés), onglet « Textes du site »
  api/admin/upload.js     envoi d'image ou de PDF vers R2
  files/[key].js          lecture publique des fichiers R2
migrations/             schéma D1
seed/seed.sql           données importées depuis Base44
scripts/csv-to-seed.py  régénère seed.sql à partir d'exports CSV
```

## Développement local

```bash
npm install
npm run db:migrate:local && npm run db:seed:local
npm run build && npm run dev:api   # API + site buildé sur http://localhost:8788
npm run dev                        # (optionnel) Vite avec HMR sur 5173, relaie /api vers 8788
```

Le fichier `.dev.vars` (non versionné) contient soit `STUDIO_EMAIL` et `STUDIO_PASSWORD` pour tester la connexion, soit `DEV_BYPASS_AUTH=true` pour entrer dans le studio sans se connecter.

## Mise en production (une seule fois)

1. `npx wrangler login`
2. `npx wrangler d1 create portfolio`, puis coller le `database_id` renvoyé dans `wrangler.toml`.
3. `npx wrangler r2 bucket create portfolio-files`
4. `npm run db:migrate && npm run db:seed`
5. Dashboard Cloudflare > Workers & Pages > Create > Pages > connecter le repo `AntoGoo/portfolio`.
   Build : `npm run build`, sortie : `dist`. Les liaisons D1 et R2 sont lues depuis `wrangler.toml`.
6. Pages > Settings > Variables and Secrets (Production) : ajouter en « Secret » `STUDIO_EMAIL` (adresse de connexion)
   et `STUDIO_PASSWORD` (mot de passe long). Redéployer. Changer le mot de passe déconnecte toutes les sessions.
7. (Facultatif) Cloudflare Access en plus : Zero Trust > Access > Applications, chemins `studio` et `api/admin`,
   puis variables `ACCESS_TEAM_DOMAIN` et `ACCESS_AUD`. Un jeton Access valide ouvre aussi l'API d'admin.

Après une mise à jour qui ajoute une migration : `npm run db:migrate`. (La table des textes, `site_content`,
est de toute façon créée au premier enregistrement depuis le studio.)

Ensuite, chaque push sur la branche de production redéploie le site.
