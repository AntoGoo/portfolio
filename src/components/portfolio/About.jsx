import Section from '@/components/portfolio/Section';

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
    <Section id="profil" title="Un parcours construit sur le terrain">
      <div className="grid grid-cols-12 gap-y-12">
        <div className="col-span-12 space-y-5 md:col-span-7 md:pr-10">
          <p className="text-[1.3rem] font-medium leading-snug tracking-[-0.01em]">
            Dirigeant d'une société d'ingénierie événementielle pendant 16 ans, puis chef de projet en GED et en
            jeux vidéo / serious games : mon parcours mêle développement et conduite de projets.
          </p>
          <p className="max-w-[62ch] text-[16px] leading-relaxed text-muted-foreground">
            Cette expérience m'a appris à traduire une demande métier en solution concrète, à arbitrer quand c'est
            nécessaire et à tenir le cap jusqu'à la mise en service. Je travaille avec des interlocuteurs variés
            (directions, métiers, équipes techniques, prestataires) et je m'attache à rendre les projets lisibles :
            objectifs clairs, périmètre assumé, suivi régulier et décisions documentées.
          </p>
          <p className="max-w-[62ch] text-[16px] leading-relaxed text-muted-foreground">
            Mon approche reste orientée usage : une solution n'a de valeur que si elle fonctionne, si elle est
            adoptée et si elle peut évoluer avec les besoins.
          </p>
        </div>

        <dl className="col-span-12 border-t border-foreground md:col-span-5">
          {principles.map((item) => (
            <div key={item.title} className="border-b border-border py-5">
              <dt className="flex items-center gap-3 text-[17px] font-semibold">
                <span className="jalon" aria-hidden="true" />
                {item.title}
              </dt>
              <dd className="mt-1.5 pl-[22px] text-[15px] leading-relaxed text-muted-foreground">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
