import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { SECTION_LABEL, SECTION_LABEL_NAME } from '@/components/portfolio/styles';
import { skillGroups } from '@/data/portfolioContent';
import { cn } from '@/lib/utils';

export default function Skills() {
  return (
    <Section
      id="competences"
      index="05"
      eyebrow="Environnement"
      title="Outils et compétences pratiqués"
      lead="Un environnement de travail maîtrisé, du cadrage projet aux technologies et à l'intelligence artificielle appliquée."
    >
      <div className="divide-y divide-border/70 border-y border-border/70">
        {skillGroups.map((group, i) => (
          <Reveal key={group.label} delay={0.04 * i}>
            <div className="grid gap-4 py-6 md:grid-cols-12 md:items-center md:gap-8">
              <h3 className={cn(SECTION_LABEL, SECTION_LABEL_NAME, 'md:col-span-4')}>
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2 md:col-span-8">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border bg-card px-3 py-1.5 text-[12.5px] text-foreground/85 transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}