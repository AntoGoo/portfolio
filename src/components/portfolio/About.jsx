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
    text: "Des livrables utiles, adoptés par les utilisateurs et faits pour évoluer.",
  },
];

export default function About() {
  return (
    <Section
      id="profil"
      index="01"
      eyebrow="Profil"
      title="Un parcours construit sur le terrain"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="space-y-5 md:col-span-7">
          <p className="text-[15px] leading-relaxed text-foreground/85">
            Dirigeant d'une société d'ingénierie événementielle pendant 16 ans, puis chef de projet en GED et
            en jeux vidéo / serious games : mon parcours mêle développement et conduite de projets.
            Cette expérience m'a appris à traduire une demande métier en solution concrète,
            à arbitrer quand c'est nécessaire et à tenir le cap jusqu'à la mise en service.
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Je travaille avec des interlocuteurs variés — directions, métiers, équipes techniques, prestataires —
            et je m'attache à rendre les projets lisibles : objectifs clairs, périmètre assumé, suivi régulier et
            décisions documentées.
          </p>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Mon approche reste orientée usage : une solution n'a de valeur que si elle fonctionne, si elle est
            adoptée et si elle peut évoluer avec les besoins.
          </p>
        </div>

        <div className="md:col-span-5">
          <div className="space-y-px overflow-hidden rounded-xl border border-border bg-border/60">
            {principles.map((item, i) => (
              <Reveal key={item.title} delay={0.06 * i}>
                <div className="bg-card p-6">
                  <h3 className="font-heading text-[15px] font-semibold tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}