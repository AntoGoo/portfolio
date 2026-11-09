import { useMemo, useRef, useState } from 'react';
import Section from '@/components/portfolio/Section';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectDrawer from '@/components/portfolio/ProjectDrawer';

export default function Projects({ projects }) {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const boxRef = useRef(null);
  const list = projects || [];

  const types = useMemo(() => {
    const seen = new Map();
    list.forEach((project) => {
      const type = (project.year || '').trim();
      if (type) seen.set(type.toLowerCase(), type);
    });
    return [...seen.values()].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [list]);

  const visible = filter
    ? list.filter((project) => (project.year || '').trim().toLowerCase() === filter.toLowerCase())
    : list;

  const onMove = (event) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (box) setPos({ x: Math.min(event.clientX - box.left + 40, box.width - 270), y: event.clientY - box.top });
  };

  return (
    <Section id="realisations" title="Des projets pilotés de bout en bout">
      {projects === null ? (
        <div className="space-y-px">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[72px] animate-pulse border-b border-border bg-card" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-muted-foreground">Les réalisations seront publiées prochainement.</p>
      ) : (
        <>
          {types.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium" role="group" aria-label="Filtrer par catégorie">
              {[null, ...types].map((type) => (
                <button
                  key={type || 'all'}
                  type="button"
                  onClick={() => setFilter(type)}
                  aria-pressed={filter === type}
                  className="line-link text-muted-foreground aria-pressed:text-foreground hover:text-foreground"
                >
                  {type || 'Toutes'}
                </button>
              ))}
            </div>
          )}

          {visible.length === 0 ? (
            <p className="text-muted-foreground">Aucune réalisation pour ce filtre.</p>
          ) : (
            <div ref={boxRef} className="relative border-t border-foreground" onMouseMove={onMove}>
              <div className="hidden grid-cols-12 gap-x-4 border-b border-foreground py-2 text-[13px] text-muted-foreground md:grid">
                <span className="col-span-2">Catégorie</span>
                <span className="col-span-6">Réalisation</span>
                <span className="col-span-3">Mots-clés</span>
                <span className="col-span-1 text-right">Lien</span>
              </div>
              {visible.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => setActive(project)}
                  onPreview={setPreview}
                />
              ))}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute z-20 hidden h-[180px] w-[270px] overflow-hidden bg-primary transition-opacity duration-200 md:block"
                style={{
                  left: pos.x,
                  top: pos.y,
                  transform: 'translateY(-50%)',
                  opacity: preview ? 1 : 0,
                }}
              >
                {preview?.image_url ? (
                  <img src={preview.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-end p-4 text-[1.4rem] font-bold leading-tight tracking-[-0.03em] text-primary-foreground">
                    {preview?.title}
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <ProjectDrawer project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
