import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { skillGroups } from '@/data/portfolioContent';

export default function Skills() {
  return (
    <Section
      id="competences"
      index="06"
      eyebrow="Environnement"
      title="Outils et compétences pratiqués"
      lead="Du cadrage projet aux technologies, jusqu'à l'intelligence artificielle appliquée."
    >
      <dl className="border-t border-foreground/80">
        {skillGroups.map((group, i) => (
          <Reveal key={group.label} delay={0.04 * i}>
            <div className="grid gap-3 border-b rm-rule py-6 md:grid-cols-12 md:gap-10">
              <dt className="rm-label md:col-span-3 md:pt-1">{group.label}</dt>
              <dd className="font-display text-[clamp(1.35rem,1.9vw,1.75rem)] leading-[1.3] md:col-span-9">
                {group.items.map((item, j) => (
                  <span key={item}>
                    {item}
                    {j < group.items.length - 1 && <span className="mx-2 text-primary/60">·</span>}
                  </span>
                ))}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
