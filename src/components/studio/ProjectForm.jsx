import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import Field from '@/components/studio/Field';
import { Image } from '@/components/ui/image';

const empty = {
  title: '',
  year: '',
  context: '',
  problem: '',
  objectives: '',
  role: '',
  methodology: '',
  solutions: '',
  results: '',
  tags: '',
  link: '',
  link_label: '',
  logo_url: '',
};

export default function ProjectForm({ project, onSaved, onCancel }) {
  const { toast } = useToast();
  const [form, setForm] = useState(() => ({
    ...empty,
    ...(project || {}),
    tags: (project?.tags || []).join(', '),
  }));
  const [published, setPublished] = useState(project?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const uploadLogo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
    setForm((prev) => ({ ...prev, logo_url: file_url }));
    setUploading(false);
    event.target.value = '';
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      published,
      order: project?.order ?? 99,
    };
    delete payload.id;
    delete payload.created_by_id;
    delete payload.created_date;
    delete payload.updated_date;
    if (project?.id) {
      await base44.entities.Project.update(project.id, payload);
    } else {
      await base44.entities.Project.create(payload);
    }
    setSaving(false);
    toast({ title: project?.id ? 'Projet mis à jour' : 'Projet créé' });
    onSaved();
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Field label="Titre du projet">
            <Input value={form.title} onChange={set('title')} placeholder="Pilotage du projet GED — ELO" required />
          </Field>
        </div>
        <Field label="Catégorie">
          <Input value={form.year} onChange={set('year')} placeholder="Dématérialisation" />
        </Field>
      </div>

      <Field label="Logo" hint="Affiché en haut de la carte. PNG, SVG ou JPG, sur fond transparent de préférence.">
        <div className="flex items-center gap-3">
          {form.logo_url ? (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-background/40 p-1.5">
              <Image src={form.logo_url} alt="Logo du projet" className="h-full w-full" fittingType="fit" />
            </span>
          ) : null}
          <Input
            type="file"
            accept="image/*"
            onChange={uploadLogo}
            disabled={uploading}
            className="cursor-pointer text-[12px] file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-[12px] file:text-foreground"
          />
          {form.logo_url ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setForm((prev) => ({ ...prev, logo_url: '' }))}
            >
              Retirer
            </Button>
          ) : null}
        </div>
      </Field>

      <Field label="Contexte">
        <Textarea value={form.context} onChange={set('context')} rows={2} />
      </Field>
      <Field label="Problématique">
        <Textarea value={form.problem} onChange={set('problem')} rows={2} />
      </Field>
      <Field label="Objectifs">
        <Textarea value={form.objectives} onChange={set('objectives')} rows={2} />
      </Field>
      <Field label="Rôle et responsabilités">
        <Textarea value={form.role} onChange={set('role')} rows={2} />
      </Field>
      <Field label="Méthodologie">
        <Textarea value={form.methodology} onChange={set('methodology')} rows={2} />
      </Field>
      <Field label="Solutions mises en œuvre">
        <Textarea value={form.solutions} onChange={set('solutions')} rows={2} />
      </Field>
      <Field label="Résultats">
        <Textarea value={form.results} onChange={set('results')} rows={2} />
      </Field>

      <Field label="Mots-clés" hint="Séparés par des virgules.">
        <Input value={form.tags} onChange={set('tags')} placeholder="GED, ELO, Change" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Lien (optionnel)" hint="Laisser vide si le projet n'a pas de lien.">
          <Input value={form.link} onChange={set('link')} placeholder="https://..." type="url" />
        </Field>
        <Field label="Libellé du lien">
          <Input value={form.link_label} onChange={set('link_label')} placeholder="Voir le projet" />
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <div>
          <p className="text-[13px] font-medium">Visible sur le portfolio</p>
          <p className="text-[11.5px] text-muted-foreground">Désactivez pour garder le projet en brouillon.</p>
        </div>
        <Switch checked={published} onCheckedChange={setPublished} />
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={saving || !form.title.trim()}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}