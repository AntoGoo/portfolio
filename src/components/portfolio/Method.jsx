import { useReducedMotion } from 'framer-motion';
import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { methodSteps } from '@/data/portfolioContent';
import { cn } from '@/lib/utils';

// Bout droit du rail horizontal de chaque étape : il franchit la gouttière
// (28 px) jusqu'à l'étape voisine et s'arrête au bord de la grille en fin de
// ligne. En md, la grille a 4 colonnes (01-04, puis 05-07 : le rail de 07
// couvre aussi la 4e colonne vide) ; en lg, une seule ligne de 7.
function railEnd(i, count) {
  if (i === count - 1) return 'md:right-[calc(-100%_-_28px)] lg:right-0';
  if (i === 3) return 'md:right-0 lg:-right-7';
  return 'md:-right-7';
}

export default function Method() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="methode"
      index="04"
      eyebrow="Méthodologie"
      title="Une démarche agile en sept étapes"
    >
      <ol className="grid gap-y-8 md:grid-cols-4 md:gap-x-7 md:gap-y-14 lg:grid-cols-7">
        {methodSteps.map((step, i) => (
          <li key={step.number} className="font-label relative pl-6 md:pl-0">
            {/* rail mobile : segment vertical jusqu'au repère suivant */}
            {i < methodSteps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -bottom-[50px] left-1 top-[18px] w-px bg-[#3A414D] md:hidden"
              />
            )}
            {/* rail md+ : segment horizontal centré sur le repère */}
            <span
              aria-hidden="true"
              className={cn('absolute left-0 top-1 hidden h-px bg-[#3A414D] md:block', railEnd(i, methodSteps.length))}
            />
            <span aria-hidden="true" className="absolute left-0 top-[14px] h-[9px] w-[9px] bg-primary md:relative md:top-0 md:block" />

            <Reveal delay={0.06 * i} y={reduceMotion ? 0 : undefined}>
              <span className="block text-[36px] font-medium leading-none tracking-[-0.03em] text-foreground tabular-nums md:mt-7 md:text-[52px]">
                {step.number}
              </span>
              <h3 className="mt-3.5 text-[18px] font-semibold leading-snug tracking-[-0.01em] text-foreground md:mt-[22px]">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] font-normal leading-[1.5] text-muted-foreground">{step.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
