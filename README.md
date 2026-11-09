# Portfolio — Anthony Gouvrillon

React + Vite, hébergé sur Cloudflare Pages. Les données vivent dans D1, les fichiers envoyés depuis le studio dans R2, et l'espace `/studio` est protégé par Cloudflare Access.

```
src/                    front React (site public + /studio)
functions/              API Pages Functions
  api/portfolio.js        GET public : profil, projets et expériences publiés
  api/admin/_middleware   vérifie le jeton Cloudflare Access
  api/admin/[table]       CRUD projects | experiences | site_settings
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

Le fichier `.dev.vars` (non versionné) contient `DEV_BYPASS_AUTH=true` pour accéder à l'admin sans Access en local.

## Mise en production (une seule fois)

1. `npx wrangler login`
2. `npx wrangler d1 create portfolio`, puis coller le `database_id` renvoyé dans `wrangler.toml`.
3. `npx wrangler r2 bucket create portfolio-files`
4. `npm run db:migrate && npm run db:seed`
5. Dashboard Cloudflare > Workers & Pages > Create > Pages > connecter le repo `AntoGoo/portfolio`.
   Build : `npm run build`, sortie : `dist`. Les liaisons D1 et R2 sont lues depuis `wrangler.toml`.
6. Zero Trust > Access > Applications > Self-hosted. Domaine : `<projet>.pages.dev`, chemins `studio` et `api/admin`.
   Politique : Allow, Emails = ton adresse.
7. Pages > Settings > Variables : `ACCESS_TEAM_DOMAIN` (ex. `xxx.cloudflareaccess.com`) et `ACCESS_AUD` (tag AUD de l'application Access). Redéployer.

Ensuite, chaque push sur la branche de production redéploie le site.
