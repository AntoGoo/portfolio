"""Convertit les exports CSV Base44 en script SQL d'import pour D1.

Usage : python3 scripts/csv-to-seed.py Project.csv Experience.csv SiteSettings.csv > seed/seed.sql
"""
import csv
import json
import sys

TABLES = {
    "Project": ("projects", ["title", "year", "context", "problem", "objectives", "role",
                             "methodology", "solutions", "results", "tags", "link", "link_label",
                             "logo_url", "image_url", "published", "order"]),
    "Experience": ("experiences", ["company", "role", "start", "end", "context", "missions",
                                   "published", "order"]),
    "SiteSettings": ("site_settings", ["name", "initials", "role", "tagline", "intro", "location",
                                       "email", "linkedin", "cv_url"]),
}
JSON_COLS = {"tags", "missions"}


def sql(value):
    if value is None:
        return "NULL"
    if isinstance(value, int):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def convert(col, raw):
    raw = raw or ""
    if col in JSON_COLS:
        return json.dumps(json.loads(raw) if raw else [], ensure_ascii=False)
    if col == "published":
        return 0 if raw.lower() == "false" else 1
    if col == "order":
        return int(raw) if raw else 99
    return raw


def main(paths):
    out = []
    for path in paths:
        entity = next((name for name in TABLES if f"{name}_export" in path), None)
        if entity is None:
            sys.exit(f"Fichier non reconnu : {path}")
        table, cols = TABLES[entity]
        out.append(f"DELETE FROM {table};")
        with open(path, newline="", encoding="utf-8") as fh:
            for row in csv.DictReader(fh):
                names = ["id"] + cols + ["created_date", "updated_date"]
                values = [row["id"]] + [convert(c, row.get(c)) for c in cols]
                values += [row.get("created_date") or None, row.get("updated_date") or None]
                pairs = [(n, v) for n, v in zip(names, values) if v is not None]
                col_sql = ", ".join(f'"{n}"' for n, _ in pairs)
                val_sql = ", ".join(sql(v) for _, v in pairs)
                out.append(f"INSERT INTO {table} ({col_sql}) VALUES ({val_sql});")
    print("\n".join(out))


if __name__ == "__main__":
    main(sys.argv[1:])
