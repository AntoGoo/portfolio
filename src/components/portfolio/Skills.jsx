import Section from '@/components/portfolio/Section';
import { skillGroups } from '@/data/portfolioContent';

export default function Skills() {
  return (
    <Section
      id="competences"
      title="Outils et compétences pratiqués"
      lead="Du cadrage projet aux technologies et à l'intelligence artificielle appliquée."
    >
      <dl className="border-t border-foreground">
        {skillGroups.map((group) => (
          <div key={group.label} className="grid grid-cols-12 gap-y-2 border-b border-border py-5">
            <dt className="col-span-12 text-[17px] font-semibold md:col-span-3">{group.label}</dt>
            <dd className="col-span-12 text-[16px] leading-relaxed text-muted-foreground md:col-span-9">
              {group.items.join(', ')}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
