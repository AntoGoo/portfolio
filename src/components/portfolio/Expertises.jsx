import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { expertises } from '@/data/portfolioContent';
import { cn } from '@/lib/utils';

// Ordre d'affichage (et d'empilement en mobile) et place de chaque carte dans
// la grille bento : 1 colonne, 2 en tablette, 3 colonnes sur 2 rangées en desktop.
const LAYOUT = [
  { key: 'projet', className: 'sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-span-2 lg:row-start-1', featured: true },
  { key: 'gouvernance', className: 'lg:col-start-2 lg:row-start-1' },
  { key: 'management', className: 'lg:col-start-3 lg:row-start-1' },
  { key: 'techno', className: 'sm:col-span-2 lg:col-start-2 lg:row-start-2', twoColumns: true },
];

function Bullet() {
  return <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-[2px] bg-primary" />;
}

export default function Expertises() {
  const cards = LAYOUT.map((slot) => ({ ...slot, item: expertises.find((e) => e.key === slot.key) })).filter(
    (card) => card.item
  );

  return (
    <Section
      id="expertises"
      index="02"
      eyebrow="Expertises"
      title="Quatre domaines complémentaires"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ key, className, featured, twoColumns, item }, i) => (
          <Reveal key={key} delay={0.05 * i} className={className}>
            <div
              className={cn(
                'h-full rounded-2xl border p-7 md:p-8',
                featured ? 'border-muted-foreground/25 bg-secondary' : 'border-border bg-card'
              )}
            >
              <h3
                className={cn(
                  'font-heading',
                  featured
                    ? 'text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground'
                    : 'text-[20px] font-bold leading-snug tracking-[-0.01em] text-primary'
                )}
              >
                {item.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{item.summary}</p>
              <ul className={cn('mt-6', twoColumns && 'grid sm:grid-cols-2 sm:gap-x-8')}>
                {item.items.map((line) => (
                  <li
                    key={line}
                    className={cn(
                      'flex items-center gap-3 border-t border-border text-[13.5px] text-foreground/80',
                      featured ? 'py-3.5' : 'py-2.5'
                    )}
                  >
                    <Bullet />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
