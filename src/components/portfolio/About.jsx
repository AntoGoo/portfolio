import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { cn } from '@/lib/utils';

const principles = [
  {
    title: 'Interface',
    lead: 'Traduire une demande métier en solution technique réaliste, sans jargon inutile.',
    detail: [
      "Je fais le lien entre ceux qui expriment le besoin et ceux qui le construisent. Reformuler ce que le métier attend vraiment, poser les contraintes techniques en termes clairs, repérer tôt ce qui coûtera cher plus tard.",
      "Plus de vingt ans de projets, de l'événementiel à la GED en passant par le jeu vidéo, m'ont appris à parler les deux langues et à faire en sorte que chacun comprenne ce que l'autre demande.",
    ],
  },
  {
    title: 'Pragmatisme',
    lead: 'Des périmètres assumés, des priorités claires et des décisions tracées.',
    detail: [
      'Un périmètre réduit qui tient ses délais, et chaque arbitrage écrit pour savoir plus tard pourquoi on a tranché.',
    ],
  },
  {
    title: 'Résultats',
    lead: 'Des livrables utiles, adoptés par les utilisateurs et faits pour évoluer.',
    detail: [
      "Un projet se juge à l'usage trois mois après la mise en service, avec des utilisateurs impliqués dès la recette.",
    ],
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
      <div className="space-y-[18px] md:w-8/12">
        <p className="max-w-[65ch] text-[19px] leading-relaxed text-foreground/85">
          Dirigeant d'une société d'ingénierie événementielle pendant 16 ans, puis chef de projet en GED et
          en jeux vidéo / serious games : mon parcours mêle développement et conduite de projets.
          Cette expérience m'a appris à traduire une demande métier en solution concrète,
          à arbitrer quand c'est nécessaire et à tenir le cap jusqu'à la mise en service.
        </p>
        <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
          Je travaille avec des interlocuteurs variés — directions, métiers, équipes techniques, prestataires —
          et je m'attache à rendre les projets lisibles : objectifs clairs, périmètre assumé, suivi régulier et
          décisions documentées.
        </p>
        <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
          Mon approche reste orientée usage : une solution n'a de valeur que si elle fonctionne, si elle est
          adoptée et si elle peut évoluer avec les besoins.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {principles.map((item, i) => {
          const featured = i === 0;
          return (
            <Reveal key={item.title} delay={0.06 * i} className={cn(featured && 'md:row-span-2')}>
              <div
                className={cn(
                  'h-full rounded-2xl border',
                  featured ? 'border-muted-foreground/25 bg-secondary p-7 md:p-9' : 'border-border bg-card p-7'
                )}
              >
                <h3
                  className={cn(
                    'font-heading text-foreground',
                    featured
                      ? 'text-[34px] font-extrabold leading-[1.1] tracking-[-0.02em]'
                      : 'text-[20px] font-bold leading-snug tracking-[-0.01em]'
                  )}
                >
                  {item.title}
                </h3>
                <div className={cn('mt-4 flex flex-col gap-3.5', featured && 'max-w-[470px]')}>
                  <p className="text-[17px] leading-relaxed text-foreground/85">{item.lead}</p>
                  {item.detail.map((text) => (
                    <div key={text} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-primary" />
                      <p className="text-[15px] leading-relaxed text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
