import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { api } from '@/api/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Field from '@/components/studio/Field';
import { blankLike, defaultTexts, resolveTexts } from '@/lib/siteTexts';

// Description des textes modifiables, section par section, dans l'ordre de la page.
// Types de champ :
//   text      une ligne
//   textarea  plusieurs lignes
//   lines     liste de textes, un par ligne
//   items     liste d'éléments (sous-champs `fields`) ; `fixed` interdit l'ajout et la suppression
const SECTION_FIELDS = [
  { key: 'eyebrow', label: 'Libellé de section (« NN / … »)', type: 'text' },
  { key: 'title', label: 'Titre', type: 'text' },
  { key: 'lead', label: 'Chapeau sous le titre', type: 'textarea', hint: 'Laisser vide pour ne rien afficher.' },
];

const SCHEMA = [
  {
    key: 'nav',
    title: 'Menu',
    fields: [
      {
        key: 'links',
        label: 'Liens du menu et du footer',
        type: 'items',
        fixed: true,
        itemTitle: (item) => `#${item.id}`,
        fields: [{ key: 'label', label: 'Libellé', type: 'text' }],
      },
      { key: 'cta', label: 'Bouton « contact » du menu', type: 'text' },
    ],
  },
  {
    key: 'hero',
    title: 'En-tête (hero)',
    note: 'Le nom, le poste, la localisation, l’accroche et la présentation se modifient dans l’onglet « Profil & contact ».',
    fields: [
      { key: 'ctaPrimary', label: 'Bouton « parcours »', type: 'text' },
      { key: 'ctaCv', label: 'Bouton « CV »', type: 'text' },
    ],
  },
  {
    key: 'about',
    title: '01 / Profil',
    fields: [
      ...SECTION_FIELDS,
      { key: 'intro', label: 'Paragraphe principal', type: 'textarea', rows: 5 },
      { key: 'paragraphs', label: 'Paragraphes suivants', type: 'lines', hint: 'Un paragraphe par ligne.', rows: 6 },
      {
        key: 'principles',
        label: 'Cartes',
        type: 'items',
        fixed: true,
        itemTitle: (item, i) => (i === 0 ? 'Grande carte' : `Carte ${i + 1}`),
        fields: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'lead', label: 'Phrase d’introduction', type: 'textarea', rows: 2 },
          { key: 'detail', label: 'Points détaillés', type: 'lines', hint: 'Un point par ligne.', rows: 4 },
        ],
      },
    ],
  },
  {
    key: 'expertises',
    title: '02 / Expertises',
    fields: [
      ...SECTION_FIELDS,
      {
        key: 'items',
        label: 'Domaines',
        type: 'items',
        fixed: true,
        itemTitle: (item) => item.title || item.key,
        fields: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'summary', label: 'Résumé', type: 'textarea', rows: 2 },
          { key: 'items', label: 'Points', type: 'lines', hint: 'Un point par ligne.', rows: 6 },
        ],
      },
    ],
  },
  {
    key: 'projects',
    title: '03 / Réalisations',
    note: 'Le contenu des projets se modifie dans l’onglet « Projets ».',
    fields: [
      ...SECTION_FIELDS,
      { key: 'empty', label: 'Message sans réalisation', type: 'text' },
      { key: 'emptyFilter', label: 'Message quand un filtre ne donne rien', type: 'text' },
      { key: 'linkDefault', label: 'Lien de la fiche projet (par défaut)', type: 'text' },
      {
        key: 'blocks',
        label: 'Rubriques de la fiche projet',
        type: 'group',
        fields: [
          { key: 'context', label: 'Contexte', type: 'text' },
          { key: 'problem', label: 'Problématique', type: 'text' },
          { key: 'objectives', label: 'Objectifs', type: 'text' },
          { key: 'role', label: 'Rôle', type: 'text' },
          { key: 'methodology', label: 'Méthodologie', type: 'text' },
          { key: 'solutions', label: 'Solutions', type: 'text' },
          { key: 'results', label: 'Résultats', type: 'text' },
        ],
      },
    ],
  },
  {
    key: 'method',
    title: '04 / Méthodologie',
    fields: [
      ...SECTION_FIELDS,
      {
        key: 'steps',
        label: 'Étapes',
        type: 'items',
        fixed: true,
        itemTitle: (item, i) => `Étape ${String(i + 1).padStart(2, '0')}`,
        fields: [
          { key: 'number', label: 'Numéro', type: 'text' },
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'text', label: 'Texte', type: 'textarea', rows: 2 },
        ],
      },
    ],
  },
  {
    key: 'skills',
    title: '05 / Environnement',
    fields: [
      ...SECTION_FIELDS,
      {
        key: 'groups',
        label: 'Groupes',
        type: 'items',
        addLabel: 'Ajouter un groupe',
        itemTitle: (item, i) => item.label || `Groupe ${i + 1}`,
        fields: [
          { key: 'label', label: 'Libellé', type: 'text' },
          { key: 'items', label: 'Éléments', type: 'lines', hint: 'Un élément par ligne.', rows: 5 },
        ],
      },
    ],
  },
  {
    key: 'timeline',
    title: '06 / Parcours',
    note: 'Les expériences se modifient dans l’onglet « Parcours ».',
    fields: [...SECTION_FIELDS, { key: 'empty', label: 'Message sans expérience', type: 'text' }],
  },
  {
    key: 'contact',
    title: '07 / Contact',
    note: 'L’adresse e-mail, le lien LinkedIn et la localisation se modifient dans l’onglet « Profil & contact ».',
    fields: [
      { key: 'eyebrow', label: 'Libellé de section', type: 'text' },
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'cvButton', label: 'Bouton « CV »', type: 'text' },
      { key: 'emailLabel', label: 'Libellé e-mail', type: 'text' },
      { key: 'linkedinLabel', label: 'Libellé LinkedIn', type: 'text' },
      { key: 'linkedinLink', label: 'Texte du lien LinkedIn', type: 'text' },
      { key: 'locationLabel', label: 'Libellé localisation', type: 'text' },
    ],
  },
  {
    key: 'footer',
    title: 'Pied de page',
    fields: [{ key: 'backToTop', label: 'Lien « haut de page »', type: 'text' }],
  },
];

const toLines = (list) => (list || []).join('\n');
const fromLines = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean);

function FieldInput({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return <Textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={field.rows || 3} />;
  }
  if (field.type === 'lines') {
    return <LinesInput value={value} onChange={onChange} rows={field.rows} />;
  }
  return <Input value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
}

// Liste de textes saisie ligne par ligne. Le brouillon garde les lignes vides
// pendant la frappe ; la liste nettoyée remonte à chaque changement.
function LinesInput({ value, onChange, rows = 4 }) {
  const [draft, setDraft] = useState(() => toLines(value));
  useEffect(() => {
    if (toLines(fromLines(draft)) !== toLines(value)) setDraft(toLines(value));
    // Resynchronise seulement quand la valeur change de l'extérieur (rétablir, recharger).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <Textarea
      value={draft}
      rows={rows}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(fromLines(e.target.value));
      }}
    />
  );
}

function Fields({ fields, value, defaults, onChange }) {
  const setKey = (key) => (next) => onChange({ ...value, [key]: next });

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        if (field.type === 'items') {
          return (
            <ItemsField
              key={field.key}
              field={field}
              value={value[field.key] || []}
              defaults={defaults?.[field.key] || []}
              onChange={setKey(field.key)}
            />
          );
        }
        if (field.type === 'group') {
          return (
            <div key={field.key} className="space-y-3">
              <p className="text-[12.5px] font-medium text-foreground">{field.label}</p>
              <div className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
                {field.fields.map((sub) => (
                  <Field key={sub.key} label={sub.label}>
                    <FieldInput
                      field={sub}
                      value={value[field.key]?.[sub.key]}
                      onChange={(next) => onChange({ ...value, [field.key]: { ...value[field.key], [sub.key]: next } })}
                    />
                  </Field>
                ))}
              </div>
            </div>
          );
        }
        return (
          <Field key={field.key} label={field.label} hint={field.hint}>
            <FieldInput field={field} value={value[field.key]} onChange={setKey(field.key)} />
          </Field>
        );
      })}
    </div>
  );
}

function ItemsField({ field, value, defaults, onChange }) {
  const update = (i, next) => onChange(value.map((item, j) => (j === i ? next : item)));
  const move = (i, dir) => {
    const list = [...value];
    [list[i], list[i + dir]] = [list[i + dir], list[i]];
    onChange(list);
  };

  return (
    <div className="space-y-3">
      <p className="text-[12.5px] font-medium text-foreground">{field.label}</p>
      {value.map((item, i) => (
        <div key={i} className="rounded-lg border border-border bg-background/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{field.itemTitle(item, i)}</p>
            {!field.fixed && (
              <div className="flex items-center gap-0.5">
                <Button type="button" variant="ghost" size="sm" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Monter">
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={i === value.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Descendre"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
          <Fields fields={field.fields} value={item} defaults={defaults[i]} onChange={(next) => update(i, next)} />
        </div>
      ))}
      {!field.fixed && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => onChange([...value, blankLike(defaults[0] || {})])}
        >
          <Plus className="h-3.5 w-3.5" />
          {field.addLabel || 'Ajouter'}
        </Button>
      )}
    </div>
  );
}

export default function TextsEditor() {
  const { toast } = useToast();
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    api.content
      .get()
      .then((res) => {
        const texts = resolveTexts(res?.data);
        setForm(texts);
        setSaved(texts);
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  const dirty = useMemo(() => form && saved && JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);

  // Avertit avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await api.content.save(form);
      const texts = resolveTexts(res?.data);
      setForm(texts);
      setSaved(texts);
      toast({ title: 'Textes enregistrés', description: 'Visibles sur le site d’ici une minute.' });
    } catch (err) {
      toast({ title: 'Enregistrement impossible', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="rounded-xl border border-destructive/40 p-6 text-sm text-destructive">
        Chargement des textes impossible : {loadError}
      </div>
    );
  }
  if (!form) return <div className="h-40 animate-pulse rounded-xl border border-border bg-card/60" />;

  return (
    <form onSubmit={save} className="space-y-6">
      <p className="max-w-2xl text-[13px] text-muted-foreground">
        Tous les textes fixes du site, section par section. « Rétablir » remet les textes d’origine d’une section ; rien
        n’est modifié sur le site avant d’avoir cliqué sur « Enregistrer ».
      </p>

      <Accordion type="multiple" className="overflow-hidden rounded-xl border border-border bg-card">
        {SCHEMA.map((section) => (
          <AccordionItem key={section.key} value={section.key} className="border-border/70 last:border-b-0">
            <AccordionTrigger className="px-5 font-heading text-[14.5px] hover:no-underline">{section.title}</AccordionTrigger>
            <AccordionContent className="space-y-4 px-5 pb-6">
              {section.note && <p className="text-[12px] text-muted-foreground">{section.note}</p>}
              <Fields
                fields={section.fields}
                value={form[section.key]}
                defaults={defaultTexts[section.key]}
                onChange={(next) => setForm((prev) => ({ ...prev, [section.key]: next }))}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground"
                  onClick={() => setForm((prev) => ({ ...prev, [section.key]: defaultTexts[section.key] }))}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Rétablir les textes d’origine
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
        {dirty && <span className="text-[12px] text-muted-foreground">Modifications non enregistrées</span>}
        <Button type="button" variant="outline" disabled={!dirty || saving} onClick={() => setForm(saved)}>
          Annuler
        </Button>
        <Button type="submit" disabled={!dirty || saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
