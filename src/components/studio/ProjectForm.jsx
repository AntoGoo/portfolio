import { useState } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import Field from '@/components/studio/Field';
import { Image } from '@/components/ui/image';
import normalizeLogo from '@/lib/normalizeLogo';
import { LOGO_DEFAULT_TOLERANCE } from '@/lib/logoNormalizeCore';

const empty = {
  title: '',
  year: '',
  start_date: '',
  end_date: '',
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
  // Logo en attente de validation : fichier d'origine (pour retraiter si la tolérance change),
  // aperçu local (blob) et tolérance courante. Rien n'est envoyé tant que ce n'est pas confirmé.
  const [pendingLogo, setPendingLogo] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState('');
  const [tolerance, setTolerance] = useState(LOGO_DEFAULT_TOLERANCE);
  const [normalizing, setNormalizing] = useState(false);

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  // Mois « AAAA-MM » : l'ordre alphabétique suit l'ordre chronologique.
  const dateError =
    form.start_date && form.end_date && form.end_date < form.start_date
      ? 'La fin ne peut pas précéder le début.'
      : null;

  const runNormalize = async (file, toleranceValue) => {
    setNormalizing(true);
    try {
      const blob = await normalizeLogo(file, { tolerance: toleranceValue });
      setPendingPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      toast({ title: 'Normalisation impossible', description: err.message, variant: 'destructive' });
    }
    setNormalizing(false);
  };

  const pickLogo = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setPendingLogo(file);
    setTolerance(LOGO_DEFAULT_TOLERANCE);
    await runNormalize(file, LOGO_DEFAULT_TOLERANCE);
  };

  const changeTolerance = async ([value]) => {
    setTolerance(value);
    if (pendingLogo) await runNormalize(pendingLogo, value);
  };

  const cancelPendingLogo = () => {
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setPendingLogo(null);
    setPendingPreviewUrl('');
  };

  const confirmLogo = async () => {
    if (!pendingPreviewUrl) return;
    setUploading(true);
    try {
      const blob = await fetch(pendingPreviewUrl).then((r) => r.blob());
      const { file_url } = await api.upload(new File([blob], 'logo.png', { type: 'image/png' }));
      setForm((prev) => ({ ...prev, logo_url: file_url }));
      cancelPendingLogo();
    } catch (err) {
      toast({ title: 'Envoi impossible', description: err.message, variant: 'destructive' });
    }
    setUploading(false);
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || dateError) return;
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
    try {
      if (project?.id) {
        await api.projects.update(project.id, payload);
      } else {
        await api.projects.create(payload);
      }
    } catch (err) {
      setSaving(false);
      toast({ title: 'Enregistrement impossible', description: err.message, variant: 'destructive' });
      return;
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Début">
          <Input type="month" value={form.start_date} onChange={set('start_date')} />
        </Field>
        <Field label="Fin (laisser vide si en cours ou ponctuel)" error={dateError}>
          <Input
            type="month"
            value={form.end_date}
            onChange={set('end_date')}
            min={form.start_date || undefined}
            aria-invalid={dateError ? true : undefined}
          />
        </Field>
      </div>

      <Field
        label="Logo"
        hint="Détouré et passé en blanc automatiquement, quelle que soit la couleur d'origine. PNG, SVG, JPG ou WEBP."
      >
        <div className="flex items-center gap-3">
          {form.logo_url ? (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-background/40 p-1.5">
              <Image src={form.logo_url} alt="Logo du projet" className="h-full w-full" fittingType="fit" />
            </span>
          ) : null}
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={pickLogo}
            disabled={normalizing || uploading}
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

        {(pendingPreviewUrl || normalizing) && (
          <div className="mt-3 space-y-3 rounded-lg border border-border p-3">
            <div className="flex h-16 items-center justify-center rounded-md bg-background">
              {normalizing ? (
                <span className="text-[12px] text-muted-foreground">Traitement…</span>
              ) : (
                <img src={pendingPreviewUrl} alt="Aperçu du logo normalisé" className="h-9 w-auto" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-[11px] text-muted-foreground">Tolérance</span>
              <Slider value={[tolerance]} onValueChange={changeTolerance} min={20} max={80} step={1} />
              <span className="w-6 shrink-0 text-right text-[11px] text-muted-foreground">{tolerance}</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={cancelPendingLogo}>
                Annuler
              </Button>
              <Button type="button" size="sm" onClick={confirmLogo} disabled={normalizing || uploading}>
                {uploading ? 'Envoi…' : 'Utiliser ce logo'}
              </Button>
            </div>
          </div>
        )}
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
        <Button type="submit" disabled={saving || !form.title.trim() || Boolean(dateError)}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}