import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';

export default function Timeline({ experiences }) {
  const list = experiences || [];

  return (
    <Section
      id="parcours"
      index="06"
      eyebrow="Parcours"
      title="Parcours professionnel"
      lead="Une progression continue, du développement à la conduite de projets."
    >
      {experiences === null ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-[140px] animate-pulse rounded-xl border border-border bg-card/60" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Le parcours sera publié prochainement.</p>
      ) : (
        <ol className="relative space-y-10 border-l border-border/80 pl-7 md:space-y-12 md:pl-10">
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
      )}
    </Section>
  );
}