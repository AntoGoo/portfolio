-- Détail des expériences du Parcours : rôle et équipe, projet, environnement technique.
-- Les tags (environnement technique) sont stockés en JSON texte, comme `missions`.

ALTER TABLE experiences ADD COLUMN role_team TEXT NOT NULL DEFAULT '';
ALTER TABLE experiences ADD COLUMN project TEXT NOT NULL DEFAULT '';
ALTER TABLE experiences ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';
