import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { expertises } from '@/data/portfolioContent';

export default function Expertises() {
  return (
    <Section
      id="expertises"
      index="02"
      eyebrow="Expertises"
      title="Quatre domaines complémentaires"
    >
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border/60 sm:grid-cols-2">
        {expertises.map((item, i) => (
          <Reveal key={item.key} delay={0.05 * i} className="bg-card">
            <div className="group h-full p-7 transition-colors duration-300 hover:bg-secondary/40 md:p-9">
              <h3 className="font-heading text-[16px] font-semibold tracking-[-0.01em]">
                <span className="inline-flex rounded-md border border-border px-3 py-1 text-primary transition-colors group-hover:border-primary/60">
                  {item.title}
                </span>
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{item.summary}</p>
              <ul className="mt-6 space-y-2.5">
                {item.items.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-[13.5px] text-foreground/80">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/70" />
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