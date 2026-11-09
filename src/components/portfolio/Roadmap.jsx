import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Section from '@/components/portfolio/Section';
import { experienceSpans } from '@/lib/roadmap';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1];

// Le parcours présenté comme un diagramme de Gantt : une ligne par poste, une barre par période.
export default function Roadmap({ experiences }) {
  const [open, setOpen] = useState(null);
  const now = new Date();
  const spans = experienceSpans(experiences || [], now);

  if (experiences === null) {
    return (
      <Section id="parcours" index="02" eyebrow="Feuille de route" title="Un parcours, jalon par jalon">
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse bg-secondary/70" />
          ))}
        </div>
      </Section>
    );
  }

  if (!spans.length) {
    return (
      <Section id="parcours" index="02" eyebrow="Feuille de route" title="Un parcours, jalon par jalon">
        <p className="text-muted-foreground">Le parcours sera publié prochainement.</p>
      </Section>
    );
  }

  const nowValue = now.getFullYear() + now.getMonth() / 12;
  const from = Math.floor(spans[0].startValue);
  const to = Math.ceil(Math.max(nowValue, ...spans.map((job) => job.endValue)));
  const range = to - from;
  const pct = (value) => `${((value - from) / range) * 100}%`;
  const ticks = [];
  for (let year = Math.ceil(from / 5) * 5; year < to; year += 5) {
    // pas de graduation collée aux bornes, pour que les libellés ne se chevauchent pas
    if (year - from >= range * 0.08 && to - year >= range * 0.08) ticks.push(year);
  }

  return (
    <Section
      id="parcours"
      index="02"
      eyebrow="Feuille de route"
      title="Un parcours, jalon par jalon"
      lead="Du développement à la conduite de projets. Chaque ligne est un poste ; ouvrez-la pour voir les missions."
    >
      <div className="relative">
        {/* Axe des années */}
        <div className="grid grid-cols-12 md:gap-x-10">
          <div className="relative col-span-12 h-7 md:col-span-8 md:col-start-5">
            {[from, ...ticks, to].map((year, i, all) => (
              <span
                key={year}
                className={cn(
                  'absolute top-0 font-mono text-[11.5px] tabular-nums text-muted-foreground',
                  i === all.length - 1 ? '-translate-x-full' : i > 0 && '-translate-x-1/2',
                  i > 0 && i < all.length - 1 && 'hidden sm:block'
                )}
                style={{ left: pct(year) }}
              >
                {year}
              </span>
            ))}
          </div>
        </div>

        <ol className="border-t border-foreground/80">
          {spans.map((job, i) => {
            const isOpen = open === job.id;
            const panelId = `poste-${job.id}`;
            return (
              <motion.li
                key={job.id}
                className="border-b rm-rule"
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, margin: '-40px' }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : job.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group grid w-full grid-cols-12 items-center gap-y-4 md:gap-x-10 py-6 text-left transition-colors duration-300 hover:bg-secondary/50 md:py-7"
                >
                  <span className="col-span-12 flex items-start justify-between gap-4 md:col-span-4">
                    <span>
                      <span className="rm-label block">{job.company || 'Poste'}</span>
                      <span className="mt-1.5 block font-display text-[clamp(1.35rem,1.6vw,1.6rem)] leading-[1.15] tracking-[-0.01em] transition-colors duration-300 group-hover:text-primary">
                        {job.role}
                      </span>
                    </span>
                    <Plus
                      className={cn(
                        'mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 md:hidden',
                        isOpen && 'rotate-45'
                      )}
                    />
                  </span>

                  <span className="relative col-span-12 block h-12 md:col-span-8">
                    <span
                      className="rm-graph absolute inset-0"
                      style={{ '--rm-col': `${100 / range}%` }}
                      aria-hidden="true"
                    />
                    <motion.span
                      className={cn(
                        'absolute top-[14px] h-3 origin-left',
                        job.ongoing ? 'bg-primary' : 'bg-foreground group-hover:bg-primary'
                      )}
                      style={{ left: pct(job.startValue), width: `calc(${pct(job.endValue)} - ${pct(job.startValue)})` }}
                      variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                      transition={{ duration: 1.1, delay: 0.15 + (i % 3) * 0.06, ease }}
                    />
                    <span
                      className="absolute bottom-0 whitespace-nowrap font-mono text-[11px] tabular-nums text-muted-foreground"
                      style={
                        job.startValue - from > range * 0.6
                          ? { right: `calc(100% - ${pct(job.endValue)})` }
                          : { left: pct(job.startValue) }
                      }
                    >
                      {job.start} → {job.ongoing ? "aujourd'hui" : job.end}
                    </span>
                    <Plus
                      className={cn(
                        'absolute -right-7 top-[12px] hidden h-4 w-4 text-muted-foreground transition-transform duration-300 md:block',
                        isOpen && 'rotate-45 text-primary'
                      )}
                      aria-hidden="true"
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 pb-8 md:gap-x-10">
                        <div className="col-span-12 md:col-span-8 md:col-start-5">
                          {job.context && <p className="rm-label normal-case tracking-[0.02em]">{job.context}</p>}
                          {job.missions?.length > 0 && (
                            <ul className="mt-4 space-y-2.5">
                              {job.missions.map((mission) => (
                                <li key={mission} className="flex gap-3 text-[16px] leading-[1.5] text-foreground/85">
                                  <span className="mt-[0.55em] h-px w-3 shrink-0 bg-primary" />
                                  {mission}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
