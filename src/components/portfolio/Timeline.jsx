import Section from '@/components/portfolio/Section';
import useInView from '@/hooks/useInView';

const parseYear = (value) => {
  const n = parseInt(String(value || '').slice(0, 4), 10);
  return Number.isFinite(n) ? n : null;
};

function Gantt({ jobs }) {
  const [ref, on] = useInView({ threshold: 0.35, once: false });
  const now = new Date().getFullYear();

  const rows = jobs
    .map((job) => {
      const start = parseYear(job.start);
      const end = parseYear(job.end) ?? now;
      return start ? { ...job, from: start, to: Math.max(end, start), current: !parseYear(job.end) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.from - b.from);

  if (!rows.length) return null;

  const first = rows[0].from;
  const span = Math.max(now - first, 1);
  const pos = (year) => ((year - first) / span) * 100;
  const ticks = [];
  for (let y = first; y <= now; y += 6) ticks.push(y);

  return (
    <div ref={ref} className={`border border-foreground bg-card p-4 md:p-8 ${on ? 'is-on' : ''}`}>
      <div className="grid grid-cols-[110px_1fr] border-b border-foreground pb-1.5 text-[12px] text-muted-foreground md:grid-cols-[230px_1fr]">
        <span>Poste</span>
        <div className="relative h-4">
          {ticks.map((y, i) => (
            <span key={y} className={`absolute ${i % 2 ? 'hidden md:inline' : ''}`} style={{ left: `${pos(y)}%`, transform: 'translateX(-50%)' }}>
              {y}
            </span>
          ))}
        </div>
      </div>

      {rows.map((job, i) => (
        <div
          key={job.id || `${job.role}-${job.from}`}
          className="grid min-h-[76px] grid-cols-[110px_1fr] items-center border-b border-border md:grid-cols-[230px_1fr]"
        >
          <div className="pr-3">
            <p className="text-[14px] font-semibold leading-tight md:text-[16px]">{job.role}</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground md:text-[13px]">
              {[job.start, job.end].filter(Boolean).join(' – ')}
            </p>
          </div>
          <div className="gantt-track relative h-full min-h-[76px]" style={{ backgroundSize: `${100 / span}% 100%` }}>
            <div
              className={`gantt-bar ${job.current ? 'is-current' : ''}`}
              style={{
                left: `${pos(job.from)}%`,
                width: `${Math.max(pos(job.to) - pos(job.from), 1)}%`,
                transitionDelay: `${0.1 + i * 0.4}s`,
              }}
            />
            {!job.current && (
              <i className="gantt-ms" style={{ left: `${pos(job.to)}%`, transitionDelay: `${1.1 + i * 0.4}s` }} />
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
      title="Parcours professionnel"
      lead="Une progression continue, du développement à la conduite de projets."
    >
      {experiences === null ? (
        <div className="h-[300px] animate-pulse border border-border bg-card" />
      ) : list.length === 0 ? (
        <p className="text-muted-foreground">Le parcours sera publié prochainement.</p>
      ) : (
        <>
          <Gantt jobs={list} />

          <ol className="mt-14 border-t border-foreground">
            {list.map((job) => (
              <li key={job.id || job.role} className="grid grid-cols-12 gap-y-3 border-b border-border py-7">
                <div className="col-span-12 md:col-span-3">
                  <p className="text-[14px] text-muted-foreground">
                    {[job.start, job.end].filter(Boolean).join(' – ')}
                  </p>
                  {job.company && <p className="mt-0.5 text-[15px] font-medium">{job.company}</p>}
                </div>
                <div className="col-span-12 md:col-span-9">
                  <h3 className="text-[1.4rem] font-bold leading-tight tracking-[-0.02em]">{job.role}</h3>
                  {job.context && (
                    <p className="mt-2 max-w-[62ch] text-[16px] leading-relaxed text-muted-foreground">{job.context}</p>
                  )}
                  {job.missions?.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {job.missions.map((mission) => (
                        <li key={mission} className="flex items-start gap-3 text-[15px]">
                          <span className="jalon mt-[7px] !h-[7px] !w-[7px]" aria-hidden="true" />
                          {mission}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </Section>
  );
}
