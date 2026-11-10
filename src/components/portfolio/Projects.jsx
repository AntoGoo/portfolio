import { useMemo, useState } from 'react';
import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectDrawer from '@/components/portfolio/ProjectDrawer';
import { cn } from '@/lib/utils';

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
      title="Des projets pilotés de bout en bout"
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
            <div className="flex flex-wrap gap-x-2 border-b border-border font-grotesk">
              {[null, ...types].map((type) => {
                const isActive = filter === type;
                return (
                  <button
                    key={type || 'all'}
                    type="button"
                    onClick={() => setFilter(type)}
                    aria-pressed={isActive}
                    className={cn(
                      '-mb-px flex min-h-[44px] items-center gap-2 border-b-2 px-3.5 text-[14px] transition-colors',
                      isActive
                        ? 'border-foreground font-semibold text-foreground'
                        : 'border-transparent font-medium text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-2 w-2 shrink-0 rounded-[2px]',
                        isActive ? 'bg-accent2' : 'border border-muted-foreground'
                      )}
                    />
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