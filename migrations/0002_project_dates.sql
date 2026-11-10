-- Période des projets, au format « AAAA-MM » ; vide si non renseignée.
-- Le champ `year` reste la catégorie (filtres et badge des cartes).

ALTER TABLE projects ADD COLUMN start_date TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN end_date TEXT NOT NULL DEFAULT '';
