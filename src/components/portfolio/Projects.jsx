import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import ProjectDrawer from '@/components/portfolio/ProjectDrawer';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';

// Les réalisations comme un registre de projets : numéro, intitulé, domaine.
export default function Projects({ projects }) {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState(null);
  const list = projects || [];

  const types = useMemo(() => {
    const counts = new Map();
    list.forEach((project) => {
      const type = (project.year || '').trim();
      if (!type) return;
      const key = type.toLowerCase();
      const current = counts.get(key);
      counts.set(key, { label: current?.label || type, count: (current?.count || 0) + 1 });
    });
    return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label, 'fr'));
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
      lead="Contexte, rôle, méthode et résultats : chaque fiche détaille ce qui a été fait et comment."
    >
      {projects === null ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse bg-secondary/70" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-muted-foreground">Les réalisations seront publiées prochainement.</p>
      ) : (
        <>
          {types.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3" role="group" aria-label="Filtrer par domaine">
              {[{ label: 'Tous', count: list.length, value: null }, ...types.map((t) => ({ ...t, value: t.label }))].map(
                (item) => {
                  const isActive = filter === item.value;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setFilter(item.value)}
                      aria-pressed={isActive}
                      className={cn(
                        'font-mono text-[12.5px] uppercase tracking-[0.06em] transition-colors duration-200',
                        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <span className={cn('border-b pb-1', isActive ? 'border-primary' : 'border-transparent')}>
                        {item.label}
                      </span>
                      <sup className="ml-1 text-[10px] text-primary">{item.count}</sup>
                    </button>
                  );
                }
              )}
            </div>
          )}

          <ol className="border-t border-foreground/80">
            {visible.map((project, i) => (
              <li key={project.id} className="border-b rm-rule">
                <Reveal delay={0.04 * i} y={14}>
                  <button
                    type="button"
                    onClick={() => setActive(project)}
                    className="group grid w-full grid-cols-12 items-baseline gap-x-3 gap-y-2 md:gap-x-6 py-7 text-left transition-colors duration-300 hover:bg-secondary/50 md:py-9"
                  >
                    <span className="col-span-2 font-mono text-[13px] tabular-nums text-muted-foreground transition-colors group-hover:text-primary md:col-span-1">
                      {String(list.indexOf(project) + 1).padStart(2, '0')}
                    </span>
                    <span className="col-span-10 md:col-span-7">
                      <span className="block font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.08] tracking-[-0.015em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                        {project.title}
                      </span>
                      {project.context && (
                        <span className="mt-3 line-clamp-2 block max-w-[60ch] text-[15px] leading-[1.5] text-muted-foreground">
                          {project.context}
                        </span>
                      )}
                    </span>
                    <span className="col-span-10 col-start-3 flex flex-wrap items-center gap-x-3 gap-y-1 md:col-span-3 md:col-start-auto md:justify-end">
                      {project.logo_url && (
                        <span className="h-7 w-7 shrink-0">
                          <Image src={project.logo_url} alt="" className="h-full w-full" fittingType="fit" />
                        </span>
                      )}
                      {project.year && <span className="rm-label">{project.year}</span>}
                    </span>
                    <span className="hidden justify-end md:col-span-1 md:flex">
                      <span className="flex h-10 w-10 items-center justify-center border rm-rule transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </span>
                    <span className="sr-only">Ouvrir la fiche</span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ol>
        </>
      )}

      <ProjectDrawer project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
