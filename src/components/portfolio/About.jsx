import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';

const principles = [
  {
    title: 'Interface',
    text: 'Traduire une demande métier en solution technique réaliste, sans jargon inutile.',
  },
  {
    title: 'Pragmatisme',
    text: 'Des périmètres assumés, des priorités claires et des décisions tracées.',
  },
  {
    title: 'Résultats',
    text: 'Des livrables utiles, adoptés par les utilisateurs et faits pour évoluer.',
  },
];

export default function About() {
  return (
    <Section id="profil" index="01" eyebrow="Profil" title="Un parcours construit sur le terrain">
      <div className="grid gap-x-10 gap-y-14 md:grid-cols-12">
        <Reveal className="md:col-span-6 md:col-start-4">
          <p className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.2] tracking-[-0.01em]">
            Dirigeant d'une société d'ingénierie événementielle pendant 16 ans, puis chef de projet en GED et en
            jeux vidéo / serious games : mon parcours mêle développement et conduite de projets.
          </p>
          <div className="mt-8 space-y-5 text-[17px] leading-[1.6] text-foreground/75">
            <p>
              Cette expérience m'a appris à traduire une demande métier en solution concrète, à arbitrer quand c'est
              nécessaire et à tenir le cap jusqu'à la mise en service.
            </p>
            <p>
              Je travaille avec des interlocuteurs variés (directions, métiers, équipes techniques, prestataires) et je
              m'attache à rendre les projets lisibles : objectifs clairs, périmètre assumé, suivi régulier et décisions
              documentées.
            </p>
            <p>
              Mon approche reste orientée usage : une solution n'a de valeur que si elle fonctionne, si elle est
              adoptée et si elle peut évoluer avec les besoins.
            </p>
          </div>
        </Reveal>

        <ol className="grid border-t rm-rule md:col-span-12 md:grid-cols-3">
          {principles.map((item, i) => (
            <li
              key={item.title}
              className="border-b rm-rule py-7 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
            >
              <Reveal delay={0.08 * i}>
                <p className="font-mono text-[12px] text-primary">0{i + 1}</p>
                <h3 className="mt-3 font-display text-[1.75rem] leading-none">{item.title}</h3>
                <p className="mt-3 max-w-[34ch] text-[15.5px] leading-[1.55] text-muted-foreground">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
