import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import Field from '@/components/studio/Field';

export default function ExperienceForm({ experience, onSaved, onCancel }) {
  const { toast } = useToast();
  const [form, setForm] = useState(() => ({
    company: '',
    role: '',
    start: '',
    end: '',
    context: '',
    ...(experience || {}),
    missions: (experience?.missions || []).join('\n'),
  }));
  const [published, setPublished] = useState(experience?.published ?? true);
  const [saving, setSaving] = useState(false);

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const save = async (event) => {
    event.preventDefault();
    if (!form.role.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      missions: form.missions
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      published,
      order: experience?.order ?? 99,
    };
    delete payload.id;
    delete payload.created_by_id;
    delete payload.created_date;
    delete payload.updated_date;
    if (experience?.id) {
      await base44.entities.Experience.update(experience.id, payload);
    } else {
      await base44.entities.Experience.create(payload);
    }
    setSaving(false);
    toast({ title: experience?.id ? 'Expérience mise à jour' : 'Expérience créée' });
    onSaved();
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fonction">
          <Input value={form.role} onChange={set('role')} placeholder="Chef de projet IT" required />
        </Field>
        <Field label="Entreprise">
          <Input value={form.company} onChange={set('company')} placeholder="Nom de la structure" />
        </Field>
        <Field label="Début">
          <Input value={form.start} onChange={set('start')} placeholder="2021" />
        </Field>
        <Field label="Fin">
          <Input value={form.end} onChange={set('end')} placeholder="aujourd'hui" />
        </Field>
      </div>

      <Field label="Contexte">
        <Textarea value={form.context} onChange={set('context')} rows={2} />
      </Field>

      <Field label="Missions principales" hint="Une mission par ligne.">
        <Textarea value={form.missions} onChange={set('missions')} rows={5} />
      </Field>

      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <div>
          <p className="text-[13px] font-medium">Visible sur le portfolio</p>
          <p className="text-[11.5px] text-muted-foreground">Désactivez pour masquer cette expérience.</p>
        </div>
        <Switch checked={published} onCheckedChange={setPublished} />
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={saving || !form.role.trim()}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}