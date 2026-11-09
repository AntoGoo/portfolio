import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { expertises } from '@/data/portfolioContent';

// Les expertises présentées comme les lots d'un marché.
export default function Expertises() {
  return (
    <Section
      id="expertises"
      index="04"
      eyebrow="Expertises"
      title="Quatre lots, un seul interlocuteur"
      className="bg-secondary/60"
    >
      <div className="grid border-t border-foreground/80 md:grid-cols-2">
        {expertises.map((item, i) => (
          <Reveal
            key={item.key}
            delay={0.06 * (i % 2)}
            className="border-b rm-rule py-9 md:px-10 md:odd:border-r md:odd:pl-0 md:even:pr-0 md:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <p className="rm-label">
              Lot <span className="text-primary">0{i + 1}</span>
            </p>
            <h3 className="mt-4 font-display text-[clamp(1.9rem,2.8vw,2.6rem)] leading-[1.02] tracking-[-0.015em]">
              {item.title}
            </h3>
            <p className="mt-4 max-w-[44ch] text-[16px] leading-[1.55] text-muted-foreground">{item.summary}</p>
            <ul className="mt-7 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {item.items.map((line) => (
                <li key={line} className="flex gap-3 font-mono text-[13px] leading-[1.5] text-foreground/80">
                  <span className="text-primary">—</span>
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
