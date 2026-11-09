import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import ExperienceForm from '@/components/studio/ExperienceForm';

export default function ExperiencesManager() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => {
    base44.entities.Experience
      .filter({}, { sort: 'order', limit: 100 })
      .then((page) => setItems(page.items || []));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (job) => {
    if (!window.confirm(`Supprimer « ${job.role} » ?`)) return;
    await base44.entities.Experience.delete(job.id);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[13px] text-muted-foreground">
          Chronologie du parcours professionnel, du plus récent au plus ancien.
        </p>
        <Button onClick={() => setEditing({})} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle expérience
        </Button>
      </div>

      {items === null ? (
        <div className="h-24 animate-pulse rounded-xl border border-border bg-card/60" />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Aucune expérience pour l'instant.
        </div>
      ) : (
        <div className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border bg-card">
          {items.map((job) => (
            <div key={job.id} className="flex items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-heading text-[15px] font-medium">{job.role}</p>
                  {job.published === false && (
                    <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Masquée
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[12.5px] text-muted-foreground">
                  {[job.company, [job.start, job.end].filter(Boolean).join(' — ')]
                    .filter(Boolean)
                    .join(' · ') || 'Sans détail'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setEditing(job)} className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(job)}
                  className="gap-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Modifier l'expérience" : 'Nouvelle expérience'}</DialogTitle>
            <DialogDescription>Entreprise, fonction, période et missions principales.</DialogDescription>
          </DialogHeader>
          {editing && (
            <ExperienceForm
              experience={editing}
              onCancel={() => setEditing(null)}
              onSaved={() => {
                setEditing(null);
                load();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}