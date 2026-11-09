import { useMemo, useRef, useState } from 'react';
import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import ProjectRow from '@/components/portfolio/ProjectRow';
import ProjectDrawer from '@/components/portfolio/ProjectDrawer';
import { cn } from '@/lib/utils';
import { tagStyle } from '@/lib/tagStyle';

const PREVIEW_W = 280;

// L'aperçu au survol n'a de sens qu'avec une souris.
const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

export default function Projects({ projects }) {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState(null);
  const [preview, setPreview] = useState(null);
  const boxRef = useRef(null);
  const previewRef = useRef(null);
  const list = projects || [];

  const types = useMemo(() => {
    const seen = new Map();
    list.forEach((project) => {
      const type = (project.year || '').trim();
      if (!type) return;
      seen.set(type.toLowerCase(), type);
    });
    return [...seen.values()].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [list]);

  const visible = filter
    ? list.filter((project) => (project.year || '').trim().toLowerCase() === filter.toLowerCase())
    : list;

  // Position appliquée directement sur le style : pas de rendu React à chaque mouvement.
  const onMove = (event) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box || !previewRef.current) return;
    const x = Math.min(event.clientX - box.left + 28, box.width - PREVIEW_W);
    const y = event.clientY - box.top;
    previewRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translateY(-50%)`;
  };

  const onPreview = (project) => setPreview(project && canHover() ? project : null);

  return (
    <Section
      id="realisations"
      index="03"
      eyebrow="Réalisations"
      title="Des projets pilotés de bout en bout"
    >
      {projects === null ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card/60">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[84px] animate-pulse border-b border-border/70 last:border-none"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Les réalisations seront publiées prochainement.</p>
      ) : (
        <div className="space-y-8">
          {types.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {[null, ...types].map((type) => {
                const isActive = filter === type;
                return (
                  <button
                    key={type || 'all'}
                    type="button"
                    onClick={() => setFilter(type)}
                    aria-pressed={isActive}
                    className={
                      type
                        ? `${tagStyle(type)} rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all ${
                            isActive ? 'opacity-100 ring-1 ring-current' : 'opacity-75 hover:opacity-100'
                          }`
                        : isActive
                          ? 'rounded-full border border-primary bg-primary/15 px-3.5 py-1.5 text-[12px] font-medium text-primary transition-colors'
                          : 'rounded-full border border-border px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground'
                    }
                  >
                    {type || 'Tous'}
                  </button>
                );
              })}
            </div>
          )}

          {visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune réalisation pour ce filtre.</p>
          ) : (
            <div ref={boxRef} className="relative" onMouseMove={onMove} onMouseLeave={() => setPreview(null)}>
              <Reveal>
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="hidden grid-cols-12 gap-x-4 border-b border-border/70 px-7 py-3.5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground md:grid">
                    <span className="col-span-2">Catégorie</span>
                    <span className="col-span-6">Réalisation</span>
                    <span className="col-span-3">Mots-clés</span>
                  </div>
                  <ul>
                    {visible.map((project) => (
                      <ProjectRow
                        key={project.id}
                        project={project}
                        onOpen={() => setActive(project)}
                        onPreview={onPreview}
                      />
                    ))}
                  </ul>
                </div>
              </Reveal>

              <div
                ref={previewRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
                style={{ width: PREVIEW_W }}
              >
                <div
                  className={cn(
                    'h-[180px] overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/50 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
                    preview ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  )}
                >
                  {preview?.image_url ? (
                    <img src={preview.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="project-preview flex h-full flex-col justify-between p-5">
                      {preview?.year && (
                        <span
                          className={cn(
                            'self-start rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]',
                            tagStyle(preview.year)
                          )}
                        >
                          {preview.year}
                        </span>
                      )}
                      <span className="font-heading text-[19px] font-semibold leading-snug tracking-[-0.015em]">
                        {preview?.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <ProjectDrawer project={active} onClose={() => setActive(null)} />
    </Section>
  );
}