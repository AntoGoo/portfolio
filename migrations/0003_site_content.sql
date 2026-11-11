-- Textes du site public (titres de section, cartes, libellés…), modifiables depuis /studio.
-- Une seule ligne (id = 'main') : un document JSON qui surcharge les textes par défaut
-- de src/data/portfolioContent.js. Une clé absente garde le texte par défaut.

CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL DEFAULT '{}',
  updated_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
