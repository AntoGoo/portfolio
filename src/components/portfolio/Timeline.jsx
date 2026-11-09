import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import useInView from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { currentYearFraction, toYearFraction } from '@/lib/dates';

function Gantt({ jobs }) {
  const [ref, on] = useInView({ threshold: 0.35 });
  const now = currentYearFraction();

  const rows = jobs
    .map((job) => {
      const start = toYearFraction(job.start);
      const end = toYearFraction(job.end);
      return start ? { ...job, from: start, to: Math.max(end ?? now, start), current: end === null } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.from - b.from);

  if (!rows.length) return null;

  const first = Math.floor(rows[0].from);
  const last = Math.floor(now);
  const span = Math.max(now - first, 1);
  const pos = (year) => ((year - first) / span) * 100;
  const ticks = [];
  for (let y = first; y < last - 2; y += 6) ticks.push(y);
  ticks.push(last);

  return (
    <div
      ref={ref}
      className={cn('rounded-xl border border-border bg-card p-5 md:p-8', on && 'is-on')}
      role="img"
      aria-label={`Diagramme du parcours de ${first} à ${last}`}
    >
      <div className="grid grid-cols-1 border-b border-border/70 pb-3 md:grid-cols-[240px_1fr]">
        <span className="hidden text-[10px] uppercase tracking-[0.24em] text-muted-foreground md:block">Poste</span>
        <div className="relative h-4">
          {ticks.map((y, i) => (
            <span
              key={y}
              className={cn(
                'absolute font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground',
                i % 2 === 1 && i !== ticks.length - 1 && 'hidden md:inline'
              )}
              style={{ left: `${i === ticks.length - 1 ? 100 : pos(y)}%`, transform: i === ticks.length - 1 ? 'translateX(-100%)' : i === 0 ? 'none' : 'translateX(-50%)' }}
            >
              {y}
            </span>
          ))}
        </div>
      </div>

      {rows.map((job, i) => (
        <div
          key={job.id || `${job.role}-${job.from}`}
          className="grid grid-cols-1 border-b border-border/70 last:border-none md:min-h-[72px] md:grid-cols-[240px_1fr] md:items-center"
        >
          <div className="pt-4 md:py-3 md:pr-4">
            <p className="font-heading text-[13.5px] font-semibold leading-tight tracking-[-0.01em] md:text-[15px]">
              {job.role}
            </p>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-primary">
              {[job.start, job.end].filter(Boolean).join(' — ')}
            </p>
          </div>
          <div className="gantt-track relative h-9 md:h-full md:min-h-[72px]" style={{ backgroundSize: `${100 / span}% 100%` }}>
            <div
              className={cn('gantt-bar', job.current && 'is-current')}
              style={{
                left: `${pos(job.from)}%`,
                width: `${Math.max(pos(job.to) - pos(job.from), 1)}%`,
                transitionDelay: `${0.1 + i * 0.25}s`,
              }}
            />
            <i className="gantt-ms" style={{ left: `${pos(job.from)}%`, transitionDelay: `${0.1 + i * 0.25}s` }} />
            {!job.current && (
              <i className="gantt-ms" style={{ left: `${pos(job.to)}%`, transitionDelay: `${0.85 + i * 0.25}s` }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Timeline({ experiences }) {
  const list = experiences || [];

  return (
    <Section
      id="parcours"
      index="07"
      eyebrow="Parcours"
      title="Parcours professionnel"
      lead="Une progression continue, du développement à la conduite de projets."
    >
      {experiences === null ? (
        <div className="space-y-4">
          <div className="h-[280px] animate-pulse rounded-xl border border-border bg-card/60" />
          {[0, 1].map((i) => (
            <div key={i} className="h-[140px] animate-pulse rounded-xl border border-border bg-card/60" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Le parcours sera publié prochainement.</p>
      ) : (
        <>
          <Reveal>
            <Gantt jobs={list} />
          </Reveal>

          <ol className="relative mt-14 space-y-10 border-l border-border/80 pl-7 md:mt-16 md:space-y-12 md:pl-10">
            {list.map((job, i) => (
              <Reveal key={job.id} delay={0.05 * i}>
                <li className="relative">
                  <span className="absolute -left-[33px] top-1.5 h-2.5 w-2.5 rounded-full border border-primary bg-background md:-left-[45px]" />
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-primary">
                      {[job.start, job.end].filter(Boolean).join(' — ')}
                    </span>
                    {job.company && (
                      <span className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                        {job.company}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-heading text-[19px] font-semibold tracking-[-0.015em] md:text-[21px]">
                    {job.role}
                  </h3>
                  {job.context && (
                    <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                      {job.context}
                    </p>
                  )}
                  {job.missions?.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {job.missions.map((mission) => (
                        <li key={mission} className="flex items-start gap-3 text-[13.5px] text-foreground/80">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                          {mission}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        </>
      )}
    </Section>
  );
}
