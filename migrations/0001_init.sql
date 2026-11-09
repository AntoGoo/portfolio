-- Schéma initial (reprend les entités Base44 Project, Experience, SiteSettings).
-- Les listes (tags, missions) sont stockées en JSON texte.

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  context TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL DEFAULT '',
  objectives TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  methodology TEXT NOT NULL DEFAULT '',
  solutions TEXT NOT NULL DEFAULT '',
  results TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  link TEXT NOT NULL DEFAULT '',
  link_label TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 99,
  created_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  start TEXT NOT NULL DEFAULT '',
  "end" TEXT NOT NULL DEFAULT '',
  context TEXT NOT NULL DEFAULT '',
  missions TEXT NOT NULL DEFAULT '[]',
  published INTEGER NOT NULL DEFAULT 1,
  "order" INTEGER NOT NULL DEFAULT 99,
  created_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  initials TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  intro TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  linkedin TEXT NOT NULL DEFAULT '',
  cv_url TEXT NOT NULL DEFAULT '',
  created_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
