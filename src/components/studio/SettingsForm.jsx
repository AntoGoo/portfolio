import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Field from '@/components/studio/Field';

const empty = {
  name: '',
  initials: '',
  role: '',
  tagline: '',
  intro: '',
  location: '',
  email: '',
  linkedin: '',
  cv_url: '',
};

const fields = [
  { key: 'name', label: 'Nom affiché', placeholder: 'Anthony Gouvrillon' },
  { key: 'initials', label: 'Initiales (logo)', placeholder: 'AG' },
  { key: 'role', label: 'Intitulé du poste', placeholder: 'Chef de projet IT' },
  { key: 'tagline', label: 'Accroche', placeholder: 'Faire avancer les projets…' },
  { key: 'location', label: 'Localisation', placeholder: 'Nantes · Loire-Atlantique' },
  { key: 'email', label: 'E-mail', placeholder: 'prenom.nom@exemple.fr' },
  { key: 'linkedin', label: 'Profil LinkedIn', placeholder: 'https://www.linkedin.com/in/…' },
  { key: 'cv_url', label: 'CV au format PDF (lien)', placeholder: 'https://…' },
];

export default function SettingsForm() {
  const { toast } = useToast();
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.SiteSettings.filter({}, { sort: '-created_date', limit: 1 }).then((page) => {
      const found = page.items?.[0] || null;
      setRecord(found);
      setForm({ ...empty, ...(found || {}) });
    });
  }, []);

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = { ...form };
    delete payload.id;
    delete payload.created_by_id;
    delete payload.created_date;
    delete payload.updated_date;
    if (record?.id) {
      await base44.entities.SiteSettings.update(record.id, payload);
    } else {
      const created = await base44.entities.SiteSettings.create(payload);
      setRecord(created);
    }
    setSaving(false);
    toast({ title: 'Profil mis à jour' });
  };

  if (record === null && form === empty) {
    return <div className="h-40 animate-pulse rounded-xl border border-border bg-card/60" />;
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className={field.key === 'tagline' ? 'sm:col-span-2' : ''}>
            <Field label={field.label}>
              <Input value={form[field.key] || ''} onChange={set(field.key)} placeholder={field.placeholder} />
            </Field>
          </div>
        ))}
      </div>

      <Field label="Présentation">
        <Textarea value={form.intro || ''} onChange={set('intro')} rows={5} />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}