import { useMemo, useState } from 'react';
import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectDrawer from '@/components/portfolio/ProjectDrawer';
import { tagStyle } from '@/lib/tagStyle';

export default function Projects({ projects }) {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState(null);
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

  return (
    <Section
      id="realisations"
      index="03"
      eyebrow="Réalisations"
      title={
        <>
          Des projets pilotés <br className="hidden md:inline" />
          de bout en bout.
        </>
      }
    >
      {projects === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[260px] animate-pulse rounded-xl border border-border bg-card/60"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Les réalisations seront publiées prochainement.</p>
      ) : (
        <div className="space-y-8">
          {types.length > 0 && (
            <div className="flex flex-wrap gap-2 font-grotesk">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((project, i) => (
                <Reveal key={project.id} delay={0.04 * i}>
                  <ProjectCard project={project} onOpen={() => setActive(project)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      )}

      <ProjectDrawer project={active} onClose={() => setActive(null)} />
    </Section>
  );
}